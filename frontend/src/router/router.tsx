import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { authRoutes } from './auth.routes'
import { privateRoutes } from './private.routes'

const withSuspense = (element: ReactNode) => {
  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
}

const wrapRoutesWithSuspense = (routes: RouteObject[]): RouteObject[] => {
  return routes.map(route => {
    const wrappedRoute: RouteObject = {
      ...route,
      element: route.element ? withSuspense(route.element) : route.element
    }

    if (route.children) {
      wrappedRoute.children = wrapRoutesWithSuspense(route.children)
    }

    return wrappedRoute
  })
}

export const router = createBrowserRouter([
  ...wrapRoutesWithSuspense(authRoutes),
  ...wrapRoutesWithSuspense(privateRoutes),
  { path: '*', element: <Navigate to='/dashboard' replace /> }
])
