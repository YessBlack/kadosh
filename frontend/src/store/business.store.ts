import { businessApi } from '@/features/myBusiness/api/business.api'
import type { Business, UpdateBusinessData } from '@/features/myBusiness/types/Business'
import { create } from 'zustand'

interface BusinessStore {
  business: Business | null
  isLoading: boolean
  error: string | null
  getBusiness: () => Promise<void>
  updateBusiness: (id:string, data: UpdateBusinessData) => Promise<void>
  updateLogo: (id:string, data: File) => Promise<void>
}

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  business: null,
  isLoading: false,
  error: null,

  getBusiness: async () => {
    if (get().isLoading) return
    set({ isLoading: true, error: null })
    try {
      const business = await businessApi.get()
      set({ business, isLoading: false })
    } catch (error) {
      set({ error: 'No se pudo cargar el negocio', isLoading: false })
      throw error
    }
  },

  updateBusiness: async (id:string, data: UpdateBusinessData) => {
    set({ isLoading: true, error: null })
    try {
      const business = await businessApi.update(id, data)
      set({ business, isLoading: false })
    } catch (error) {
      set({ error: 'No se pudo actualizar el negocio', isLoading: false })
      throw error
    }
  },

  updateLogo: async (id: string, data: File) => {
    set({ isLoading: true, error: null })
    try {
      const business = await businessApi.updateLogo(id, data)
      set({ business, isLoading: false })
    } catch (error) {
      set({ error: 'No se pudo actualizar el logo', isLoading: false })
      throw error
    }
  }
}))
