'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { hr } from 'react-day-picker/locale'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={hr}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label:
          'inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-sm font-medium hover:bg-accent cursor-pointer select-none',
        // Dropdown navigation
        dropdowns: 'flex items-center justify-center gap-1',
        dropdown_root: 'relative',
        dropdown: 'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
        months_dropdown: '',
        years_dropdown: '',
        // Navigation buttons (hidden when using dropdown layout)
        nav: 'flex items-center gap-1',
        button_previous: cn(
          'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          'inline-flex items-center justify-center rounded-md border border-border',
        ),
        button_next: cn(
          'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          'inline-flex items-center justify-center rounded-md border border-border',
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        // Day cell — pb-1.5 reserves space for the has-video dot indicator
        day: 'relative p-0 pb-1.5 text-center text-sm focus-within:relative focus-within:z-20',
        day_button: cn(
          'h-8 w-8 p-0 font-normal rounded-md',
          'hover:bg-accent hover:text-accent-foreground',
          'aria-selected:opacity-100',
        ),
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-md',
        today: 'bg-accent text-accent-foreground rounded-md',
        outside: 'text-muted-foreground opacity-50',
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === 'left') return <ChevronLeft className="h-4 w-4" />
          if (orientation === 'right') return <ChevronRight className="h-4 w-4" />
          return <ChevronDown className="h-3 w-3" />
        },
        ...((props as any).components ?? {}),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
