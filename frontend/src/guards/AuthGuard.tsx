import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

export const AuthGuard = () => {
  const { isInitializing, isAuthenticated } = useAuthStore()

  if (isInitializing) {
    return <div>Cargando sesion...</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
}
