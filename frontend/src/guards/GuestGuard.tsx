import { SkeletonAuth } from '@/components/shared/Skeleton/SkeletonAuth'
import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

export const GuestGuard = () => {
  const { isInitializing, isAuthenticated } = useAuthStore()

  if (isInitializing) {
    return <SkeletonAuth />
  }

  return isAuthenticated ? <Navigate to='/dashboard' replace /> : <Outlet />
}
