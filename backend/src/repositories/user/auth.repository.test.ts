import { AuthRepository } from '@/repositories/user/auth.repository'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'
import { ROLES } from '@/types/user/role.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'

describe('AuthRepository', () => {
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
    authWithPassword: jest.Mock
    authRefresh: jest.Mock
    update: jest.Mock
  }
  let save: jest.Mock
  let getURL: jest.Mock
  let createClient: jest.Mock
  let repository: AuthRepository

  beforeEach(() => {
    collection = {
      authWithPassword: jest.fn(),
      authRefresh: jest.fn(),
      update: jest.fn()
    }
    save = jest.fn()
    getURL = jest.fn().mockReturnValue('https://files.example.com/avatar.png')
    const client = {
      collection: jest.fn().mockReturnValue(collection),
      authStore: { save },
      files: { getURL }
    }
    createClient = jest.fn().mockReturnValue(client)
    repository = new AuthRepository(createClient as unknown as PocketBaseClientFactory)
  })

  it('creates a session with a new PocketBase client', () => {
    const session = repository.createSession()

    expect(session).toBeDefined()
    expect(createClient).toHaveBeenCalledTimes(1)
  })

  it('authenticates with password and maps the returned user', async () => {
    collection.authWithPassword.mockResolvedValue({ token: 'session-token', record })
    const session = repository.createSession()

    await expect(session.authWithPassword(record.email, 'password123')).resolves.toMatchObject({
      token: 'session-token',
      user: {
        id: record.id,
        email: record.email,
        avatar: 'https://files.example.com/avatar.png',
        role: ROLES.VENDEDOR
      }
    })
    expect(collection.authWithPassword).toHaveBeenCalledWith(record.email, 'password123')
    expect(getURL).toHaveBeenCalledWith(record, record.avatar)
  })

  it('translates invalid password credentials into UNAUTHORIZED', async () => {
    collection.authWithPassword.mockRejectedValue({ status: 400 })
    const session = repository.createSession()

    await expect(session.authWithPassword(record.email, 'wrong-password')).rejects.toMatchObject({
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Invalid credentials'
    } satisfies Partial<AppError>)
  })

  it('saves the token before refreshing the authentication session', async () => {
    collection.authRefresh.mockResolvedValue({ token: 'refreshed-token', record })
    const session = repository.createSession()

    await expect(session.authRefresh('session-token')).resolves.toMatchObject({
      token: 'refreshed-token',
      user: {
        id: record.id,
        email: record.email,
        avatar: 'https://files.example.com/avatar.png'
      }
    })
    expect(save).toHaveBeenCalledWith('session-token', null)
    expect(collection.authRefresh).toHaveBeenCalledTimes(1)
  })

  it('translates an expired session into UNAUTHORIZED', async () => {
    collection.authRefresh.mockRejectedValue({ status: 401 })
    const session = repository.createSession()

    await expect(session.authRefresh('expired-token')).rejects.toMatchObject({
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Invalid session'
    })
    expect(save).toHaveBeenCalledWith('expired-token', null)
  })

  it('updates the authenticated user and maps the result', async () => {
    collection.update.mockResolvedValue({ ...record, lastLogin: '2026-02-01 00:00:00.000Z' })
    const session = repository.createSession()
    const update = { lastLogin: '2026-02-01 00:00:00.000Z' }

    await expect(session.updateUser(record.id, update)).resolves.toMatchObject({
      id: record.id,
      lastLogin: update.lastLogin,
      avatar: 'https://files.example.com/avatar.png'
    })
    expect(collection.update).toHaveBeenCalledWith(record.id, update)
  })

  it('translates missing-user update errors into NOT_FOUND', async () => {
    collection.update.mockRejectedValue({ status: 404 })
    const session = repository.createSession()

    await expect(session.updateUser(record.id, { lastLogin: '2026-02-01 00:00:00.000Z' })).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      message: 'User not found'
    })
  })
})
