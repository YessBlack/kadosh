import { mainItems, settingsItems } from '@/components/shared/Sidebar/sidebar.config'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenu } from '@/components/ui/dropdown-menu'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/auth.store'
import { ChevronsUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export const AppSidebar = () => {
  const { toggleSidebar } = useSidebar()
  const { logout, user } = useAuthStore()

  return (
    <Sidebar side='left' variant='sidebar' collapsible='icon'>
      <div className='relative flex h-full flex-col overflow-hidden'>
        <div className='pointer-events-none absolute inset-0'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(124,58,237,0.18),transparent_30%),radial-gradient(circle_at_78%_0%,rgba(167,139,250,0.18),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.12),transparent_38%)] dark:bg-[radial-gradient(circle_at_8%_12%,rgba(124,58,237,0.2),transparent_30%),radial-gradient(circle_at_78%_0%,rgba(167,139,250,0.2),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.14),transparent_38%)]' />
          <div className='absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_42%,rgba(255,255,255,0.18)_72%,rgba(255,255,255,0)_100%)] mix-blend-soft-light dark:bg-[linear-gradient(115deg,rgba(30,27,75,0.34)_0%,rgba(30,27,75,0.12)_42%,rgba(91,33,182,0.22)_72%,rgba(30,27,75,0.08)_100%)]' />
        </div>

        <SidebarHeader className='relative z-10'>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size='lg'
                onClick={toggleSidebar}
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-white'>
                  <img src='/logo.png' alt='kadosh' className='size-10 object-cover' />
                </div>

                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>KADOSH</span>
                  <span className='truncate text-xs text-muted-foreground'>Enterprise</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className='relative z-10'>
          {mainItems.length > 0 && (
            <SidebarGroup>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <Link to={item.path}>
                      <SidebarMenuButton tooltip={item.label}>
                        {item.icon && <item.icon className='size-4' />}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}

          {settingsItems.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Configuración</SidebarGroupLabel>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <Link to={item.path}>
                      <SidebarMenuButton tooltip={item.label}>
                        {item.icon && <item.icon className='size-4' />}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className='relative z-10'>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                  >
                    <img
                      src={user?.avatar || 'https://github.com/shadcn.png'}
                      alt='shadcn'
                      className='size-8 rounded-full object-cover'
                    />
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>{`${user?.name} ${user?.lastname}`}</span>
                      <span className='truncate text-xs text-muted-foreground'>{user?.email}</span>
                    </div>
                    <ChevronsUpDown className='size-4 shrink-0 opacity-50' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent side='top' align='start' className='w-56'>
                  <DropdownMenuItem><Link to='/perfil'>Mi Perfil</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Cerrar Sesión</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div >
    </Sidebar >
  )
}
