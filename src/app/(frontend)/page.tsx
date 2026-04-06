import { notArchived, publishedFilter } from "@/lib/query-helpers"
import { ParticipantCard } from "@/components/ParticipantCard"
import { VideoCard } from "@/components/VideoCard"
import { getPayload } from "@/lib/payload"
import { headers } from "next/headers"
import Link from "next/link"

export default async function HomePage() {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: await headers() })
  const isAdmin = user?.role === "admin"

  const [homepage, latestVideos, participants] = await Promise.all([
    payload.findGlobal({ slug: "homepage" }),
    payload.find({
      collection: "videos",
      where: { and: [...publishedFilter(isAdmin), notArchived] },
      sort: "-airedDate",
      limit: 6
    }),
    payload.find({
      collection: "participants",
      where: { and: [{ type: { equals: "main" } }, notArchived] },
      limit: 8
    })
  ])

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {homepage.heroTitle || "Noćna mora Željka Malnara"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Arhiv omiljene hrvatske TV emisije. Videi, gosti, glumci i više.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/video"
              className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Pregledaj videe
            </Link>
            <Link
              href="/pretraga"
              className="rounded-md border border-border bg-muted px-6 py-3 font-medium text-foreground hover:bg-accent transition-colors"
            >
              Pretraži arhiv
            </Link>
          </div>
        </div>
      </section>

      {/* Latest videos */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Najnoviji videi</h2>
            <Link href="/video" className="text-sm text-primary hover:underline">
              Vidi sve
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestVideos.docs.map((video: any) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          {latestVideos.docs.length === 0 && (
            <p className="text-center text-muted-foreground">Još nema videa u arhivu.</p>
          )}
        </div>
      </section>

      {/* Cast */}
      {participants.docs.length > 0 && (
        <section className="border-t border-border py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Stalna postava</h2>
              <Link href="/glumci" className="text-sm text-primary hover:underline">
                Vidi sve
              </Link>
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {participants.docs.map((participant: any) => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                  basePath="/glumci"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
