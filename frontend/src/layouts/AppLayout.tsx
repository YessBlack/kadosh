import { AppSidebar } from '@/components/shared/Sidebar/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Outlet } from 'react-router-dom'

export const AppLayout = () => {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className='h-svh overflow-hidden'>
          <main className='relative m-2 ml-0 flex-1 overflow-hidden rounded-xl border border-slate-200/75 bg-slate-50/90 p-4 text-slate-900 dark:border-[#1E1B4B]/70 dark:bg-[#0B0E17]/92 dark:text-[#E5E7EB]'>
            <div className='pointer-events-none absolute inset-0'>
              <div className='absolute inset-0 bg-[radial-gradient(circle_at_92%_10%,rgba(124,58,237,0.2),transparent_32%),radial-gradient(circle_at_76%_34%,rgba(167,139,250,0.16),transparent_36%),radial-gradient(circle_at_18%_100%,rgba(124,58,237,0.1),transparent_42%)] dark:bg-[radial-gradient(circle_at_92%_10%,rgba(124,58,237,0.22),transparent_32%),radial-gradient(circle_at_76%_34%,rgba(167,139,250,0.2),transparent_36%),radial-gradient(circle_at_18%_100%,rgba(124,58,237,0.12),transparent_42%)]' />
              <div className='absolute inset-0 bg-[linear-gradient(245deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_42%,rgba(255,255,255,0.18)_72%,rgba(255,255,255,0)_100%)] mix-blend-soft-light dark:bg-[linear-gradient(245deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_42%,rgba(255,255,255,0.06)_72%,rgba(255,255,255,0)_100%)]' />
            </div>
            <div className='relative z-10 h-full overflow-y-auto'>
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
