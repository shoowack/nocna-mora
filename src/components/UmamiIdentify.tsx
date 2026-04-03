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
      defer
      src="https://stats.nocna-mora.com/script.js"
      data-website-id={websiteId}
      onLoad={() => {
        if (user) {
          ;(window as any).umami.identify(user)
        }
      }}
    />
  )
}
