import { PERMISSIONS, Permission } from './permission.type'
import { ROLES, Role } from './role.type'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.VENDEDOR]: [
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.SALES_READ,
    PERMISSIONS.EXPENSES_CREATE,
    PERMISSIONS.EXPENSES_READ
  ],
  [ROLES.INVENTARIO]: [
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_WRITE
  ]
}
