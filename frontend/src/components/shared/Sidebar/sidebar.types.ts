import type { LucideIcon } from 'lucide-react'
import type { Role } from '@/features/roles/roles'

export type SidebarItem = {
  id: string
  label: string
  path: string
  icon?: LucideIcon
  roles: Role[]
  subItems?: SidebarItem[]
}
