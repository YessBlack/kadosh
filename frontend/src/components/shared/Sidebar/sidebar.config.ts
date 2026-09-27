import type { SidebarItem } from '@/components/shared/Sidebar/sidebar.types'
import { ROLES } from '@/features/roles/roles'
import { BadgeDollarSign, BriefcaseBusiness, Building2, ChartColumn, ListTodo, Users2 } from 'lucide-react'

export const mainItems: SidebarItem[] = [
  { label: 'Dashboard', icon: ChartColumn, path: '/dashboard', id: 'dashboard', roles: [ROLES.ADMIN] },
  { label: 'Ventas', icon: BriefcaseBusiness, path: '/ventas', id: 'ventas', roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
  { label: 'Gastos', icon: BadgeDollarSign, path: '/gastos', id: 'gastos', roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
  { label: 'Inventario', icon: ListTodo, path: '/inventario', id: 'inventario', roles: [ROLES.ADMIN, ROLES.INVENTARIO] }
]

export const settingsItems: SidebarItem[] = [
  { label: 'Usuarios', icon: Users2, path: '/usuarios', id: 'usuarios', roles: [ROLES.ADMIN] },
  { label: 'Mi Negocio', icon: Building2, path: '/negocio', id: 'negocio', roles: [ROLES.ADMIN] }
]
