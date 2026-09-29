import { mainItems, settingsItems } from '@/components/shared/Sidebar/sidebar.config'
import { UserAvatar } from '@/components/shared/User/UserAvatar'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenu } from '@/components/ui/dropdown-menu'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import type { Role } from '@/features/roles/roles'
import { useAuthStore } from '@/store/auth.store'
import { useBusinessStore } from '@/store/business.store'
import { ChevronsUpDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export const AppSidebar = () => {
  const { toggleSidebar } = useSidebar()
  const { logout, user } = useAuthStore()
  const { pathname } = useLocation()
  const { business } = useBusinessStore()

  const mainItemsForRole = mainItems.filter(item => item.roles.includes(user?.role as Role))
  const settingsItemsForRole = settingsItems.filter(item => item.roles.includes(user?.role as Role))

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
               <div className='flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-white p-0.5'>
                  <img
                    src={business?.logo || '/logo.png'}
                    alt='kadosh'
                    className='size-full object-contain rounded-lg'
                  />
                </div>

                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{business?.name || 'KADOSH'}</span>
                  <span className='truncate text-xs text-muted-foreground'>{business?.companyType || 'Enterprise'}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className='relative z-10'>
          {mainItemsForRole.length > 0 && (
            <SidebarGroup>
              <SidebarMenu>
                {mainItemsForRole.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <Link to={item.path}>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={pathname.startsWith(item.path)}
                        className='hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-900/40 dark:hover:text-violet-300 data-active:bg-violet-100 data-active:text-violet-700 dark:data-active:bg-violet-900/40 dark:data-active:text-violet-300'
                      >
                        {item.icon && <item.icon className='size-4' />}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}

          {settingsItemsForRole.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Configuración</SidebarGroupLabel>
              <SidebarMenu>
                {settingsItemsForRole.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <Link to={item.path}>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={pathname.startsWith(item.path)}
                        className='hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-900/40 dark:hover:text-violet-300 data-active:bg-violet-100 data-active:text-violet-700 dark:data-active:bg-violet-900/40 dark:data-active:text-violet-300'
                      >
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
                    <UserAvatar
                      imageUrl={user?.avatar}
                      name={user?.name}
                      lastname={user?.lastname}
                      className={user?.avatar ? 'w-10 h-10' : ''}
                    />
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>{`${user?.name} ${user?.lastname}`}</span>
                      <span className='truncate text-xs text-muted-foreground'>{user?.email}</span>
                    </div>
                    <ChevronsUpDown className='size-4 shrink-0 opacity-50' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent side='top' align='start' className='w-56'>
                  <Link to='/perfil'><DropdownMenuItem>Mi Perfil</DropdownMenuItem></Link>
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
