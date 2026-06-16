import { AuthGuard } from '@/guards/AuthGuard'
import { AppLayout } from '@/layouts/AppLayout'
import type { RouteObject } from 'react-router-dom'

export const privateRoutes: RouteObject[] = [
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <div>Dashboard</div> },
          { path: '/ventas', element: <div>Ventas</div> },
          { path: '/gastos', element: <div>Gastos</div> },
          { path: '/inventario', element: <div>Inventario</div> },
          { path: '/usuarios', element: <div>Usuarios</div> },
          { path: '/negocio', element: <div>Mi Negocio</div> },
          { path: '/perfil', element: <div>Mi Perfil</div> }
        ]
      }
    ]
  }
]
