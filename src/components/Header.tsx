import Link from 'next/link'
import { Search } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          TV Arhiv
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/video" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Videi
          </Link>
          <Link href="/glumci" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Glumci
          </Link>
          <Link href="/gosti" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Gosti
          </Link>
          <Link href="/kategorije" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Kategorije
          </Link>
          <Link href="/vremenska-crta" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Vremenska crta
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/pretraga"
            className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Pretraži...</span>
          </Link>
          <Link
            href="/prijava"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Prijava
          </Link>
        </div>
      </div>
    </header>
  )
}
