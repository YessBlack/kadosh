import api from '@/lib/axios'

const updateUserAvatar = async (id: string, file: Blob) => {
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await api.patch(`users/${id}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}

export const profileApi = {
  updateUserAvatar
}
