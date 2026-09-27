import { Permission } from '@/types/user/permissions/permission.type'
import { ROLE_PERMISSIONS } from '@/types/user/permissions/role.permissions'
import { Request, Response, NextFunction } from 'express'

export function requirePermission (permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const permissions = ROLE_PERMISSIONS[req.user.role]

    if (!permissions?.includes(permission)) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    next()
  }
}
