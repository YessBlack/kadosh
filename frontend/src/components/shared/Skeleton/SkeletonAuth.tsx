import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonAuth = () => {
  return (
    <div className='grid min-h-screen grid-cols-1 transition-colors lg:h-screen lg:grid-cols-2 lg:overflow-hidden'>
      <div className='hidden border-r border-slate-200/60 lg:flex dark:border-slate-800/60'>
        <div className='flex h-full w-full flex-col px-10 py-8 xl:px-12'>
          <div className='flex items-center gap-4 '>
            <Skeleton className='size-12 rounded-xl bg-slate-200/80 dark:bg-slate-800/70' />
            <Skeleton className='h-8 w-32 rounded-lg bg-slate-200/80 dark:bg-slate-800/70' />
          </div>

          <div className='w-full max-w-140 xl:mt-18 '>
            <div className='mt-15 grid grid-cols-2 gap-5'>
              <Skeleton className='h-35 rounded-2xl border border-white/30 bg-slate-200/80 p-5 dark:border-slate-800/40 dark:bg-slate-900/30' />
              <Skeleton className='h-35 rounded-2xl border border-white/30 bg-slate-200/80 p-5 dark:border-slate-800/40 dark:bg-slate-900/30' />
            </div>

            <Skeleton className='mt-4 h-15 flex items-center justify-between rounded-lg border border-white/30 bg-slate-200/80 px-5 py-4 dark:border-slate-800/40 dark:bg-slate-900/30'>

            </Skeleton>

            <div className='mt-14 max-w-140 space-y-4 xl:mt-12'>
              <Skeleton className='h-10 w-3/4 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
              <Skeleton className='h-10 w-1/2 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
              <Skeleton className='mt-3 h-5 w-full max-w-130 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
              <Skeleton className='h-5 w-2/3 max-w-130 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
            </div>
          </div>

          <Skeleton className='mt-auto h-4 w-3/5 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
        </div>
      </div>

      <div className='flex items-center justify-center px-6 py-10 sm:px-8'>
        <div className='w-full max-w-md rounded-2xl border border-slate-100 bg-white/40 p-7 dark:border-slate-800/70 dark:bg-slate-900/20 sm:p-8'>
          <div className='space-y-8'>
            <div className='space-y-3'>
              <Skeleton className='h-7 w-3/4 rounded-lg bg-slate-200/80 dark:bg-slate-800/70' />
              <Skeleton className='h-5 w-full rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
            </div>

            <div className='space-y-6'>
              <div className='space-y-3'>
                <Skeleton className='h-3 w-36 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
                <Skeleton className='h-10 w-full rounded-xl bg-slate-200/80 dark:bg-slate-800/70' />
              </div>

              <div className='space-y-3'>
                <Skeleton className='h-3 w-28 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
                <Skeleton className='h-10 w-full rounded-xl bg-slate-200/80 dark:bg-slate-800/70' />
              </div>
            </div>

            <Skeleton className='h-10 w-full rounded-lg bg-slate-300/70 dark:bg-slate-800/70' />
          </div>
        </div>
      </div>
    </div>
  )
}
