import type { SidebarItem } from '@/components/shared/Sidebar/sidebar.types'
import { ROLES } from '@/features/roles/roles'
import { BadgeDollarSign, Boxes, BriefcaseBusiness, Building2, ChartColumn, Users2 } from 'lucide-react'

export const mainItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: ChartColumn,
    path: '/dashboard',
    id: 'dashboard',
    roles: [ROLES.ADMIN]
  },
  {
    label: 'Ventas',
    icon: BriefcaseBusiness,
    path: '/ventas',
    id: 'ventas',
    roles: [ROLES.ADMIN, ROLES.VENDEDOR]
  },
  {
    label: 'Gastos',
    icon: BadgeDollarSign,
    path: '/gastos',
    id: 'gastos',
    roles: [ROLES.ADMIN, ROLES.VENDEDOR]
  },
  {
    label: 'Inventario',
    icon: Boxes,
    path: '/inventario',
    id: 'inventario',
    roles: [ROLES.ADMIN, ROLES.INVENTARIO],
    subItems: [
      {
        label: 'Dashboard',
        path: '/inventario/dashboard',
        id: 'inventario-dashboard',
        roles: [ROLES.ADMIN, ROLES.INVENTARIO]
      },
      {
        label: 'Movimientos',
        path: '/inventario/movimientos',
        id: 'inventario-movimientos',
        roles: [ROLES.ADMIN, ROLES.INVENTARIO]
      },
      {
        label: 'Cátalogo',
        path: '/inventario/catalogo',
        id: 'inventario-catalogo',
        roles: [ROLES.ADMIN, ROLES.INVENTARIO]
      }
    ]
  }
]

export const settingsItems: SidebarItem[] = [
  { label: 'Usuarios', icon: Users2, path: '/usuarios', id: 'usuarios', roles: [ROLES.ADMIN] },
  { label: 'Mi Negocio', icon: Building2, path: '/negocio', id: 'negocio', roles: [ROLES.ADMIN] }
]
