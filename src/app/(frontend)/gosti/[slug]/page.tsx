import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { VideoCard } from '@/components/VideoCard'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'participants',
    where: { slug: { equals: slug }, type: { equals: 'guest' } },
    limit: 1,
  })
  if (result.docs.length === 0) return { title: 'Gost nije pronađen' }
  const p = result.docs[0]
  return { title: `${p.firstName} ${p.lastName} | TV Arhiv` }
}

export default async function GuestDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'participants',
    where: { slug: { equals: slug }, type: { equals: 'guest' } },
    limit: 1,
    depth: 1,
  })

  if (result.docs.length === 0) notFound()

  const person = result.docs[0] as any

  const videos = await payload.find({
    collection: 'videos',
    where: {
      and: [
        { participants: { equals: person.id } },
        { published: { equals: true } },
      ],
    },
    sort: '-airedDate',
    limit: 50,
    depth: 1,
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col items-start gap-6 md:flex-row">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-lg bg-muted">
          {person.photo ? (
            <Image
              src={person.photo.url}
              alt={`${person.firstName} ${person.lastName}`}
              fill
              className="object-cover"
              sizes="192px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-muted-foreground">
              {person.firstName[0]}{person.lastName[0]}
            </div>
          )}
        </div>

        <div>
          <span className="mb-1 inline-block rounded-full bg-secondary px-3 py-0.5 text-xs text-secondary-foreground">
            Gost
          </span>
          <h1 className="text-3xl font-bold text-foreground">
            {person.firstName} {person.lastName}
          </h1>
          {person.nickname && (
            <p className="mt-1 text-lg text-muted-foreground">&quot;{person.nickname}&quot;</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {person.birthDate && <span>Rođen/a: {formatDate(person.birthDate)}</span>}
            {person.deathDate && <span>Umro/la: {formatDate(person.deathDate)}</span>}
          </div>
        </div>
      </div>

      {videos.docs.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Pojavljivanja ({videos.totalDocs})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.docs.map((video: any) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
