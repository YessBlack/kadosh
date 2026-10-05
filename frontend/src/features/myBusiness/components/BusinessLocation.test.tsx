import { BusinessLocation } from '@/features/myBusiness/components/BusinessLocation'
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
  logo: ''
}

describe('BusinessLocation', () => {
  const updateBusiness = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBusinessStore.mockReturnValue({
      business,
      updateBusiness
    } as unknown as ReturnType<typeof useBusinessStore>)
  })

  it('renders contact and location fields and disables submit until a value changes', () => {
    render(<BusinessLocation />)

    expect(screen.getByText('Datos de Contacto y Ubicación')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Bogotá')).toHaveValue('Bogota')
    expect(screen.getByRole('button', { name: 'Actualizar Información' })).toBeDisabled()
  })

  it('submits contact and location fields and shows success feedback', async () => {
    updateBusiness.mockResolvedValue(undefined)
    render(<BusinessLocation />)

    fireEvent.change(screen.getByPlaceholderText('Bogotá'), {
      target: { value: 'Medellin' }
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Actualizar Información' }).closest('form') as HTMLFormElement)

    await waitFor(() => {
      expect(updateBusiness).toHaveBeenCalledWith('business-1', {
        city: 'Medellin',
        email: business.email,
        phone: business.phone
      })
    })
    expect(showToast.success).toHaveBeenCalledWith('Exito', 'Información Actualizada')
  })

  it('shows a fallback error when the API error has no message', async () => {
    updateBusiness.mockRejectedValue(new Error('Request failed'))
    render(<BusinessLocation />)

    fireEvent.change(screen.getByPlaceholderText('Bogotá'), {
      target: { value: 'Medellin' }
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Actualizar Información' }).closest('form') as HTMLFormElement)

    await waitFor(() => {
      expect(showToast.error).toHaveBeenCalledWith(
        'Error',
        'Ocurrio un error al actualizar la información'
      )
    })
  })
})
