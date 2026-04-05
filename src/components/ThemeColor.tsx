'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function ThemeColor() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return <meta name="theme-color" content={resolvedTheme === 'dark' ? '#0a0a0a' : '#ffffff'} />
}
