import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

export const GuestGuard = () => {
  const { isInitializing, isAuthenticated } = useAuthStore()

  if (isInitializing) {
    return <div>Cargando sesion...</div>
  }

  return isAuthenticated ? <Navigate to='/dashboard' replace /> : <Outlet />
}
