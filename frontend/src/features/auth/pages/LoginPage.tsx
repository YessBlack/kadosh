import { KadoshArc } from '@/features/auth/components/KadoshArc'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { BoxIcon, ChartColumn } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className='grid min-h-screen grid-cols-1 bg-slate-50 text-slate-900 transition-colors dark:bg-[#0B0E17] dark:text-[#E5E7EB] lg:h-screen lg:grid-cols-2 lg:overflow-hidden'>
      <div className='relative hidden overflow-hidden border-r border-slate-200 bg-slate-100 lg:flex dark:border-[#1E1B4B]/60 dark:bg-[#0B0E17]'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(124,58,237,0.32),transparent_25%),radial-gradient(circle_at_86%_24%,rgba(124,58,237,0.28),transparent_35%),radial-gradient(circle_at_72%_88%,rgba(124,58,237,0.2),transparent_25%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(124,58,237,0.24),transparent_25%),radial-gradient(circle_at_86%_24%,rgba(124,58,237,0.32),transparent_35%),radial-gradient(circle_at_72%_88%,rgba(124,58,237,0.24),transparent_25%)]' />
        <div className='absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_32%,rgba(255,255,255,0.04)_56%,rgba(255,255,255,0)_78%)] mix-blend-soft-light dark:bg-[linear-gradient(110deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_32%,rgba(255,255,255,0.08)_56%,rgba(255,255,255,0)_78%)]' />
        <KadoshArc />
        <div className='relative z-10 flex h-full w-full flex-col px-10 py-8 xl:px-12'>
          <div className='flex items-center gap-4'>
            <div className='flex size-12 items-center justify-center rounded-xl bg-white shadow-[0_8px_30px_-18px_rgba(124,58,237,0.9)]'>
              <img src='/logo.png' alt='Orion Core Logo' />
            </div>
            <p className='text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#E5E7EB] xl:text-3xl'>
              KADOSH
            </p>
          </div>

          <div className='w-full max-w-140 xl:mt-18 '>
            <div className='grid grid-cols-2 gap-5 mt-15'>
              <div className='rounded-2xl border border-white/30 bg-white/35 p-5 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-[#A78BFA]/12 dark:bg-[#151b2C]/45 dark:shadow-none'>
                <div className='mb-4 flex items-center justify-center size-6 rounded-md border border-violet-300/3 bg-violet-200/30 dark:border-[#A78BFA]/30 dark:bg-[#A78BFA]/10'>
                  <BoxIcon
                    size={16}
                    color='currentColor'
                    className='text-violet-600 dark:text-[#A78BFA]'
                  />
                </div>
                <p className='text-3xl font-semibold text-slate-900 dark:text-[#E5E7EB]'>14.2k</p>
                <p className='mt-1 text-sm text-slate-600 dark:text-[#9CA3AF]'>
                  Unidades en inventario
                </p>
              </div>

              <div className='rounded-2xl border border-white/30 bg-white/35 p-5 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-[#A78BFA]/12 dark:bg-[#151b2C]/45 dark:shadow-none'>
                <div className='mb-4 flex items-center justify-center size-6 rounded-md border border-violet-300/3 bg-violet-200/30 dark:border-[#A78BFA]/30 dark:bg-[#A78BFA]/10'>
                  <ChartColumn
                    size={16}
                    color='currentColor'
                    className='text-violet-600 dark:text-[#A78BFA]'
                  />
                </div>                <p className='text-3xl font-semibold text-slate-900 dark:text-[#E5E7EB]'>+12.4%</p>
                <p className='mt-1 text-sm text-slate-600 dark:text-[#9CA3AF]'>
                  Rendimiento de ventas
                </p>
              </div>
            </div>

            <div className='mt-4 flex items-center justify-between rounded-xl border border-white/30 bg-white/35 px-5 py-4 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-[#A78BFA]/12 dark:bg-[#151b2C]/45 dark:shadow-none'>
              <div className='flex items-center gap-3'>
                <span className='size-2.5 rounded-full bg-emerald-400' />
                <p className='text-base text-slate-700 dark:text-[#9CA3AF] xl:text-sm'>
                  Control de ventas e inventario
                </p>
              </div>
              <p className='text-base text-slate-500 dark:text-[#9CA3AF] xl:text-sm'>v1.0</p>
            </div>
          </div>

          <div className='mt-14 max-w-140space-y-4 xl:mt-12'>
            <h2 className='text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-[#E5E7EB] xl:text-5xl'>
              El motor del
              <br />
              comercio <span className='text-violet-600 dark:text-[#A78BFA]'>empresarial.</span>
            </h2>
            <p className='mt-3 max-w-130 text-lg leading-normal text-slate-600 dark:text-[#9CA3AF] xl:text-lg'>
              Gestiona inventario, ventas y analitica con la precision de una ingenieria de alto
              rendimiento.
            </p>
          </div>
          <p className='mt-auto pt-6 text-sm text-slate-500 dark:text-[#9CA3AF]'>
            © 2026 Kadosh Systems. Todos los derechos reservados.
          </p>
        </div>
      </div>

      <div className='relative flex items-center justify-center bg-slate-50 px-6 py-10 dark:bg-[#0B0E17] sm:px-8'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.14),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(139,92,246,0.08),transparent_36%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.17),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(167,139,250,0.12),transparent_36%)]' />
        <div className='relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-7 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.28)] backdrop-blur-sm dark:border-[#1E1B4B]/70 dark:bg-[#111827]/82 dark:shadow-[0_18px_60px_-30px_rgba(15,23,42,0.9)] sm:p-8'>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
