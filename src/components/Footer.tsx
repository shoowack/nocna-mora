import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-bold text-foreground">TV Arhiv</h3>
            <p className="text-sm text-muted-foreground">
              Arhiv omiljene hrvatske TV emisije iz 90-ih i 00-ih.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Navigacija</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/video" className="hover:text-foreground transition-colors">Videi</Link></li>
              <li><Link href="/glumci" className="hover:text-foreground transition-colors">Glumci</Link></li>
              <li><Link href="/gosti" className="hover:text-foreground transition-colors">Gosti</Link></li>
              <li><Link href="/kategorije" className="hover:text-foreground transition-colors">Kategorije</Link></li>
              <li><Link href="/vremenska-crta" className="hover:text-foreground transition-colors">Vremenska crta</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Pravne informacije</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privatnost" className="hover:text-foreground transition-colors">Privatnost</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TV Arhiv. Sva prava pridržana.
        </div>
      </div>
    </footer>
  )
}
