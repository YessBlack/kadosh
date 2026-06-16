import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'

import { GuestGuard } from '@/guards/GuestGuard'
import { AuthLayout } from '@/layouts/AuthLayout'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))

export const authRoutes: RouteObject[] = [
  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ path: '/login', element: <LoginPage /> }]
      }
    ]
  }
]
