import Image from 'next/image'
import Link from 'next/link'

type Props = {
  participant: {
    slug: string
    firstName: string
    lastName: string
    nickname?: string | null
    type: 'main' | 'guest'
    photo?: { url: string; alt: string } | null
  }
  basePath: string
}

export function ParticipantCard({ participant, basePath }: Props) {
  const name = `${participant.firstName} ${participant.lastName}`

  return (
    <Link
      href={`${basePath}/${participant.slug}`}
      className="group flex flex-col items-center rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
    >
      <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full bg-muted">
        {participant.photo ? (
          <Image
            src={participant.photo.url}
            alt={participant.photo.alt || name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
            {participant.firstName[0]}{participant.lastName[0]}
          </div>
        )}
      </div>
      <h3 className="text-center text-sm font-medium text-foreground group-hover:text-primary transition-colors">
        {name}
      </h3>
      {participant.nickname && (
        <p className="text-center text-xs text-muted-foreground">
          &quot;{participant.nickname}&quot;
        </p>
      )}
    </Link>
  )
}
