import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { authRoutes } from './auth.routes'
import { privateRoutes } from './private.routes'
import { SkeletonAuth } from '@/components/shared/SkeletonAuth'
import { SkeletonDashboard } from '@/components/shared/SkeletonDashboard'

const withSuspense = (element: ReactNode, fallback: ReactNode) => {
  return <Suspense fallback={fallback}>{element}</Suspense>
}

const wrapRoutesWithSuspense = (routes: RouteObject[], fallback: ReactNode): RouteObject[] => {
  return routes.map(route => {
    const wrappedRoute: RouteObject = {
      ...route,
      element: route.element ? withSuspense(route.element, fallback) : route.element
    }

    if (route.children) {
      wrappedRoute.children = wrapRoutesWithSuspense(route.children, fallback)
    }

    return wrappedRoute
  })
}

export const router = createBrowserRouter([
  ...wrapRoutesWithSuspense(authRoutes, <SkeletonAuth />),
  ...wrapRoutesWithSuspense(privateRoutes, <SkeletonDashboard />),
  { path: '*', element: <Navigate to='/dashboard' replace /> }
])
