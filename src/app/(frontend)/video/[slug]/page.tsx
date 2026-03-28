import { notFound } from "next/navigation";
import Link from "next/link";
import { getPayload } from "@/lib/payload";
import { VideoEmbed } from "@/components/VideoEmbed";
import { CommentSection } from "@/components/CommentSection";
import { Reactions } from "@/components/Reactions";
import { formatDate, formatDuration } from "@/lib/utils";
import { getProviderLabel } from "@/lib/video-providers";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload();
  const videos = await payload.find({
    collection: "videos",
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
  });

  if (videos.docs.length === 0) return { title: "Video nije pronađen" };

  return {
    title: `${videos.docs[0].title} | Noćna mora Željka Malnara`,
    description: videos.docs[0].description || undefined,
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload();

  const videos = await payload.find({
    collection: "videos",
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 2,
  });

  if (videos.docs.length === 0) notFound();

  const video = videos.docs[0] as any;

  // Fetch comments and reactions
  const [comments, reactions] = await Promise.all([
    payload.find({
      collection: "comments",
      where: {
        and: [{ video: { equals: video.id } }, { approved: { equals: true } }],
      },
      sort: "-createdAt",
      depth: 1,
      limit: 50,
    }),
    payload.find({
      collection: "reactions",
      where: { video: { equals: video.id } },
      limit: 0,
    }),
  ]);

  // Aggregate reactions by type
  const reactionCounts = Object.entries(
    reactions.docs.reduce(
      (acc: Record<string, number>, r: any) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([type, count]) => ({ type, count }));

  const participants = (video.participants || []) as any[];
  const categories = (video.categories || []) as any[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Video embed */}
      <VideoEmbed
        provider={video.provider}
        videoId={video.videoId}
        title={video.title}
      />

      {/* Video info */}
      <div className="mt-6 space-y-4">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {video.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {video.airedDate && <span>{formatDate(video.airedDate)}</span>}
          {video.duration && <span>{formatDuration(video.duration)}</span>}
          <span className="rounded bg-muted px-2 py-0.5 text-xs">
            {getProviderLabel(video.provider)}
          </span>
          <span className="rounded bg-muted px-2 py-0.5 text-xs">
            {video.videoType === "full" ? "Cijela epizoda" : "Isječak"}
          </span>
        </div>

        {video.description && (
          <p className="text-muted-foreground">{video.description}</p>
        )}

        {/* Reactions */}
        <Reactions videoId={video.id} initialReactions={reactionCounts} />

        {/* Participants */}
        {participants.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Sudionici
            </h3>
            <div className="flex flex-wrap gap-2">
              {participants.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/${p.type === "main" ? "glumci" : "gosti"}/${p.slug}`}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  {p.firstName} {p.lastName}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Kategorije
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/kategorije/${c.slug}`}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Transcription */}
        {video.transcriptionPlain && (
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Transkripcija
            </h2>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {video.transcriptionPlain}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="mt-8 border-t border-border pt-8">
          <CommentSection
            videoId={video.id}
            initialComments={comments.docs.map((c: any) => ({
              id: c.id,
              content: c.content,
              createdAt: c.createdAt,
              author: { name: c.author?.name || "Anonimni" },
            }))}
          />
        </div>
      </div>
    </div>
  );
}
