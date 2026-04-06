"use client"

export function DurationCell({ cellData }: { cellData?: number }) {
  if (!cellData) return <span style={{ color: "var(--theme-elevation-400)" }}>—</span>

  const h = Math.floor(cellData / 3600)
  const m = Math.floor((cellData % 3600) / 60)
  const s = cellData % 60

  const parts = []
  if (h > 0) parts.push(`${h}h`)
  parts.push(`${String(m).padStart(2, "0")}m`)
  parts.push(`${String(s).padStart(2, "0")}s`)

  return <span>{parts.join(" ")}</span>
}
