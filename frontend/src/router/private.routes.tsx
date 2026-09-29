import { DashboardPage } from '@/features/dashboard/page/DashboardPage'
import { MyBusinessPage } from '@/features/myBusiness/pages/MyBusinessPage'
import { ProfilePage } from '@/features/myProfile/pages/ProfilePage'
import { ROLES } from '@/features/roles/roles'
import { UsersPage } from '@/features/users/pages/UsersPage'
import { AuthGuard } from '@/guards/AuthGuard'
import { RoleGuard } from '@/guards/RoleGuard'
import { AppLayout } from '@/layouts/AppLayout'
import type { RouteObject } from 'react-router-dom'

export const privateRoutes: RouteObject[] = [
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <RoleGuard allowedRoles={[ROLES.ADMIN]}><DashboardPage /></RoleGuard> },
          { path: '/ventas', element: <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}><div>Ventas</div></RoleGuard> },
          { path: '/gastos', element: <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}><div>Gastos</div></RoleGuard> },
          { path: '/inventario', element: <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.INVENTARIO]}><div>Inventario</div></RoleGuard> },
          { path: '/usuarios', element: <RoleGuard allowedRoles={[ROLES.ADMIN]}><UsersPage /></RoleGuard> },
          { path: '/negocio', element: <RoleGuard allowedRoles={[ROLES.ADMIN]}><MyBusinessPage /></RoleGuard> },
          { path: '/perfil', element: <ProfilePage /> }
        ]
      }
    ]
  }
]
