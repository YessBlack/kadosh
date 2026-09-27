import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        'border-slate-300 bg-white pr-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-500 focus-visible:ring-violet-400/35 dark:border-[#1E1B4B] dark:bg-[#151b2C]/70 dark:text-[#E5E7EB] dark:placeholder:text-[#9CA3AF] dark:focus-visible:border-[#A78BFA] dark:focus-visible:ring-[#A78BFA]/35',
        className
      )}
      {...props}
    />
  )
}

export { Input }
