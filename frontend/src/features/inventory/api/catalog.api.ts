import type { Item } from '@/features/inventory/types/catalog.types'
import api from '@/lib/axios'

const getItems = async () => {
  try {
    const response = await api.get('/inventory-items')
    return response?.data ?? []
  } catch (error) {
    console.error('Error fetching items:', error)
    return []
  }
}

const searchProducts = async (q: string): Promise<Item[]> => {
  try {
    const res = await api.get('/inventory-items/search', { params: { q } })
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}

const createItem = async (itemData: object) => {
  try {
    const response = await api.post('/inventory-items', itemData)
    return response.data
  } catch (error) {
    console.error('Error creating item:', error)
    throw error
  }
}

const updateItem = async (id: string, itemData: object) => {
  try {
    const response = await api.patch(`/inventory-items/${id}`, itemData)
    return response.data
  } catch (error) {
    console.error('Error updating item:', error)
    throw error
  }
}

const deleteItem = async (id: string) => {
  try {
    await api.delete(`/inventory-items/${id}`)
  } catch (error) {
    console.error('Error deleting item:', error)
    throw error
  }
}

export const catalogApi = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  searchProducts
}
