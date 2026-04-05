import { ParticipantCard } from '@/components/ParticipantCard'
import { getPayload } from '@/lib/payload'
import { notArchived } from '@/lib/query-helpers'

export const revalidate = 3600

export const metadata = {
  title: 'Glumci | Noćna mora Željka Malnara',
  description: 'Stalna postava emisije',
}

export default async function ActorsPage() {
  const payload = await getPayload()

  const participants = await payload.find({
    collection: 'participants',
    where: { and: [{ type: { equals: 'main' } }, notArchived] },
    sort: 'lastName',
    limit: 100,
    depth: 1,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Glumci / Stalna postava</h1>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {participants.docs.map((participant: any) => (
          <ParticipantCard key={participant.id} participant={participant} basePath="/glumci" />
        ))}
      </div>

      {participants.docs.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">Još nema glumaca u arhivu.</p>
      )}
    </div>
  )
}
