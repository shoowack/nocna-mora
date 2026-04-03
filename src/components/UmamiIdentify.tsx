'use client'

import { useEffect } from 'react'

interface Props {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

export function UmamiIdentify({ id, name, email, role, createdAt }: Props) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).umami) {
      ;(window as any).umami.identify({ id, name, email, role, createdAt })
    }
  }, [id])

  return null
}
