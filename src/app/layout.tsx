import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TV Arhiv',
  description: 'Arhiv omiljene hrvatske TV emisije',
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
