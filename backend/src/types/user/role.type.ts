export const ROLES = {
  ADMIN: 'admin',
  VENDEDOR: 'vendedor',
  INVENTARIO: 'inventario'
} as const

export type Role = typeof ROLES[keyof typeof ROLES]
