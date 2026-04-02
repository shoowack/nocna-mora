'use client'

import Link from 'next/link'

export function ParticipantSeoLink() {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <Link
        href="/admin/globals/site-settings#participantSeo"
        style={{
          fontSize: '0.875rem',
          color: 'var(--theme-elevation-400)',
          textDecoration: 'underline',
        }}
      >
        SEO — Sudionici postavke
      </Link>
    </div>
  )
}
