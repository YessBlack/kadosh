import axios from 'axios'
import api from '@/lib/axios'

const getMovements = async () => {
  try {
    const response = await api.get('/inventory-movements')
    console.log('Fetched movements:', response.data)
    return response?.data ?? []
  } catch (error) {
    console.error('Error fetching movements:', error)
    return []
  }
}

const createMovement = async (movementData: object) => {
  try {
    const response = await api.post('/inventory-movements', movementData)
    return response.data
  } catch (error) {
    console.error('Error creating movement:', {
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      data: axios.isAxiosError(error) ? error.response?.data : error
    })
    throw error
  }
}

const updateMovement = async (id: string, movementData: object) => {
  try {
    const response = await api.patch(`/inventory-movements/${id}`, movementData)
    return response.data
  } catch (error) {
    console.error('Error updating item:', error)
    throw error
  }
}

const deleteMovement = async (id: string) => {
  try {
    await api.delete(`/inventory-movements/${id}`)
  } catch (error) {
    console.error('Error deleting movement:', error)
    throw error
  }
}

export const movementApi = {
  getMovements,
  createMovement,
  updateMovement,
  deleteMovement
}
