import { UserRepository } from '@/repositories/user/user.repository'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'
import { ROLES } from '@/types/user/role.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'

describe('UserRepository', () => {
  const record = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test',
    lastname: 'User',
    isActive: true,
    createdAt: '2026-01-01 00:00:00.000Z',
    updatedAt: '2026-01-02 00:00:00.000Z',
    createdBy: 'admin-1',
    avatar: 'avatar.png',
    isDeleted: false,
    phone: '+573001234567',
    lastLogin: '2026-01-03 00:00:00.000Z',
    role: ROLES.VENDEDOR
  }

  let collection: {
    getFullList: jest.Mock
    getOne: jest.Mock
    getFirstListItem: jest.Mock
    create: jest.Mock
    update: jest.Mock
    delete: jest.Mock
  }
  let getURL: jest.Mock
  let repository: UserRepository

  beforeEach(() => {
    collection = {
      getFullList: jest.fn(),
      getOne: jest.fn(),
      getFirstListItem: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
    getURL = jest.fn().mockReturnValue('https://files.example.com/avatar.png')
    const client = {
      collection: jest.fn().mockReturnValue(collection),
      files: { getURL }
    }
    repository = new UserRepository((() => client) as unknown as PocketBaseClientFactory)
  })

  it('lists non-deleted users and maps their avatar URLs', async () => {
    collection.getFullList.mockResolvedValue([record])

    await expect(repository.findAll()).resolves.toEqual([{
      id: record.id,
      email: record.email,
      name: record.name,
      lastname: record.lastname,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      createdBy: record.createdBy,
      avatar: 'https://files.example.com/avatar.png',
      isDeleted: record.isDeleted,
      phone: record.phone,
      lastLogin: record.lastLogin,
      role: record.role
    }])
    expect(collection.getFullList).toHaveBeenCalledWith({ filter: 'isDeleted=false' })
    expect(getURL).toHaveBeenCalledWith(record, record.avatar)
  })

  it('returns and maps a user by id', async () => {
    collection.getOne.mockResolvedValue(record)

    await expect(repository.findById(record.id)).resolves.toMatchObject({
      id: record.id,
      email: record.email,
      avatar: 'https://files.example.com/avatar.png'
    })
    expect(collection.getOne).toHaveBeenCalledWith(record.id)
  })

  it('returns null when a user id does not exist', async () => {
    collection.getOne.mockRejectedValue({ status: 404 })

    await expect(repository.findById('missing-user')).resolves.toBeNull()
  })

  it('rethrows unexpected errors when looking up a user by id', async () => {
    const error = new Error('PocketBase unavailable')
    collection.getOne.mockRejectedValue(error)

    await expect(repository.findById(record.id)).rejects.toBe(error)
  })

  it('finds a user by email', async () => {
    collection.getFirstListItem.mockResolvedValue(record)

    await expect(repository.findByEmail(record.email)).resolves.toMatchObject({
      id: record.id,
      email: record.email
    })
    expect(collection.getFirstListItem).toHaveBeenCalledWith(`email="${record.email}"`)
  })

  it('returns null when an email does not match a user', async () => {
    collection.getFirstListItem.mockRejectedValue({ status: 404 })

    await expect(repository.findByEmail('missing@example.com')).resolves.toBeNull()
  })

  it('creates users with repository-managed defaults', async () => {
    collection.create.mockResolvedValue(record)
    const input = {
      email: record.email,
      password: 'password123',
      passwordConfirm: 'password123',
      name: record.name,
      lastname: record.lastname,
      isActive: true,
      role: ROLES.VENDEDOR
    }

    await expect(repository.create(input)).resolves.toMatchObject({ id: record.id })
    expect(collection.create).toHaveBeenCalledWith({
      ...input,
      emailVisibility: true,
      avatar: '',
      isDeleted: false
    })
  })

  it('translates duplicate email errors into CONFLICT', async () => {
    collection.create.mockRejectedValue({
      status: 400,
      response: { data: { email: { code: 'validation_not_unique' } } }
    })

    await expect(repository.create({
      email: record.email,
      password: 'password123',
      passwordConfirm: 'password123',
      name: record.name,
      lastname: record.lastname,
      isActive: true,
      role: ROLES.VENDEDOR
    })).rejects.toMatchObject({
      code: ERROR_CODES.CONFLICT,
      message: 'User already exists'
    } satisfies Partial<AppError>)
  })

  it('updates a user and maps the updated record', async () => {
    collection.update.mockResolvedValue({ ...record, isActive: false })

    await expect(repository.update(record.id, { isActive: false })).resolves.toMatchObject({
      id: record.id,
      isActive: false
    })
    expect(collection.update).toHaveBeenCalledWith(record.id, { isActive: false })
  })

  it('translates missing-user update errors into NOT_FOUND', async () => {
    collection.update.mockRejectedValue({ status: 404 })

    await expect(repository.update(record.id, { name: 'Updated' })).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      message: 'User not found'
    })
  })

  it('translates update validation errors', async () => {
    collection.update.mockRejectedValue({
      status: 400,
      response: { data: { name: { message: 'Name is required' } } }
    })

    await expect(repository.update(record.id, { name: '' })).rejects.toMatchObject({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Name is required'
    })
  })

  it('uploads an avatar as multipart data and maps the updated user', async () => {
    collection.update.mockResolvedValue(record)
    const file = new Blob(['avatar'], { type: 'image/png' })

    await expect(repository.updateAvatar(record.id, file, 'new-avatar.png')).resolves.toMatchObject({
      id: record.id,
      avatar: 'https://files.example.com/avatar.png'
    })

    const [, formData] = collection.update.mock.calls[0]
    expect(formData).toBeInstanceOf(FormData)
    expect((formData as FormData).get('avatar')).toBeInstanceOf(Blob)
    expect(getURL).toHaveBeenCalledWith(record, record.avatar)
  })

  it('translates missing-user avatar errors into NOT_FOUND', async () => {
    collection.update.mockRejectedValue({ status: 404 })

    await expect(repository.updateAvatar(record.id, new Blob(['avatar']), 'avatar.png')).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      message: 'User not found'
    })
  })

  it('deletes a user', async () => {
    collection.delete.mockResolvedValue(undefined)

    await expect(repository.delete(record.id)).resolves.toBeUndefined()
    expect(collection.delete).toHaveBeenCalledWith(record.id)
  })

  it('translates missing-user delete errors into NOT_FOUND', async () => {
    collection.delete.mockRejectedValue({ status: 404 })

    await expect(repository.delete(record.id)).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      message: 'User not found'
    })
  })
})
