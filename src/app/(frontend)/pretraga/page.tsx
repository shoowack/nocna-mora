import { getPayload } from '@/lib/payload'
import { SearchBar } from '@/components/SearchBar'
import { VideoCard } from '@/components/VideoCard'
import Link from 'next/link'

export const metadata = {
  title: 'Pretraži | TV Arhiv',
}

type Props = {
  searchParams: Promise<{ q?: string; page?: string; category?: string; participant?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const query = params.q || ''
  const page = parseInt(params.page || '1')
  const payload = await getPayload()

  let results: any = { docs: [], totalDocs: 0, totalPages: 0 }
  let participantResults: any[] = []

  if (query) {
    // Search videos using Payload's built-in search
    results = await payload.find({
      collection: 'videos',
      where: {
        and: [
          { published: { equals: true } },
          {
            or: [
              { title: { contains: query } },
              { description: { contains: query } },
              { transcriptionPlain: { contains: query } },
            ],
          },
          ...(params.category ? [{ categories: { equals: params.category } }] : []),
          ...(params.participant ? [{ participants: { equals: params.participant } }] : []),
        ],
      },
      sort: '-airedDate',
      page,
      limit: 12,
      depth: 1,
    })

    // Also search participants
    const pResult = await payload.find({
      collection: 'participants',
      where: {
        or: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { nickname: { contains: query } },
        ],
      },
      limit: 5,
    })
    participantResults = pResult.docs as any[]
  }

  // Fetch categories for filter
  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 100,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Pretraži arhiv</h1>

      <div className="mb-8 max-w-2xl">
        <SearchBar defaultValue={query} />
      </div>

      {/* Category filter */}
      {query && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href={`/pretraga?q=${encodeURIComponent(query)}`}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              params.category ? 'border-border text-muted-foreground' : 'border-primary bg-primary/10 text-primary'
            }`}
          >
            Sve kategorije
          </Link>
          {categories.docs.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/pretraga?q=${encodeURIComponent(query)}&category=${String(cat.id)}`}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                params.category === String(cat.id) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
              }`}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      )}

      {/* Participant results */}
      {participantResults.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Sudionici</h2>
          <div className="flex flex-wrap gap-2">
            {participantResults.map((p: any) => (
              <Link
                key={p.id}
                href={`/${p.type === 'main' ? 'glumci' : 'gosti'}/${p.slug}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary/50 transition-colors"
              >
                {p.firstName} {p.lastName}
                {p.nickname && ` "${p.nickname}"`}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Video results */}
      {query && (
        <>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Videi ({results.totalDocs} rezultata)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.docs.map((video: any) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {results.docs.length === 0 && (
            <p className="py-8 text-center text-muted-foreground text-balance">
              Nema rezultata za &quot;{query}&quot;
              {params.category && (() => {
                const cat = categories.docs.find((c: any) => String(c.id) === params.category)
                return cat ? ` u kategoriji ${(cat as any).title}` : null
              })()}
              . {params.category ? 'Pokušajte s drugim pojmom ili drugom kategorijom.' : 'Pokušajte s drugim pojmom.'}
            </p>
          )}

          {results.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-4">
              {page > 1 && (
                <a
                  href={`/pretraga?q=${encodeURIComponent(query)}&page=${page - 1}`}
                  className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Prethodna
                </a>
              )}
              <span className="flex items-center text-sm text-muted-foreground">
                Stranica {page} od {results.totalPages}
              </span>
              {page < results.totalPages && (
                <a
                  href={`/pretraga?q=${encodeURIComponent(query)}&page=${page + 1}`}
                  className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Sljedeća
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
