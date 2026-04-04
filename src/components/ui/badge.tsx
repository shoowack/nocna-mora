import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
