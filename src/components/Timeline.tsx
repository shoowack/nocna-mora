import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export type TimelineEvent = {
  id: string
  title: string
  description?: { root: unknown } | null
  eventDate: string
  importance: 'low' | 'medium' | 'high'
  image?: { url: string; alt: string } | null
  relatedVideo?: { slug: string; title: string } | null
  category?: 'birth' | 'death' | 'aired' | 'event'
  link?: { href: string; label: string } | null
}

function getCategoryLabel(category?: TimelineEvent['category']): string | null {
  switch (category) {
    case 'birth': return 'Rođenje'
    case 'death': return 'Smrt'
    case 'aired': return 'Emitiranje'
    default: return null
  }
}

function getDotColor(event: TimelineEvent): string {
  switch (event.category) {
    case 'birth': return 'bg-green-500'
    case 'death': return 'bg-gray-500'
    case 'aired': return 'bg-blue-500'
    default:
      return event.importance === 'high'
        ? 'bg-primary'
        : event.importance === 'medium'
          ? 'bg-yellow-500'
          : 'bg-muted-foreground'
  }
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-0.5" />

      <div className="space-y-8">
        {events.map((event, index) => {
          const categoryLabel = getCategoryLabel(event.category)

          return (
            <div
              key={event.id}
              className={`relative flex items-start gap-6 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Dot */}
              <div
                className={`absolute left-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full md:left-1/2 ${getDotColor(event)}`}
              />

              {/* Content */}
              <div className={`ml-10 w-full md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <time className="text-xs text-muted-foreground">{formatDate(event.eventDate)}</time>
                    {categoryLabel && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                        {categoryLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 font-semibold text-foreground">{event.title}</h3>
                  {event.image && (
                    <div className="relative mt-3 aspect-video overflow-hidden rounded-md">
                      <Image
                        src={event.image.url}
                        alt={event.image.alt || event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  {event.relatedVideo && (
                    <Link
                      href={`/video/${event.relatedVideo.slug}`}
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Pogledaj video
                    </Link>
                  )}
                  {event.link && (
                    <Link
                      href={event.link.href}
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      {event.link.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
