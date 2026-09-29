import { Role } from '@/types/user/role.type'
import { Request, Response, NextFunction } from 'express'

export function requireRole (...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    next()
  }
}

export function requireSelfOrRole (role: Role, editableFields?: readonly string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (req.user.role === role) {
      next()
      return
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id

    if (req.user.id !== id) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    if (editableFields) {
      const hasForbiddenField = Object.keys(req.body ?? {}).some(field => !editableFields.includes(field))
      if (hasForbiddenField) {
        res.status(403).json({ message: 'You can only update your profile details' })
        return
      }
    }

    next()
  }
}
