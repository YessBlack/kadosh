import api from '@/lib/axios'
import { profileApi } from '@/features/myProfile/api/profile.api'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/axios')

describe('profileApi', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the avatar as multipart form data', async () => {
    vi.mocked(api.patch).mockResolvedValue({ data: { avatar: 'avatar-url' } })
    const image = new File(['image'], 'avatar.png', { type: 'image/png' })

    await profileApi.updateUserAvatar('user-1', image)

    expect(api.patch).toHaveBeenCalledWith(
      'users/user-1/avatar',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    const sentForm = vi.mocked(api.patch).mock.calls[0][1] as FormData
    expect(sentForm.get('avatar')).toBe(image)
  })
})