import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

export const GuestGuard = () => {
  const { isLoading, isAuthenticated } = useAuthStore()

  if (isLoading) {
    return <div>Cargando sesion...</div>
  }

  return isAuthenticated ? <Navigate to='/dashboard' replace /> : <Outlet />
}
