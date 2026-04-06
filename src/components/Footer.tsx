import { getPayload } from '@/lib/payload'
import Link from 'next/link'

async function getFooterText() {
  try {
    const payload = await getPayload()
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    return siteSettings?.footerText ?? null
  } catch {
    return null
  }
}

export async function Footer() {
  const footerText = await getFooterText()

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-bold text-foreground">Noćna mora Željka Malnara</h3>
            <p className="text-sm text-muted-foreground">
              Arhiv omiljene hrvatske TV emisije iz 90-ih i 00-ih.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Navigacija</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/video" className="hover:text-foreground transition-colors">
                  Videi
                </Link>
              </li>
              <li>
                <Link href="/glumci" className="hover:text-foreground transition-colors">
                  Glumci
                </Link>
              </li>
              <li>
                <Link href="/gosti" className="hover:text-foreground transition-colors">
                  Gosti
                </Link>
              </li>
              <li>
                <Link href="/kategorije" className="hover:text-foreground transition-colors">
                  Kategorije
                </Link>
              </li>
              <li>
                <Link href="/vremenska-crta" className="hover:text-foreground transition-colors">
                  Vremenska crta
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Pravne informacije</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privatnost" className="hover:text-foreground transition-colors">
                  Privatnost
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          {footerText ? (
            String(footerText)
          ) : (
            <div className="text-balance">
              Svi zaštitni znakovi, uslužni znakovi, trgovački nazivi, vizualni identiteti, nazivi
              proizvoda i logotipi koji se pojavljuju vlasništvo su njihovih odgovarajućih vlasnika.
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
