'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buildVideoUrl, PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE, type VideoFilterParams } from '@/lib/video-url'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface VideoPaginationProps {
  currentPage: number
  totalPages: number
  totalDocs: number
  perPage: number
  filterParams: Omit<VideoFilterParams, 'page' | 'perPage'>
}

export function VideoPagination({
  currentPage,
  totalPages,
  totalDocs,
  perPage,
  filterParams,
}: VideoPaginationProps) {
  const router = useRouter()

  const from = Math.min((currentPage - 1) * perPage + 1, totalDocs)
  const to = Math.min(currentPage * perPage, totalDocs)

  function go(page: number) {
    router.push(buildVideoUrl({ ...filterParams, page, perPage }))
  }

  function changePerPage(newPerPage: number) {
    router.push(buildVideoUrl({ ...filterParams, page: 1, perPage: newPerPage }))
  }

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
      {/* Left: page size + summary */}
      <div className="flex items-center gap-3">
        <Select value={String(perPage)} onValueChange={(v) => changePerPage(Number(v))}>
          <SelectTrigger className="h-8 w-auto text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}/stranici
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          Prikazuje se {from}–{to} od {totalDocs}
        </span>
      </div>

      {/* Right: prev, page numbers, next */}
      <div className="flex items-center gap-1">
        <PageButton onClick={() => go(currentPage - 1)} disabled={currentPage <= 1} aria-label="Prethodna stranica">
          <ChevronLeft className="h-4 w-4" />
        </PageButton>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <PageButton
              key={p}
              onClick={() => go(p)}
              active={p === currentPage}
            >
              {p}
            </PageButton>
          ),
        )}

        <PageButton onClick={() => go(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Sljedeća stranica">
          <ChevronRight className="h-4 w-4" />
        </PageButton>
      </div>
    </div>
  )
}

interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

function PageButton({ active, className, children, ...props }: PageButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
        props.disabled && 'pointer-events-none opacity-40',
        className,
      )}
    >
      {children}
    </button>
  )
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }

  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, '...', current - 1, current, current + 1, '...', total]
}
