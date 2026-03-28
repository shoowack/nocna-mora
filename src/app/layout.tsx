import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { getPayload } from '@/lib/payload'
import type { Media } from '../../payload-types'

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
      images: [
        {
          url: "/og-image.jpeg",
          width: 1600,
          height: 1200,
        },
      ],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hr" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
