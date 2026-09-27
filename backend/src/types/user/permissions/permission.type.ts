export const PERMISSIONS = {
  SALES_CREATE: 'sales:create',
  SALES_READ: 'sales:read',
  EXPENSES_CREATE: 'expenses:create',
  EXPENSES_READ: 'expenses:read',
  INVENTORY_READ: 'inventory:read',
  INVENTORY_WRITE: 'inventory:write',
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write'
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]
