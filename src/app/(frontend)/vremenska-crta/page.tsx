import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";
import { Timeline } from "@/components/Timeline";
import type { TimelineEvent } from "@/components/Timeline";
import { notArchived, publishedFilter } from "@/lib/query-helpers";

export const revalidate = 3600;

export const metadata = {
  title: "Vremenska crta | Noćna mora Željka Malnara",
  description: "Kronologija najvažnijih događaja",
};

export default async function TimelinePage() {
  const payload = await getPayload();
  const { user } = await payload.auth({ headers: await headers() });
  const isAdmin = user?.role === "admin";

  const [timelineEventsResult, mainParticipants, publishedVideos] =
    await Promise.all([
      payload.find({
        collection: "timeline-events",
        sort: "eventDate",
        limit: 200,
        depth: 1,
      }),
      payload.find({
        collection: "participants",
        where: {
          and: [
            { type: { equals: "main" } },
            notArchived,
            { or: [{ birthDate: { exists: true } }, { deathDate: { exists: true } }] },
          ],
        },
        limit: 200,
        depth: 1,
      }),
      payload.find({
        collection: "videos",
        where: {
          and: [...publishedFilter(isAdmin), { airedDate: { exists: true } }, notArchived],
        },
        limit: 500,
        depth: 1,
      }),
    ]);

  // Transform timeline events (pass-through)
  const timelineEvents: TimelineEvent[] = timelineEventsResult.docs.map(
    (doc) => ({
      id: String(doc.id),
      title: doc.title,
      description: doc.description ?? null,
      eventDate: doc.eventDate,
      image:
        doc.image && typeof doc.image === "object" && "url" in doc.image
          ? {
              url: doc.image.url as string,
              alt: (doc.image as any).alt || doc.title,
            }
          : null,
      relatedVideo:
        doc.relatedVideo &&
        typeof doc.relatedVideo === "object" &&
        "slug" in doc.relatedVideo
          ? {
              slug: doc.relatedVideo.slug as string,
              title: (doc.relatedVideo as any).title,
            }
          : null,
      category: "event" as const,
      link: null,
    }),
  );

  const bornLabel = (gender: string | null | undefined) => {
    if (gender === "female") return "Rođena";
    if (gender === "male") return "Rođen";
    return "Rođen/a";
  };

  const diedLabel = (gender: string | null | undefined) => {
    if (gender === "female") return "Preminula";
    if (gender === "male") return "Preminuo";
    return "Preminuo/la";
  };

  // Transform birth events
  const birthEvents: TimelineEvent[] = mainParticipants.docs
    .filter((p) => p.birthDate)
    .map((p) => ({
      id: `birth-${p.id}`,
      title: `${bornLabel(p.gender)}: ${p.fullName || `${p.firstName} ${p.lastName}`}`,
      description: null,
      eventDate: p.birthDate!,
      image:
        p.photo && typeof p.photo === "object" && "url" in p.photo
          ? {
              url: p.photo.url as string,
              alt: p.fullName || `${p.firstName} ${p.lastName}`,
              credit: (p.photo as any).credit ?? null,
            }
          : null,
      relatedVideo: null,
      category: "birth" as const,
      link: { href: `/glumci/${p.slug}`, label: "Pogledaj profil" },
    }));

  // Transform death events
  const deathEvents: TimelineEvent[] = mainParticipants.docs
    .filter((p) => p.deathDate)
    .map((p) => ({
      id: `death-${p.id}`,
      title: `${diedLabel(p.gender)}: ${p.fullName || `${p.firstName} ${p.lastName}`}`,
      description: null,
      eventDate: p.deathDate!,
      image:
        p.photo && typeof p.photo === "object" && "url" in p.photo
          ? {
              url: p.photo.url as string,
              alt: p.fullName || `${p.firstName} ${p.lastName}`,
              credit: (p.photo as any).credit ?? null,
            }
          : null,
      relatedVideo: null,
      category: "death" as const,
      link: { href: `/glumci/${p.slug}`, label: "Pogledaj profil" },
    }));

  // Transform video aired events
  const videoEvents: TimelineEvent[] = publishedVideos.docs
    .filter((v) => v.airedDate)
    .map((v) => ({
      id: `video-${v.id}`,
      title: v.title,
      description: null,
      eventDate: v.airedDate!,
      image:
        v.thumbnail && typeof v.thumbnail === "object" && "url" in v.thumbnail
          ? { url: v.thumbnail.url as string, alt: v.title }
          : null,
      relatedVideo: null,
      category: "aired" as const,
      link: { href: `/video/${v.slug}`, label: "Pogledaj epizodu" },
    }));

  const allEvents = [
    ...timelineEvents,
    ...birthEvents,
    ...deathEvents,
    ...videoEvents,
  ].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-foreground">
        Vremenska crta
      </h1>

      {allEvents.length > 0 ? (
        <Timeline events={allEvents} />
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          Još nema događaja na vremenskoj crti.
        </p>
      )}
    </div>
  );
}
