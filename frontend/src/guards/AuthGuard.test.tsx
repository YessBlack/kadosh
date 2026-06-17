import { AuthGuard } from '@/guards/AuthGuard'
import { useAuthStore } from '@/store/auth.store'
import { beforeEach, describe, it, vi, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/store/auth.store')

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid='navigate'>Redirecting to {to}</div>,
  Outlet: () => <div data-testid='outlet'>Outlet Content</div>
}))

const mockUseAuthStore = vi.mocked(useAuthStore)

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render SkeletonAuth when isInitializing is true', () => {
    mockUseAuthStore.mockReturnValue({
      isInitializing: true,
      isAuthenticated: false
    })

    render(<AuthGuard />)
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument()
  })

  it('should navigate to /login when isAuthenticated is false', () => {
    mockUseAuthStore.mockReturnValue({
      isInitializing: false,
      isAuthenticated: false
    })

    render(<AuthGuard />)
    expect(screen.getByTestId('navigate')).toHaveTextContent('Redirecting to /login')
  })

  it('should render Outlet when isAuthenticated is true', () => {
    mockUseAuthStore.mockReturnValue({
      isInitializing: false,
      isAuthenticated: true
    })

    render(<AuthGuard />)
    expect(screen.getByTestId('outlet')).toHaveTextContent('Outlet Content')
  })
})
