import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const alertVariants = cva(
  "group/alert relative grid w-full gap-0 rounded-xl border px-4 py-3.5 text-left has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        info: 'bg-blue-50/80    border-blue-200    *:data-[slot=alert-title]:text-slate-800  *:data-[slot=alert-description]:text-slate-500  *:[svg]:text-blue-400    dark:bg-blue-950/50    dark:border-blue-800    dark:*:data-[slot=alert-title]:text-blue-100    dark:*:data-[slot=alert-description]:text-blue-300',
        warning: 'bg-yellow-50/80  border-yellow-200  *:data-[slot=alert-title]:text-slate-800  *:data-[slot=alert-description]:text-slate-500  *:[svg]:text-yellow-400  dark:bg-yellow-950/50  dark:border-yellow-800  dark:*:data-[slot=alert-title]:text-yellow-100  dark:*:data-[slot=alert-description]:text-yellow-300',
        success: 'bg-emerald-50/80 border-emerald-200 *:data-[slot=alert-title]:text-slate-800  *:data-[slot=alert-description]:text-slate-500  *:[svg]:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800 dark:*:data-[slot=alert-title]:text-emerald-100 dark:*:data-[slot=alert-description]:text-emerald-300',
        destructive: 'bg-red-50/80     border-red-200     *:data-[slot=alert-title]:text-slate-800  *:data-[slot=alert-description]:text-slate-500  *:[svg]:text-red-400     dark:bg-red-950/50     dark:border-red-800     dark:*:data-[slot=alert-title]:text-red-100     dark:*:data-[slot=alert-description]:text-red-300',
        purple: 'bg-purple-100/70  border-purple-200  *:data-[slot=alert-title]:text-slate-800  *:data-[slot=alert-description]:text-slate-500  *:[svg]:text-purple-400  dark:bg-purple-950/50  dark:border-purple-800  dark:*:data-[slot=alert-title]:text-purple-100  dark:*:data-[slot=alert-description]:text-purple-300'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot='alert'
      role='alert'
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-title'
      className={cn(
        'text-sm font-bold group-has-[>svg]/alert:col-start-2',
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-description'
      className={cn(
        'text-[13px] mt-0.5 text-balance md:text-pretty group-has-[>svg]/alert:col-start-2 [&_p:not(:last-child)]:mb-4',
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-action'
      className={cn('absolute top-2 right-2', className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
