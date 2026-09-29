import type { Business, UpdateBusinessData } from '@/features/myBusiness/types/Business'
import api from '@/lib/axios'

export const businessApi = {
  get: async (): Promise<Business> => {
     const response = await api.get('business')
    return response.data
  },

  update: async (id: string, payload: UpdateBusinessData): Promise<Business> => {
    const { data } = await api.patch<Business>(`/business/${id}`, payload)
    return data
  },

  updateLogo: async (id: string, file: File) => {
    const formData = new FormData()
    formData.append('logo', file)

    const response = await api.patch(`business/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return response.data
  }
}
