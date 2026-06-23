import type { User } from '@/features/users/types/auth.types'
import api from '@/lib/axios'

const getAllUsers = async () => {
   const response = await api.get('users')
  return response.data
}

const getUserById = async (id: string) => {
   const response = await api.get(`users/${id}`)
  return response.data
}

const createUser = async (data: Partial<User>) => {
   const response = await api.post('users', data)
  return response.data
}

const updateUser = async (id: string, data: Partial<User>) => {
   const response = await api.put(`users/${id}`, data)
  return response.data
}

const deleteUser = async (id: string) => {
   const response = await api.delete(`users/${id}`)
  return response.data
}

export const userApi = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}
