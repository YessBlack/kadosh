import { SkeletonDashboard } from '../components/shared/Skeleton/SkeletonDashboard'
import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

export const AuthGuard = () => {
  const { isInitializing, isAuthenticated } = useAuthStore()

  if (isInitializing) {
    return <SkeletonDashboard />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
}
