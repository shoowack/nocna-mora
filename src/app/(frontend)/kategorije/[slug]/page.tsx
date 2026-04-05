import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { VideoCard } from '@/components/VideoCard'
import { getPayload } from '@/lib/payload'
import { notArchived, publishedFilter } from '@/lib/query-helpers'

export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'categories',
    where: { and: [{ slug: { equals: slug } }, notArchived] },
    limit: 1,
  })
  if (result.docs.length === 0) return { title: 'Kategorija nije pronađena' }
  return { title: `${result.docs[0].title} | Noćna mora Željka Malnara` }
}

export default async function CategoryDetailPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const page = parseInt(sp.page || '1')
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: await headers() })
  const isAdmin = user?.role === 'admin'

  const catResult = await payload.find({
    collection: 'categories',
    where: { and: [{ slug: { equals: slug } }, notArchived] },
    limit: 1,
  })

  if (catResult.docs.length === 0) notFound()

  const category = catResult.docs[0] as any

  const videos = await payload.find({
    collection: 'videos',
    where: {
      and: [{ categories: { equals: category.id } }, ...publishedFilter(isAdmin), notArchived],
    },
    sort: '-airedDate',
    page,
    limit: 12,
    depth: 1,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-2 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">{category.title}</h1>
        {isAdmin && (
          <Link
            href={`/admin/collections/categories/${category.id}`}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Uredi
          </Link>
        )}
      </div>
      {category.description && <p className="mb-6 text-muted-foreground">{category.description}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.docs.map((video: any) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {videos.docs.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">Nema videa u ovoj kategoriji.</p>
      )}

      {videos.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-4">
          {page > 1 && (
            <a
              href={`/kategorije/${slug}?page=${page - 1}`}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Prethodna
            </a>
          )}
          <span className="flex items-center text-sm text-muted-foreground">
            Stranica {page} od {videos.totalPages}
          </span>
          {page < videos.totalPages && (
            <a
              href={`/kategorije/${slug}?page=${page + 1}`}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Sljedeća
            </a>
          )}
        </div>
      )}
    </div>
  )
}
