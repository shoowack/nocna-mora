import { Folder } from "lucide-react"
import { notArchived, publishedFilter } from "@/lib/query-helpers"
import { getPayload } from "@/lib/payload"
import { headers } from "next/headers"
import Link from "next/link"

export const metadata = {
  title: "Kategorije | Noćna mora Željka Malnara"
}

export default async function CategoriesPage() {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: await headers() })
  const isAdmin = user?.role === "admin"

  const categories = await payload.find({
    collection: "categories",
    where: notArchived,
    sort: "title",
    limit: 100
  })

  // Count videos per category
  const categoriesWithCounts = await Promise.all(
    categories.docs.map(async (cat: any) => {
      const videos = await payload.find({
        collection: "videos",
        where: {
          and: [{ categories: { equals: cat.id } }, ...publishedFilter(isAdmin), notArchived]
        },
        limit: 0
      })
      return { ...cat, videoCount: videos.totalDocs }
    })
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Kategorije</h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categoriesWithCounts.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategorije/${cat.slug}`}
            className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
          >
            <Folder className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-medium text-foreground">{cat.title}</h2>
              {cat.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">{cat.videoCount} videa</p>
            </div>
          </Link>
        ))}
      </div>

      {categories.docs.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">Još nema kategorija.</p>
      )}
    </div>
  )
}
