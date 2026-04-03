'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST' })
    ;(window as any).umami?.track('logout')
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      Odjava
    </button>
  )
}
