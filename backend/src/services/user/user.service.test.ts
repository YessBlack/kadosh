import { UserService } from '@/services/user/user.service'
import { IUserRepository } from '@/types/user/user/user.repository.type'
import { AppError } from '@/utils/app-error'
import { MAX_AVATAR_SIZE_BYTES } from '@/config/upload'

describe('UserService avatar size', () => {
  const user = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test',
    lastname: 'User',
    isActive: true,
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    avatar: '',
    isDeleted: false,
    role: 'admin' as const
  }

  it('accepts an image larger than 1 MB and within the 5 MB limit', async () => {
    const repository = {
      updateAvatar: jest.fn().mockResolvedValue(user)
    } as unknown as IUserRepository
    const service = new UserService(repository)
    const image = new Blob([new Uint8Array(1_100_000)], { type: 'image/jpeg' })

    await expect(service.updateAvatar(user.id, image, 'avatar.jpg')).resolves.toEqual(user)
    expect(repository.updateAvatar).toHaveBeenCalledWith(user.id, image, 'avatar.jpg')
  })

  it('rejects images larger than 5 MB', async () => {
    const repository = {
      updateAvatar: jest.fn()
    } as unknown as IUserRepository
    const service = new UserService(repository)
    const image = new Blob([new Uint8Array(MAX_AVATAR_SIZE_BYTES + 1)], { type: 'image/jpeg' })

    await expect(service.updateAvatar(user.id, image, 'avatar.jpg')).rejects.toMatchObject({
      code: 'FILE_TOO_LARGE'
    } satisfies Partial<AppError>)
    expect(repository.updateAvatar).not.toHaveBeenCalled()
  })
})
