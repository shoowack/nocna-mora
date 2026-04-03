'use client'

import Script from 'next/script'

interface Props {
  websiteId: string
  user?: {
    id: number
    name: string
    email: string
    role: string
    createdAt: string
  }
}

export function UmamiIdentify({ websiteId, user }: Props) {
  return (
    <Script
      src="https://stats.nocna-mora.com/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
      onReady={() => {
        if (user && (window as any).umami?.identify) {
          const { id, ...data } = user
          ;(window as any).umami.identify(String(id), data)
        }
      }}
    />
  )
}
