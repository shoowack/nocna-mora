import { Construction } from 'lucide-react'

export function MaintenancePage({ message }: { message?: string | null }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Construction className="mb-6 h-16 w-16 text-muted-foreground/50" />
      <h1 className="mb-3 text-2xl font-bold text-foreground">Stranica je u održavanju</h1>
      <p className="max-w-md text-muted-foreground">
        {message || 'Stranica je trenutno u održavanju. Molimo pokušajte kasnije.'}
      </p>
    </div>
  )
}
