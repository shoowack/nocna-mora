import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MaintenancePage } from '@/components/MaintenancePage'
import { ThemeColor } from '@/components/ThemeColor'
import { ThemeProvider } from '@/components/ThemeProvider'
import { UmamiIdentify } from '@/components/UmamiIdentify'
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

  const host = (await headers()).get('host') || 'nocna-mora.com'
  const protocol = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
  const siteUrl = `${protocol}://${host}`

  return {
    metadataBase: new URL(siteUrl),
    title: 'Noćna Mora',
    description:
      'Dobrodošli na arhivsku stranicu Noćne More! Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u povijesti hrvatske televizije.',
    icons: {
      icon: faviconUrl || '/favicon.ico',
    },
    openGraph: {
      title: 'Noćna Mora',
      description:
        'Dobrodošli na arhivsku stranicu Noćne More! Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u povijesti hrvatske televizije.',
      url: siteUrl,
      siteName: 'Noćna Mora',
      images: [{ url: '/og-image.jpeg', width: 1600, height: 1200 }],
      locale: 'hr_HR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Noćna Mora',
      description:
        'Dobrodošli na arhivsku stranicu Noćne More! Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u povijesti hrvatske televizije.',
      images: ['/og-image.jpeg'],
    },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload()
  const [siteSettings, { user }] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }) as any,
    payload.auth({ headers: await headers() }),
  ])

  const isAdmin = user?.role === 'admin' || user?.role === 'editor'
  const maintenanceEnabled = siteSettings?.maintenance?.enabled
  const host = (await headers()).get('host') || ''
  const isLocal = host.startsWith('localhost') || host.startsWith('127.')
  const umamiId = host.includes('nightmare-stage')
    ? '7c75d581-f861-4cd2-ae79-09f381fd974f'
    : '5a45ae66-1af8-4bff-93b8-3c2206791dd3'

  if (maintenanceEnabled && !isAdmin) {
    return (
      <html lang="hr" suppressHydrationWarning>
        <body>
          <ThemeProvider>
            <ThemeColor />
            <MaintenancePage message={siteSettings?.maintenance?.message} />
          </ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="hr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ThemeColor />
          {!isLocal && (
            <UmamiIdentify
              websiteId={umamiId}
              user={
                user
                  ? {
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      role: user.role,
                      createdAt: user.createdAt,
                    }
                  : undefined
              }
            />
          )}
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
