import { getPayload } from '@/lib/payload'
import { Timeline } from '@/components/Timeline'

export const revalidate = 3600

export const metadata = {
  title: 'Vremenska crta | TV Arhiv',
  description: 'Kronologija najvažnijih događaja',
}

export default async function TimelinePage() {
  const payload = await getPayload()

  const events = await payload.find({
    collection: 'timeline-events',
    sort: 'eventDate',
    limit: 200,
    depth: 1,
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-foreground">Vremenska crta</h1>

      {events.docs.length > 0 ? (
        <Timeline events={events.docs as any} />
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          Još nema događaja na vremenskoj crti.
        </p>
      )}
    </div>
  )
}
