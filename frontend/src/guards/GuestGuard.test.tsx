import { GuestGuard } from '@/guards/GuestGuard'
import { useAuthStore } from '@/store/auth.store'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/store/auth.store')

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid='navigate'>Redirecting to {to}</div>,
  Outlet: () => <div data-testid='outlet'>Outlet Content</div>
}))

const mockUseAuthStore = vi.mocked(useAuthStore)

describe('GuestGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render SkeletonAuth when isInitializing is true', () => {
    mockUseAuthStore.mockReturnValue({
      isInitializing: true,
      isAuthenticated: false
    })

    render(<GuestGuard />)

    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument()
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
  })

  it('should navigate to /dashboard when isAuthenticated is true', () => {
    mockUseAuthStore.mockReturnValue({
      isInitializing: false,
      isAuthenticated: true
    })

    render(<GuestGuard />)
    expect(screen.getByTestId('navigate')).toHaveTextContent('Redirecting to /dashboard')
  })

  it('should render Outlet when isAuthenticated is false', () => {
    mockUseAuthStore.mockReturnValue({
      isInitializing: false,
      isAuthenticated: false
    })

    render(<GuestGuard />)
    expect(screen.getByTestId('outlet')).toHaveTextContent('Outlet Content')
  })
})
