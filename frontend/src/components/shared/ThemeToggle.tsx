import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  if (!resolvedTheme) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type='button'
      role='switch'
      aria-checked={isDark}
      aria-label='Cambiar tema'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`
        relative inline-flex h-8 w-16 shrink-0 items-center rounded-full
        border transition-colors duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${isDark
          ? 'border-slate-300 bg-slate-200 focus-visible:ring-[#6366F1] '
          : 'border-slate-300 bg-slate-100 focus-visible:ring-slate-400'
        }
      `}
    >
      <span className='absolute left-1.5 flex items-center justify-center'>
        <Sun className={`h-4 w-4 transition-opacity duration-300 ${isDark ? ' text-slate-400' : 'opacity-0'}`} />
      </span>
      <span className='absolute right-1.5 flex items-center justify-center'>
        <Moon className={`h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-0' : ' text-violet-300'}`} />
      </span>

      <span
        className={`
          z-10 flex h-6 w-6 items-center justify-center rounded-full
          shadow-md transition-transform duration-300 ease-in-out
          ${isDark ? 'translate-x-9 bg-[#7C3AED] text-[#E5E7EB]' : 'translate-x-1 bg-white text-amber-500'}
        `}
      >
        {isDark ? <Moon className='h-3.5 w-3.5' strokeWidth={2.5} /> : <Sun className='h-3.5 w-3.5' strokeWidth={2.5} />}
      </span>
    </button>
  )
}
