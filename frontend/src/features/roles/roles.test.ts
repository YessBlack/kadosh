import { describe, expect, it } from 'vitest'
import { getRoleLandingPath, hasRoleAccess, MODULES, ROLES } from './roles'

describe('role module access', () => {
  it('grants modules according to the assigned role', () => {
    expect(hasRoleAccess(ROLES.ADMIN, MODULES.USERS)).toBe(true)
    expect(hasRoleAccess(ROLES.VENDEDOR, MODULES.SALES)).toBe(true)
    expect(hasRoleAccess(ROLES.VENDEDOR, MODULES.INVENTORY)).toBe(false)
    expect(hasRoleAccess(ROLES.INVENTARIO, MODULES.INVENTORY)).toBe(true)
  })

  it('selects the first module available to the assigned role', () => {
    expect(getRoleLandingPath(ROLES.ADMIN)).toBe('/dashboard')
    expect(getRoleLandingPath(ROLES.VENDEDOR)).toBe('/ventas')
    expect(getRoleLandingPath(ROLES.INVENTARIO)).toBe('/inventario')
    expect(getRoleLandingPath(undefined)).toBe('/perfil')
  })
})