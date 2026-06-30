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
          <main className='relative flex-1 overflow-hidden bg-slate-50/90 p-4 text-slate-900 dark:border-[#1E1B4B]/70 dark:bg-[#0B0E17]/92 dark:text-[#E5E7EB]'>
            <div className='relative z-10 h-full overflow-y-auto'>
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
