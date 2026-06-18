import type { SidebarItem } from '@/components/shared/Sidebar/sidebar.types'
import { BadgeDollarSign, BriefcaseBusiness, Building2, ChartColumn, ListTodo, Users2 } from 'lucide-react'

export const mainItems: SidebarItem[] = [
  { label: 'Dashboard', icon: ChartColumn, path: '/dashboard', id: 'dashboard' },
  { label: 'Ventas', icon: BriefcaseBusiness, path: '/ventas', id: 'ventas' },
  { label: 'Gastos', icon: BadgeDollarSign, path: '/gastos', id: 'gastos' },
  { label: 'Inventario', icon: ListTodo, path: '/inventario', id: 'inventario' }
]

export const settingsItems: SidebarItem[] = [
  { label: 'Usuarios', icon: Users2, path: '/usuarios', id: 'usuarios' },
  { label: 'Mi Negocio', icon: Building2, path: '/negocio', id: 'negocio' }
]
