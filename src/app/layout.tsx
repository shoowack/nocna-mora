import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TV Arhiv',
  description: 'Arhiv omiljene hrvatske TV emisije',
  openGraph: {
    title: 'TV Arhiv',
    description: 'Arhiv omiljene hrvatske TV emisije',
    images: [{ url: '/og-image.jpeg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TV Arhiv',
    description: 'Arhiv omiljene hrvatske TV emisije',
    images: ['/og-image.jpeg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  )
}
