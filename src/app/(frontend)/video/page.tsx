import type { Where } from 'payload'
import { getPayload } from '@/lib/payload'
import { VideoCard } from '@/components/VideoCard'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { notArchived } from '@/lib/query-helpers'

export const revalidate = 60

type Props = {
  searchParams: Promise<{ page?: string; type?: string; category?: string }>
}

export default async function VideosPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 12
  const payload = await getPayload()

  const where: Where = { published: { equals: true }, ...notArchived }
  if (params.type) {
    where.videoType = { equals: params.type }
  }
  if (params.category) {
    where.categories = { equals: params.category }
  }

  const [videos, categories] = await Promise.all([
    payload.find({
      collection: 'videos',
      where,
      sort: '-airedDate',
      page,
      limit,
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      where: notArchived,
      sort: 'title',
      limit: 100,
    }),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Videi</h1>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/video"
          className={cn('rounded-full border px-4 py-1.5 text-sm transition-colors', params.type ? 'border-border text-muted-foreground hover:border-primary/50' : 'border-primary bg-primary/10 text-primary')}
        >
          Svi
        </Link>
        <Link
          href="/video?type=full"
          className={cn('rounded-full border px-4 py-1.5 text-sm transition-colors', params.type === 'full' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50')}
        >
          Cijele epizode
        </Link>
        <Link
          href="/video?type=clip"
          className={cn('rounded-full border px-4 py-1.5 text-sm transition-colors', params.type === 'clip' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50')}
        >
          Isječci
        </Link>

        <div className="h-6 w-px bg-border" />

        {categories.docs.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/video?category=${cat.id}`}
            className={cn('rounded-full border px-4 py-1.5 text-sm transition-colors', params.category === cat.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50')}
          >
            {cat.title}
          </Link>
        ))}
      </div>

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
          {page > 1 && (
            <Link
              href={`/video?page=${page - 1}${params.type ? `&type=${params.type}` : ''}${params.category ? `&category=${params.category}` : ''}`}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Prethodna
            </Link>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Stranica {page} od {videos.totalPages}
          </span>
          {page < videos.totalPages && (
            <Link
              href={`/video?page=${page + 1}${params.type ? `&type=${params.type}` : ''}${params.category ? `&category=${params.category}` : ''}`}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sljedeća
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
