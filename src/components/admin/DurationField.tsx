'use client'

import { useField, FieldLabel } from '@payloadcms/ui'
import { useState, useEffect } from 'react'

type Props = {
  path: string
  label?: string
}

export function DurationField({ path, label }: Props) {
  const { value, setValue } = useField<number>({ path })

  const toHMS = (total: number) => ({
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  })

  const [hms, setHms] = useState(() => toHMS(value || 0))

  useEffect(() => {
    setHms(toHMS(value || 0))
  }, [value])

  const update = (h: number, m: number, s: number) => {
    const next = { h, m, s }
    setHms(next)
    setValue(h * 3600 + m * 60 + s)
  }

  const inputStyle = {
    width: 64,
    padding: '0.375rem 0.5rem',
    border: '1px solid var(--theme-elevation-150)',
    borderRadius: 4,
    background: 'var(--theme-elevation-0)',
    color: 'var(--theme-elevation-1000)',
    fontSize: '0.875rem',
    textAlign: 'center' as const,
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <FieldLabel label={label ?? 'Trajanje'} path={path} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <input
            type="number"
            min={0}
            value={hms.h}
            onChange={(e) => update(Math.max(0, +e.target.value), hms.m, hms.s)}
            style={inputStyle}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-400)' }}>sat</span>
        </div>
        <span style={{ color: 'var(--theme-elevation-400)', paddingBottom: 16 }}>:</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <input
            type="number"
            min={0}
            max={59}
            value={hms.m}
            onChange={(e) => update(hms.h, Math.min(59, Math.max(0, +e.target.value)), hms.s)}
            style={inputStyle}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-400)' }}>min</span>
        </div>
        <span style={{ color: 'var(--theme-elevation-400)', paddingBottom: 16 }}>:</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <input
            type="number"
            min={0}
            max={59}
            value={hms.s}
            onChange={(e) => update(hms.h, hms.m, Math.min(59, Math.max(0, +e.target.value)))}
            style={inputStyle}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-400)' }}>sek</span>
        </div>
      </div>
    </div>
  )
}
