'use client'

import Script from 'next/script'
import { useEffect } from 'react'

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
  useEffect(() => {
    if (user) {
      const { id, ...data } = user
      ;(window as any).umamiBeforeSend = (_type: string, payload: any) => ({
        ...payload,
        id: String(id),
        data: { ...payload?.data, ...data },
      })
    } else {
      ;(window as any).umamiBeforeSend = undefined
    }
  }, [user?.id])

  return (
    <Script
      src="https://stats.nocna-mora.com/script.js"
      data-website-id={websiteId}
      data-performance="true"
      data-before-send="umamiBeforeSend"
      strategy="afterInteractive"
    />
  )
}
