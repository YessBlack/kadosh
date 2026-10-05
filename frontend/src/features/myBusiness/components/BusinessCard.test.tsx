import { BusinessCard } from '@/features/myBusiness/components/BusinessCard'
import type { Business } from '@/features/myBusiness/types/Business'
import { useBusinessStore } from '@/store/business.store'
import { showToast } from '@/utils/toast.utils'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/store/business.store', () => ({ useBusinessStore: vi.fn() }))
vi.mock('@/utils/toast.utils', () => ({
  showToast: { success: vi.fn(), error: vi.fn() }
}))

const mockUseBusinessStore = vi.mocked(useBusinessStore)

const business: Business = {
  id: 'business-1',
  name: 'Kadosh',
  nit: '900123456',
  companyType: 'SAS',
  industry: 'Retail',
  description: 'Business description',
  email: 'contact@kadosh.com',
  phone: '+573001234567',
  city: 'Bogota',
  logo: 'https://files.example.com/logo.png'
}

describe('BusinessCard', () => {
  const updateLogo = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBusinessStore.mockReturnValue({
      business,
      updateLogo
    } as unknown as ReturnType<typeof useBusinessStore>)
  })

  it('renders business identity and contact details', () => {
    render(<BusinessCard />)

    expect(screen.getByText('Kadosh')).toBeInTheDocument()
    expect(screen.getByText('NIT: 900123456')).toBeInTheDocument()
    expect(screen.getByText('SAS')).toBeInTheDocument()
    expect(screen.getByText('Retail')).toBeInTheDocument()
    expect(screen.getByText('contact@kadosh.com')).toBeInTheDocument()
    expect(screen.getByText('+573001234567')).toBeInTheDocument()
    expect(screen.getByText('Bogota')).toBeInTheDocument()
  })

  it('uploads a selected logo and shows success feedback', async () => {
    updateLogo.mockResolvedValue(undefined)
    const { container } = render(<BusinessCard />)
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')
    const file = new File(['logo'], 'business-logo.png', { type: 'image/png' })

    expect(input).not.toBeNull()
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })

    await waitFor(() => {
      expect(updateLogo).toHaveBeenCalledWith('business-1', file)
    })
    expect(showToast.success).toHaveBeenCalledWith('Exito', 'Información Actualizada')
  })

  it('shows an error when the logo upload fails', async () => {
    updateLogo.mockRejectedValue(new Error('Upload failed'))
    const { container } = render(<BusinessCard />)
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')
    const file = new File(['logo'], 'business-logo.png', { type: 'image/png' })

    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })

    await waitFor(() => {
      expect(showToast.error).toHaveBeenCalledWith('Error', 'No se pudo actualizar el logo')
    })
  })
})
