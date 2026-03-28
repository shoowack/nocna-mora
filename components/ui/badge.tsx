import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export enum BadgeVariants {
  DEFAULT = "default",
  SECONDARY = "secondary",
  DESTRUCTIVE = "destructive",
  OUTLINE = "outline",
  SUCCESS = "success",
}

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-stone-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 dark:border-stone-800 dark:focus:ring-stone-300",
  {
    variants: {
      variant: {
        [BadgeVariants.DEFAULT]:
          "border-transparent bg-stone-900 text-stone-50 shadow hover:bg-stone-900/80 dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-50/80",
        [BadgeVariants.SECONDARY]:
          "border-transparent bg-stone-100 text-stone-900 hover:bg-stone-100/80 dark:bg-stone-800 dark:text-stone-50 dark:hover:bg-stone-800/80",
        [BadgeVariants.DESTRUCTIVE]:
          "border-transparent bg-red-500 text-stone-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-stone-50 dark:hover:bg-red-900/80",
        [BadgeVariants.OUTLINE]: "text-stone-950 dark:text-stone-50",
        [BadgeVariants.SUCCESS]:
          "border-transparent bg-green-500 text-stone-50 shadow hover:bg-green-500/80 dark:bg-green-900 dark:text-stone-50 dark:hover:bg-green-900/80",
      },
    },
    defaultVariants: {
      variant: BadgeVariants.DEFAULT,
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
