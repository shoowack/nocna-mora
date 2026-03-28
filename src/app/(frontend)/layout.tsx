import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getPayload } from '@/lib/payload'
import type { Media } from '../../../payload-types'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl: string | undefined

  try {
    const payload = await getPayload()
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    const favicon = siteSettings?.favicon as Media | null | undefined
    if (favicon?.url) faviconUrl = favicon.url
  } catch {
    // fall through to static favicon
  }

  return {
    metadataBase: new URL("https://nocna-mora.com"),
    title: "Noćna Mora",
    description:
      "Dobrodošli na arhivsku stranicu Noćne More! Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u povijesti hrvatske televizije.",
    icons: {
      icon: faviconUrl || '/favicon.ico',
    },
    openGraph: {
      title: "Noćna Mora",
      description:
        "Dobrodošli na arhivsku stranicu Noćne More! Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u povijesti hrvatske televizije.",
      url: "https://nocna-mora.com",
      siteName: "Noćna Mora",
      images: [{ url: "/og-image.jpeg", width: 1600, height: 1200 }],
      locale: "hr_HR",
      type: "website",
    },
    twitter: {
      card: 'summary_large_image',
      title: "Noćna Mora",
      description:
        "Dobrodošli na arhivsku stranicu Noćne More! Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u povijesti hrvatske televizije.",
      images: ['/og-image.jpeg'],
    },
  }
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
