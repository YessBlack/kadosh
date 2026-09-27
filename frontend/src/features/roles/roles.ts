export const ROLES = {
  ADMIN: 'admin',
  VENDEDOR: 'vendedor',
  INVENTARIO: 'inventario'
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const MODULES = {
  DASHBOARD: 'dashboard',
  SALES: 'sales',
  EXPENSES: 'expenses',
  INVENTORY: 'inventory',
  USERS: 'users',
  BUSINESS: 'business'
} as const

export type Module = typeof MODULES[keyof typeof MODULES]

const ROLE_MODULES: Record<Role, readonly Module[]> = {
  [ROLES.ADMIN]: [MODULES.DASHBOARD, MODULES.SALES, MODULES.EXPENSES, MODULES.INVENTORY, MODULES.USERS, MODULES.BUSINESS],
  [ROLES.VENDEDOR]: [MODULES.SALES, MODULES.EXPENSES],
  [ROLES.INVENTARIO]: [MODULES.INVENTORY]
}

const MODULE_LANDING_PATHS: Partial<Record<Module, string>> = {
  [MODULES.DASHBOARD]: '/dashboard',
  [MODULES.SALES]: '/ventas',
  [MODULES.EXPENSES]: '/gastos',
  [MODULES.INVENTORY]: '/inventario',
  [MODULES.USERS]: '/usuarios'
}

export const hasRoleAccess = (role: Role | undefined, module: Module): boolean => {
  return Boolean(role && ROLE_MODULES[role].includes(module))
}

export const getRoleLandingPath = (role?: Role): string => {
  const accessibleModules = role ? ROLE_MODULES[role] : []

  const firstAvailablePath = accessibleModules
    .map(module => MODULE_LANDING_PATHS[module])
    .find(Boolean)

  return firstAvailablePath || '/perfil'
}
