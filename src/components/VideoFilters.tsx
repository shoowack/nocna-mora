"use client"

import { hr as rdpHr } from "react-day-picker/locale"
import * as React from "react"
import { CalendarIcon, ChevronDown, X } from "lucide-react"
import { Combobox as BaseCombobox } from "@base-ui/react"
import { hr as dateFnsHr } from "date-fns/locale"
import { format } from "date-fns"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator
} from "@/components/ui/combobox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type VideoFilterParams, buildVideoUrl } from "@/lib/video-url"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Separator } from "./ui/separator"
import { useRouter } from "next/navigation"

type Category = { id: string; title: string }
type Participant = { id: string; fullName: string; type: "main" | "guest" }

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

type Option = {
  label: string
  value: string
}

const VIDEO_TYPES: Option[] = [
  { value: "full", label: "Cijele epizode" },
  { value: "clip", label: "Isječci" }
]

const PUBLISHED_OPTIONS: Option[] = [
  { value: "true", label: "Objavljeno" },
  { value: "false", label: "Neobjavljeno" }
]

export function VideoFilters({
  categories,
  participants,
  isAdmin,
  videoDates,
  current
}: VideoFiltersProps) {
  const router = useRouter()

  const [filters, setFilters] = React.useState<VideoFilterParams>({
    type: current.type,
    categories: current.categories,
    participants: current.participants,
    date: current.date,
    published: current.published
  })

  const applyFilters = React.useCallback(
    (next: VideoFilterParams) => {
      setFilters(next)
      router.push(buildVideoUrl({ ...next, page: 1 }))
    },
    [router]
  )

  function setDate(date: Date | undefined) {
    applyFilters({ ...filters, date: date ? format(date, "yyyy-MM-dd") : "" })
  }

  function clearAll() {
    applyFilters({ type: [], categories: [], participants: [], date: "", published: "" })
  }

  const hasActiveFilters =
    (filters.type?.length ?? 0) > 0 ||
    (filters.categories?.length ?? 0) > 0 ||
    (filters.participants?.length ?? 0) > 0 ||
    !!filters.date ||
    !!filters.published

  const actors = participants.filter((p) => p.type === "main")
  const guests = participants.filter((p) => p.type === "guest")

  const selectedDate = filters.date ? new Date(filters.date + "T12:00:00") : undefined
  const parsedVideoDates = React.useMemo(() => videoDates.map((d) => new Date(d)), [videoDates])

  return (
    <div className="mb-8 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
      {/* Video type */}
      <MultiCombobox
        label="Tip videa"
        options={VIDEO_TYPES}
        selected={filters.type ?? []}
        onValueChange={(values) => applyFilters({ ...filters, type: values })}
      />

      {/* Categories */}
      <MultiCombobox
        label="Kategorije"
        options={categories.map((c) => ({ value: c.id, label: c.title }))}
        selected={filters.categories ?? []}
        onValueChange={(values) => applyFilters({ ...filters, categories: values })}
        searchPlaceholder="Traži kategoriju..."
      />

      {/* Participants — grouped by Glumci / Gosti */}
      <GroupedMultiCombobox
        label="Sudionici"
        groups={[
          { heading: "Glumci", options: actors.map((p) => ({ value: p.id, label: p.fullName })) },
          { heading: "Gosti", options: guests.map((p) => ({ value: p.id, label: p.fullName })) }
        ]}
        selected={filters.participants ?? []}
        onValueChange={(values) => applyFilters({ ...filters, participants: values })}
        searchPlaceholder="Traži sudionika..."
      />

      {/* Date picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between font-normal sm:w-auto sm:min-w-[175px]",
              selectedDate && "border-primary text-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {selectedDate
                ? format(selectedDate, "dd.MM.yyyy", { locale: dateFnsHr })
                : "Datum emitiranja"}
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
            locale={rdpHr}
            modifiers={{ hasVideo: parsedVideoDates }}
            components={{
              DayButton: (props) => (
                <CalendarDayButton locale={rdpHr} {...props}>
                  {props.children}
                  {props.modifiers?.hasVideo && (
                    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </CalendarDayButton>
              )
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Published — admin only */}
      {isAdmin && (
        <SingleCombobox
          label="Status"
          options={PUBLISHED_OPTIONS}
          selected={filters.published ?? ""}
          onValueChange={(val) => applyFilters({ ...filters, published: val?.value ?? "" })}
          allLabel="Svi statusi"
        />
      )}

      {/* Clear all */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Poništi filtere
        </Button>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ComboboxTriggerButton({
  label,
  count,
  active,
  onClear
}: {
  label: string
  count?: number
  active?: boolean
  onClear: () => void
}) {
  const hasValue = count !== undefined ? count > 0 : active
  const Icon = hasValue ? X : ChevronDown

  return (
    <BaseCombobox.Trigger
      render={
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal sm:w-auto sm:min-w-[140px] gap-1 pr-1",
            hasValue && "border-primary"
          )}
        />
      }
    >
      <span className="grow flex items-start">{label}</span>
      {count !== undefined && count > 0 && <Badge variant="default-soft">{count}</Badge>}
      <Separator orientation="vertical" className="my-auto h-5" />
      <span
        role="button"
        className="rounded-full p-0.5 hover:bg-muted"
        {...(hasValue && {
          ariaLabel: `Obriši ${label}`,
          onClick: (e) => {
            e.stopPropagation()
            onClear()
          }
        })}
      >
        <Icon className="h-4 w-4 text-muted-foreground" />
      </span>
    </BaseCombobox.Trigger>
  )
}

interface MultiComboboxProps {
  label: string
  options: Option[]
  selected: string[]
  onValueChange: (values: string[]) => void
  searchPlaceholder?: string
}

function MultiCombobox({
  label,
  options,
  selected,
  onValueChange,
  searchPlaceholder
}: MultiComboboxProps) {
  const count = selected.length
  const value = options.filter((opt) => selected.includes(opt.value))

  return (
    <Combobox
      multiple
      value={value}
      onValueChange={(opts) => onValueChange(opts.map((o) => o.value))}
      items={options}
      itemToStringValue={(item: Option) => item.label}
    >
      <ComboboxTriggerButton label={label} count={count} onClear={() => onValueChange([])} />
      <ComboboxContent>
        {searchPlaceholder && <ComboboxInput placeholder={searchPlaceholder} showTrigger={false} />}
        <ComboboxEmpty>Nema rezultata.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

interface GroupedMultiComboboxProps {
  label: string
  groups: { heading: string; options: Option[] }[]
  selected: string[]
  onValueChange: (values: string[]) => void
  searchPlaceholder?: string
}

function GroupedMultiCombobox({
  label,
  groups,
  selected,
  onValueChange,
  searchPlaceholder
}: GroupedMultiComboboxProps) {
  const [query, setQuery] = React.useState("")

  const count = selected.length
  const allOptions = React.useMemo(() => groups.flatMap((g) => g.options), [groups])
  const value = allOptions.filter((opt) => selected.includes(opt.value))

  const filteredGroups = React.useMemo(() => {
    if (!query.trim()) return groups
    const q = query.toLowerCase()
    return groups
      .map((g) => ({ ...g, options: g.options.filter((o) => o.label.toLowerCase().includes(q)) }))
      .filter((g) => g.options.length > 0)
  }, [groups, query])

  return (
    <Combobox
      multiple
      value={value}
      onValueChange={(opts) => onValueChange(opts.map((o) => o.value))}
      onInputValueChange={(val) => setQuery(val)}
      onOpenChange={(open) => {
        if (!open) setQuery("")
      }}
      isItemEqualToValue={(a: Option, b: Option) => a.value === b.value}
    >
      <ComboboxTriggerButton label={label} count={count} onClear={() => onValueChange([])} />
      <ComboboxContent>
        {searchPlaceholder && <ComboboxInput placeholder={searchPlaceholder} showTrigger={false} />}
        <ComboboxList>
          {filteredGroups.length === 0 && (
            <div className="py-2 text-center text-sm text-muted-foreground">Nema rezultata.</div>
          )}
          {filteredGroups.map((group, i) => (
            <ComboboxGroup key={group.heading} className="p-1">
              {i > 0 && <ComboboxSeparator />}
              <ComboboxLabel>{group.heading}</ComboboxLabel>
              {group.options.map((opt) => (
                <ComboboxItem key={opt.value} value={opt}>
                  {opt.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

interface SingleComboboxProps {
  label: string
  options: Option[]
  selected: string
  onValueChange: (value: Option | null) => void
  allLabel: string
}

function SingleCombobox({
  label,
  options,
  selected,
  onValueChange,
  allLabel
}: SingleComboboxProps) {
  const active = options.find((o) => o.value === selected) ?? null

  return (
    <Combobox
      value={active}
      onValueChange={onValueChange}
      items={options}
      itemToStringValue={(item: Option) => item.label}
    >
      <BaseCombobox.Trigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between font-normal sm:w-auto sm:min-w-[140px]",
              active && "border-primary"
            )}
          />
        }
      >
        <span>{active ? active.label : allLabel}</span>
        {active ? (
          <span
            role="button"
            aria-label={`Obriši ${label}`}
            className="ml-1 rounded-full p-0.5 hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation()
              onValueChange(null)
            }}
          >
            <X className="h-3 w-3" />
          </span>
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </BaseCombobox.Trigger>
      <ComboboxContent>
        <ComboboxEmpty>Nema rezultata.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
