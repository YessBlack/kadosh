import { BusinessForm } from '@/features/myBusiness/components/BusinessForm'
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

describe('BusinessForm', () => {
  const updateBusiness = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBusinessStore.mockReturnValue({
      business,
      updateBusiness
    } as unknown as ReturnType<typeof useBusinessStore>)
  })

  it('renders business information and disables submit until a value changes', () => {
    render(<BusinessForm />)

    expect(screen.getByText('Información del Negocio')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Kadosh')).toHaveValue('Kadosh')
    expect(screen.getByRole('button', { name: 'Actualizar Información' })).toBeDisabled()
  })

  it('submits the changed business fields and shows success feedback', async () => {
    updateBusiness.mockResolvedValue(undefined)
    render(<BusinessForm />)

    fireEvent.change(screen.getByPlaceholderText('Kadosh'), {
      target: { value: 'Kadosh Store' }
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Actualizar Información' }).closest('form') as HTMLFormElement)

    await waitFor(() => {
      expect(updateBusiness).toHaveBeenCalledWith('business-1', {
        name: 'Kadosh Store',
        nit: business.nit,
        companyType: business.companyType,
        industry: business.industry,
        description: business.description
      })
    })
    expect(showToast.success).toHaveBeenCalledWith('Exito', 'Información Actualizada')
  })

  it('shows the API error when saving fails', async () => {
    updateBusiness.mockRejectedValue({ response: { data: { message: 'No se pudo guardar' } } })
    render(<BusinessForm />)

    fireEvent.change(screen.getByPlaceholderText('Kadosh'), {
      target: { value: 'Kadosh Store' }
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Actualizar Información' }).closest('form') as HTMLFormElement)

    await waitFor(() => {
      expect(showToast.error).toHaveBeenCalledWith('Error', 'No se pudo guardar')
    })
  })
})
