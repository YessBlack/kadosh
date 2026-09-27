import { getRoleLandingPath, type Role } from '@/features/roles/roles'
import { useAuthStore } from '@/store/auth.store'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface RoleGuardProps {
  allowedRoles: Role[]
  children: ReactNode
}

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const role = useAuthStore(state => state.user?.role)

  return role && allowedRoles.includes(role)
    ? children
    : <Navigate to={getRoleLandingPath(role)} replace />
}