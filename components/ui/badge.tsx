import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300',
        secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
        success: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
        warning: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
        destructive: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
