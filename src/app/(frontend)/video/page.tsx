import type { Where } from 'payload'
import { headers } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { VideoCard } from '@/components/VideoCard'
import { VideoFilters } from '@/components/VideoFilters'
import Link from 'next/link'
import { notArchived, publishedFilter } from '@/lib/query-helpers'
import { buildVideoUrl, parseVideoParams } from '@/lib/video-url'

type Props = {
  searchParams: Promise<{
    page?: string
    type?: string
    categories?: string
    participants?: string
    date?: string
    published?: string
  }>
}

export default async function VideosPage({ searchParams }: Props) {
  const raw = await searchParams
  const params = parseVideoParams(raw)
  const limit = 12
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: await headers() })
  const isAdmin = user?.role === 'admin'

  // Build where clause
  const where: Where = { and: [...publishedFilter(isAdmin), notArchived] } as any

  if (params.type.length > 0) {
    if (params.type.length === 1) {
      ;(where as any).and.push({ videoType: { equals: params.type[0] } })
    } else {
      ;(where as any).and.push({ videoType: { in: params.type } })
    }
  }

  if (params.categories.length > 0) {
    ;(where as any).and.push({ categories: { in: params.categories } })
  }

  if (params.participants.length > 0) {
    ;(where as any).and.push({ participants: { in: params.participants } })
  }

  if (params.date) {
    const start = new Date(params.date + 'T00:00:00.000Z')
    const end = new Date(params.date + 'T23:59:59.999Z')
    ;(where as any).and.push({ airedDate: { greater_than_equal: start.toISOString() } })
    ;(where as any).and.push({ airedDate: { less_than_equal: end.toISOString() } })
  }

  if (isAdmin && params.published !== '') {
    ;(where as any).and.push({ published: { equals: params.published === 'true' } })
  }

  // Build a where clause without the date filter for calendar dot indicators
  const whereWithoutDate: typeof where = {
    and: (where as any).and.filter(
      (clause: any) => !clause.airedDate,
    ),
  } as any

  const [videos, categories, participants, allDates] = await Promise.all([
    payload.find({
      collection: 'videos',
      where,
      sort: '-airedDate',
      page: params.page,
      limit,
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      where: notArchived,
      sort: 'title',
      limit: 100,
    }),
    payload.find({
      collection: 'participants',
      where: notArchived,
      sort: 'fullName',
      limit: 200,
    }),
    payload.find({
      collection: 'videos',
      where: whereWithoutDate,
      select: { airedDate: true },
      sort: '-airedDate',
      limit: 500,
      depth: 0,
    }),
  ])

  const prevUrl = buildVideoUrl({ ...params, page: params.page - 1 })
  const nextUrl = buildVideoUrl({ ...params, page: params.page + 1 })

  const videoDates = allDates.docs
    .map((v: any) => v.airedDate)
    .filter(Boolean) as string[]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Videi</h1>

      <VideoFilters
        categories={categories.docs.map((c: any) => ({ id: c.id, title: c.title }))}
        participants={participants.docs.map((p: any) => ({
          id: p.id,
          fullName: p.fullName || `${p.firstName} ${p.lastName}`,
          type: p.type,
        }))}
        isAdmin={isAdmin}
        videoDates={videoDates}
        current={{
          type: params.type,
          categories: params.categories,
          participants: params.participants,
          date: params.date,
          published: params.published,
        }}
      />

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.docs.map((video: any) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {videos.docs.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">Nema videa za prikaz.</p>
      )}

      {/* Pagination */}
      {videos.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {params.page > 1 && (
            <Link
              href={prevUrl}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Prethodna
            </Link>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Stranica {params.page} od {videos.totalPages}
          </span>
          {params.page < videos.totalPages && (
            <Link
              href={nextUrl}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sljedeća
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
