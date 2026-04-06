'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronUp, LogOut, Menu, Monitor, Moon, Search, Sun, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
  { href: '/video', label: 'Videi' },
  { href: '/glumci', label: 'Glumci' },
  { href: '/gosti', label: 'Gosti' },
  { href: '/kategorije', label: 'Kategorije' },
  { href: '/vremenska-crta', label: 'Vremenska crta' },
]

const themeOptions = [
  { value: 'light', icon: Sun, label: 'Svijetla' },
  { value: 'system', icon: Monitor, label: 'Sustav' },
  { value: 'dark', icon: Moon, label: 'Tamna' },
] as const

type Props = {
  user: { id: string; name: string; email: string } | null
  avatarUrl?: string
}

function ProfilePopup({
  user,
  avatarUrl,
  onClose,
  onNavigate,
}: {
  user: { name: string; email: string }
  avatarUrl?: string
  onClose: () => void
  onNavigate: () => void
}) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST' })
    ;(window as any).umami?.track('logout')
    onNavigate()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Transparent overlay — tap outside popup to close */}
      <div className="fixed inset-0 z-10" onClick={onClose} />

      <div className="absolute bottom-full left-4 right-4 z-20 mb-2 rounded-xl border border-border bg-background shadow-lg overflow-hidden">
        {/* Profile header */}
        <div className="flex items-center gap-3 px-4 py-3">
          {avatarUrl ? (
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
              <Image src={avatarUrl} alt={user.name} fill className="object-cover" sizes="36px" />
            </div>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <div className="border-t border-border" />

        <Link
          href="/profil"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
        >
          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
          Moj profil
        </Link>

        <div className="flex items-center gap-3 px-4 py-2.5">
          <Monitor className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm text-foreground flex-1">Tema</span>
          <div className="flex h-7 items-center rounded-md border border-border bg-muted p-0.5">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => {
                  setTheme(value)
                  ;(window as any).umami?.track('theme change', { theme: value })
                }}
                aria-label={label}
                className={cn(
                  'flex h-full w-6 items-center justify-center rounded-sm transition-colors',
                  theme === value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border" />

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0 text-muted-foreground" />
          Odjava
        </button>
      </div>
    </>
  )
}

export function MobileMenu({ user, avatarUrl }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const closeAll = useCallback(() => {
    setDrawerOpen(false)
    setProfileOpen(false)
  }, [])

  const drawer = (
    <>
      {/* Drawer — full screen */}
      <div
        className={cn(
          'fixed inset-0 z-50 flex flex-col bg-background transition-transform duration-300 ease-in-out',
          drawerOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header row inside drawer */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold text-foreground">Meni</span>
          <button
            onClick={closeAll}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Zatvori meni"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeAll}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <Link
              href="/pretraga"
              onClick={closeAll}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Search className="h-4 w-4 shrink-0" />
              Pretraži arhiv
            </Link>
          </div>
        </nav>

        {/* Bottom profile / login */}
        <div className="relative shrink-0 border-t border-border">
          {user ? (
            <>
              {profileOpen && (
                <ProfilePopup
                  user={user}
                  avatarUrl={avatarUrl}
                  onClose={() => setProfileOpen(false)}
                  onNavigate={closeAll}
                />
              )}
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex w-full items-center gap-3 px-4 py-4 hover:bg-muted transition-colors"
              >
                {avatarUrl ? (
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={avatarUrl}
                      alt={user.name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <ChevronUp
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                    profileOpen ? 'rotate-0' : 'rotate-180',
                  )}
                />
              </button>
            </>
          ) : (
            <div className="p-4">
              <Link
                href="/prijava"
                onClick={closeAll}
                className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Prijava
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <div className="md:hidden">
      {/* Hamburger */}
      <button
        onClick={() => setDrawerOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
        aria-label={drawerOpen ? 'Zatvori meni' : 'Otvori meni'}
      >
        {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mounted && createPortal(drawer, document.body)}
    </div>
  )
}
