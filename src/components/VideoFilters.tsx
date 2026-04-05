'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { hr } from 'date-fns/locale'
import { Check, ChevronDown, CalendarIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buildVideoUrl, type VideoFilterParams } from '@/lib/video-url'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

type Category = { id: string; title: string }
type Participant = { id: string; fullName: string; type: 'main' | 'guest' }

interface VideoFiltersProps {
  categories: Category[]
  participants: Participant[]
  isAdmin: boolean
  videoDates: string[]
  current: {
    type: string[]
    categories: string[]
    participants: string[]
    date: string
    published: string
  }
}

const VIDEO_TYPES = [
  { value: 'full', label: 'Cijele epizode' },
  { value: 'clip', label: 'Isječci' },
]

const PUBLISHED_OPTIONS = [
  { value: 'true', label: 'Objavljeno' },
  { value: 'false', label: 'Neobjavljeno' },
]

export function VideoFilters({ categories, participants, isAdmin, videoDates, current }: VideoFiltersProps) {
  const router = useRouter()

  const [filters, setFilters] = React.useState<VideoFilterParams>({
    type: current.type,
    categories: current.categories,
    participants: current.participants,
    date: current.date,
    published: current.published,
  })

  // Push URL whenever filters change (reset page to 1)
  const applyFilters = React.useCallback(
    (next: VideoFilterParams) => {
      setFilters(next)
      router.push(buildVideoUrl({ ...next, page: 1 }))
    },
    [router],
  )

  function toggleMulti(key: 'type' | 'categories' | 'participants', value: string) {
    const current = filters[key] ?? []
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    applyFilters({ ...filters, [key]: next })
  }

  function setDate(date: Date | undefined) {
    applyFilters({
      ...filters,
      date: date ? format(date, 'yyyy-MM-dd') : '',
    })
  }

  function setPublished(value: string) {
    applyFilters({ ...filters, published: filters.published === value ? '' : value })
  }

  function clearAll() {
    applyFilters({ type: [], categories: [], participants: [], date: '', published: '' })
  }

  const hasActiveFilters =
    (filters.type?.length ?? 0) > 0 ||
    (filters.categories?.length ?? 0) > 0 ||
    (filters.participants?.length ?? 0) > 0 ||
    !!filters.date ||
    !!filters.published

  const actors = participants.filter((p) => p.type === 'main')
  const guests = participants.filter((p) => p.type === 'guest')

  const selectedDate = filters.date ? new Date(filters.date + 'T12:00:00') : undefined

  const parsedVideoDates = React.useMemo(
    () => videoDates.map((d) => new Date(d)),
    [videoDates],
  )

  return (
    <div className="mb-8 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
      {/* Video type */}
      <MultiCombobox
        label="Tip videa"
        options={VIDEO_TYPES}
        selected={filters.type ?? []}
        onToggle={(v) => toggleMulti('type', v)}
        onClear={() => applyFilters({ ...filters, type: [] })}
      />

      {/* Categories */}
      <MultiCombobox
        label="Kategorije"
        options={categories.map((c) => ({ value: c.id, label: c.title }))}
        selected={filters.categories ?? []}
        onToggle={(v) => toggleMulti('categories', v)}
        onClear={() => applyFilters({ ...filters, categories: [] })}
        searchPlaceholder="Traži kategoriju..."
      />

      {/* Participants with groups */}
      <GroupedMultiCombobox
        label="Sudionici"
        groups={[
          { heading: 'Glumci', options: actors.map((p) => ({ value: p.id, label: p.fullName })) },
          { heading: 'Gosti', options: guests.map((p) => ({ value: p.id, label: p.fullName })) },
        ]}
        selected={filters.participants ?? []}
        onToggle={(v) => toggleMulti('participants', v)}
        onClear={() => applyFilters({ ...filters, participants: [] })}
        searchPlaceholder="Traži sudionika..."
      />

      {/* Date picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between font-normal sm:min-w-[175px] sm:w-auto',
              selectedDate && 'border-primary text-foreground',
            )}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {selectedDate ? format(selectedDate, 'dd.MM.yyyy', { locale: hr }) : 'Datum emitiranja'}
            </span>
            {selectedDate ? (
              <span
                role="button"
                aria-label="Obriši datum"
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation()
                  setDate(undefined)
                }}
              >
                <X className="h-3 w-3" />
              </span>
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setDate}
            captionLayout="dropdown"
            startMonth={new Date(2000, 0)}
            endMonth={new Date()}
            defaultMonth={selectedDate}
            modifiers={{ hasVideo: parsedVideoDates }}
            modifiersClassNames={{ hasVideo: 'has-video-dot' }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Published — admin only */}
      {isAdmin && (
        <SingleCombobox
          label="Status"
          options={PUBLISHED_OPTIONS}
          selected={filters.published ?? ''}
          onSelect={setPublished}
          onClear={() => applyFilters({ ...filters, published: '' })}
          allLabel="Svi statusi"
        />
      )}

      {/* Clear all */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-foreground">
          <X className="mr-1 h-3.5 w-3.5" />
          Poništi filtere
        </Button>
      )}
    </div>
  )
}

// ─── Shared sub-components ───────────────────────────────────────────────────

interface MultiComboboxProps {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
  searchPlaceholder?: string
}

function MultiCombobox({ label, options, selected, onToggle, onClear, searchPlaceholder }: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const count = selected.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between font-normal sm:w-auto sm:min-w-[140px]', count > 0 && 'border-primary')}
        >
          <span className="flex items-center gap-1.5">
            {label}
            {count > 0 && <Badge>{count}</Badge>}
          </span>
          {count > 0 ? (
            <span
              role="button"
              aria-label={`Obriši ${label}`}
              className="ml-1 rounded-full p-0.5 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
            >
              <X className="h-3 w-3" />
            </span>
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          {searchPlaceholder && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>Nema rezultata.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem key={opt.value} value={opt.value} onSelect={() => onToggle(opt.value)}>
                  <Check
                    className={cn('mr-2 h-4 w-4', selected.includes(opt.value) ? 'opacity-100' : 'opacity-0')}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface GroupedMultiComboboxProps {
  label: string
  groups: { heading: string; options: { value: string; label: string }[] }[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
  searchPlaceholder?: string
}

function GroupedMultiCombobox({ label, groups, selected, onToggle, onClear, searchPlaceholder }: GroupedMultiComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const count = selected.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between font-normal sm:w-auto sm:min-w-[140px]', count > 0 && 'border-primary')}
        >
          <span className="flex items-center gap-1.5">
            {label}
            {count > 0 && <Badge>{count}</Badge>}
          </span>
          {count > 0 ? (
            <span
              role="button"
              aria-label={`Obriši ${label}`}
              className="ml-1 rounded-full p-0.5 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
            >
              <X className="h-3 w-3" />
            </span>
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          {searchPlaceholder && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>Nema rezultata.</CommandEmpty>
            {groups.map((group, i) => (
              <React.Fragment key={group.heading}>
                {i > 0 && <CommandSeparator />}
                <CommandGroup heading={group.heading}>
                  {group.options.map((opt) => (
                    <CommandItem key={opt.value} value={opt.value} onSelect={() => onToggle(opt.value)}>
                      <Check
                        className={cn('mr-2 h-4 w-4', selected.includes(opt.value) ? 'opacity-100' : 'opacity-0')}
                      />
                      {opt.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface SingleComboboxProps {
  label: string
  options: { value: string; label: string }[]
  selected: string
  onSelect: (value: string) => void
  onClear: () => void
  allLabel: string
}

function SingleCombobox({ label, options, selected, onSelect, onClear, allLabel }: SingleComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const active = options.find((o) => o.value === selected)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between font-normal sm:w-auto sm:min-w-[140px]', active && 'border-primary')}
        >
          <span>{active ? active.label : allLabel}</span>
          {active ? (
            <span
              role="button"
              aria-label={`Obriši ${label}`}
              className="ml-1 rounded-full p-0.5 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
            >
              <X className="h-3 w-3" />
            </span>
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={() => {
                    onSelect(opt.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', selected === opt.value ? 'opacity-100' : 'opacity-0')} />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
