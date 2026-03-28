import { getPayload } from '@/lib/payload'
import { Timeline } from '@/components/Timeline'
import type { TimelineEvent } from '@/components/Timeline'

export const revalidate = 3600

export const metadata = {
  title: 'Vremenska crta | TV Arhiv',
  description: 'Kronologija najvažnijih događaja',
}

export default async function TimelinePage() {
  const payload = await getPayload()

  const [timelineEventsResult, mainParticipants, publishedVideos] = await Promise.all([
    payload.find({
      collection: 'timeline-events',
      sort: 'eventDate',
      limit: 200,
      depth: 1,
    }),
    payload.find({
      collection: 'participants',
      where: {
        type: { equals: 'main' },
        or: [
          { birthDate: { exists: true } },
          { deathDate: { exists: true } },
        ],
      },
      limit: 200,
      depth: 1,
    }),
    payload.find({
      collection: 'videos',
      where: {
        published: { equals: true },
        airedDate: { exists: true },
      },
      limit: 500,
      depth: 1,
    }),
  ])

  // Transform timeline events (pass-through)
  const timelineEvents: TimelineEvent[] = timelineEventsResult.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    description: doc.description ?? null,
    eventDate: doc.eventDate,
    importance: (doc.importance as TimelineEvent['importance']) || 'medium',
    image: doc.image && typeof doc.image === 'object' && 'url' in doc.image
      ? { url: doc.image.url as string, alt: (doc.image as any).alt || doc.title }
      : null,
    relatedVideo: doc.relatedVideo && typeof doc.relatedVideo === 'object' && 'slug' in doc.relatedVideo
      ? { slug: doc.relatedVideo.slug as string, title: (doc.relatedVideo as any).title }
      : null,
    category: 'event' as const,
    link: null,
  }))

  // Transform birth events
  const birthEvents: TimelineEvent[] = mainParticipants.docs
    .filter((p) => p.birthDate)
    .map((p) => ({
      id: `birth-${p.id}`,
      title: `Rođen/a: ${p.fullName || `${p.firstName} ${p.lastName}`}`,
      description: null,
      eventDate: p.birthDate!,
      importance: 'medium' as const,
      image: p.photo && typeof p.photo === 'object' && 'url' in p.photo
        ? { url: p.photo.url as string, alt: p.fullName || `${p.firstName} ${p.lastName}` }
        : null,
      relatedVideo: null,
      category: 'birth' as const,
      link: { href: `/glumci/${p.slug}`, label: 'Pogledaj profil' },
    }))

  // Transform death events
  const deathEvents: TimelineEvent[] = mainParticipants.docs
    .filter((p) => p.deathDate)
    .map((p) => ({
      id: `death-${p.id}`,
      title: `Preminuo/la: ${p.fullName || `${p.firstName} ${p.lastName}`}`,
      description: null,
      eventDate: p.deathDate!,
      importance: 'medium' as const,
      image: p.photo && typeof p.photo === 'object' && 'url' in p.photo
        ? { url: p.photo.url as string, alt: p.fullName || `${p.firstName} ${p.lastName}` }
        : null,
      relatedVideo: null,
      category: 'death' as const,
      link: { href: `/glumci/${p.slug}`, label: 'Pogledaj profil' },
    }))

  // Transform video aired events
  const videoEvents: TimelineEvent[] = publishedVideos.docs
    .filter((v) => v.airedDate)
    .map((v) => ({
      id: `video-${v.id}`,
      title: v.title,
      description: null,
      eventDate: v.airedDate!,
      importance: 'low' as const,
      image: v.thumbnail && typeof v.thumbnail === 'object' && 'url' in v.thumbnail
        ? { url: v.thumbnail.url as string, alt: v.title }
        : null,
      relatedVideo: null,
      category: 'aired' as const,
      link: { href: `/video/${v.slug}`, label: 'Pogledaj epizodu' },
    }))

  const allEvents = [
    ...timelineEvents,
    ...birthEvents,
    ...deathEvents,
    ...videoEvents,
  ].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-foreground">Vremenska crta</h1>

      {allEvents.length > 0 ? (
        <Timeline events={allEvents} />
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          Još nema događaja na vremenskoj crti.
        </p>
      )}
    </div>
  )
}
