import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonDashboard = () => {
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50'>
      <div className='flex min-h-screen flex-col lg:flex-row'>
        <aside className='hidden w-72 shrink-0 border-r border-slate-200/70 bg-white/70 px-6 py-8 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/40 lg:flex lg:flex-col'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-11 w-11 rounded-2xl bg-slate-200/80 dark:bg-slate-800/70' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-28 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
              <Skeleton className='h-3 w-20 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
            </div>
          </div>

          <div className='mt-10 space-y-3'>
            <Skeleton className='h-10 w-full rounded-xl bg-slate-200/80 dark:bg-slate-800/70' />
            <Skeleton className='h-10 w-full rounded-xl bg-slate-200/80 dark:bg-slate-800/70' />
            <Skeleton className='h-10 w-full rounded-xl bg-slate-200/80 dark:bg-slate-800/70' />
            <Skeleton className='h-10 w-full rounded-xl bg-slate-200/80 dark:bg-slate-800/70' />
          </div>

          <div className='mt-auto space-y-3'>
            <Skeleton className='h-4 w-40 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
            <Skeleton className='h-3 w-32 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
          </div>
        </aside>

        <main className='flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8'>
          <div className='mx-auto flex w-full max-w-7xl flex-col gap-6'>
            <header className='flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)] backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/40 sm:p-6'>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-8 w-56 rounded-lg bg-slate-200/80 dark:bg-slate-800/70' />
                  <Skeleton className='h-4 w-80 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
                </div>

                <div className='flex items-center gap-3'>
                  <Skeleton className='h-10 w-24 rounded-xl bg-slate-200/80 dark:bg-slate-800/70' />
                  <Skeleton className='h-10 w-10 rounded-full bg-slate-200/80 dark:bg-slate-800/70' />
                </div>
              </div>
            </header>

            <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              <Skeleton className='h-28 rounded-3xl bg-slate-200/80 dark:bg-slate-800/70' />
              <Skeleton className='h-28 rounded-3xl bg-slate-200/80 dark:bg-slate-800/70' />
              <Skeleton className='h-28 rounded-3xl bg-slate-200/80 dark:bg-slate-800/70' />
              <Skeleton className='h-28 rounded-3xl bg-slate-200/80 dark:bg-slate-800/70' />
            </section>

            <section className='grid gap-6 xl:grid-cols-[1.6fr_1fr]'>
              <div className='rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)] backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/40 sm:p-6'>
                <div className='space-y-4'>
                  <Skeleton className='h-6 w-40 rounded-lg bg-slate-200/80 dark:bg-slate-800/70' />
                  <Skeleton className='h-56 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800/70' />
                </div>
              </div>

              <div className='rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)] backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/40 sm:p-6'>
                <div className='space-y-4'>
                  <Skeleton className='h-6 w-36 rounded-lg bg-slate-200/80 dark:bg-slate-800/70' />
                  <div className='space-y-3'>
                    <Skeleton className='h-14 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800/70' />
                    <Skeleton className='h-14 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800/70' />
                    <Skeleton className='h-14 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800/70' />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
