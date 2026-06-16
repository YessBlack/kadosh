import { Navigate, Outlet } from 'react-router-dom'

export const GuestGuard = () => {
  const isAuthenticated = false
  const isLoading = false

  if (isLoading) {
    return <div>Cargando sesion...</div>
  }

  return isAuthenticated ? <Navigate to='/' /> : <Outlet />
}
