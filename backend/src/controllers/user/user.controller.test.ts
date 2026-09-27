import request from 'supertest'
import { createApp } from '@/app'
import { UserController } from '@/controllers/user/user.controller'
import { createAuthMiddleware } from '@/middlewares/auth.middleware'
import { createUserRouter } from '@/routes/user/user.routes'
import { ROLES } from '@/types/user/role.type'
import { AppError } from '@/utils/app-error'

const userService = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateAvatar: jest.fn(),
  delete: jest.fn()
}

const authService = {
  login: jest.fn(),
  me: jest.fn(),
  changePassword: jest.fn()
}

const mockUser = {
  id: '1',
  email: 'test@test.com',
  name: 'John',
  lastname: 'Doe',
  isActive: true,
  role: ROLES.VENDEDOR
}

const adminUser = {
  ...mockUser,
  role: ROLES.ADMIN
}

const app = createApp({
  path: '/api/users',
  router: createUserRouter({
    userController: new UserController({ userService }),
    authMiddleware: createAuthMiddleware(authService)
  })
})

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    authService.me.mockResolvedValue({ token: 'refreshed-token', user: adminUser })
  })

  it('rejects requests without an authenticated session', async () => {
    const response = await request(app).get('/api/users/1')

    expect(response.status).toBe(401)
    expect(authService.me).not.toHaveBeenCalled()
    expect(userService.getById).not.toHaveBeenCalled()
  })

  it('denies user management to non-admin roles', async () => {
    authService.me.mockResolvedValue({ token: 'refreshed-token', user: mockUser })

    const response = await request(app)
      .get('/api/users')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(403)
    expect(userService.getAll).not.toHaveBeenCalled()
  })

  it('denies users with an unknown role', async () => {
    authService.me.mockResolvedValue({
      token: 'refreshed-token',
      user: { ...adminUser, role: 'unknown' }
    })

    const response = await request(app)
      .get('/api/users')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(403)
    expect(userService.getAll).not.toHaveBeenCalled()
  })

  it('denies inactive accounts before role authorization', async () => {
    authService.me.mockResolvedValue({
      token: 'refreshed-token',
      user: { ...adminUser, isActive: false }
    })

    const response = await request(app)
      .get('/api/users')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(403)
    expect(userService.getAll).not.toHaveBeenCalled()
  })

  it('returns a user by id', async () => {
    userService.getById.mockResolvedValue(mockUser)

    const response = await request(app)
      .get('/api/users/1')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockUser)
    expect(userService.getById).toHaveBeenCalledWith('1')
  })

  it('maps a missing user to 404', async () => {
    userService.getById.mockRejectedValue(new AppError('USER_NOT_FOUND', 'User not found'))

    const response = await request(app)
      .get('/api/users/unknown')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'User not found' })
  })

  it('allows a user to update their own profile fields', async () => {
    authService.me.mockResolvedValue({ token: 'refreshed-token', user: mockUser })
    userService.update.mockResolvedValue({ ...mockUser, name: 'Jane' })

    const response = await request(app)
      .patch('/api/users/1')
      .set('Cookie', 'token=session-token')
      .send({ name: 'Jane', lastname: 'Doe', phone: '+14155552671' })

    expect(response.status).toBe(200)
    expect(userService.update).toHaveBeenCalledWith('1', {
      name: 'Jane',
      lastname: 'Doe',
      phone: '+14155552671'
    })
  })

  it('prevents a user from changing their own role', async () => {
    authService.me.mockResolvedValue({ token: 'refreshed-token', user: mockUser })

    const response = await request(app)
      .patch('/api/users/1')
      .set('Cookie', 'token=session-token')
      .send({ role: ROLES.ADMIN })

    expect(response.status).toBe(403)
    expect(userService.update).not.toHaveBeenCalled()
  })

  it('prevents a user from editing another user profile', async () => {
    authService.me.mockResolvedValue({ token: 'refreshed-token', user: mockUser })

    const response = await request(app)
      .patch('/api/users/other-user')
      .set('Cookie', 'token=session-token')
      .send({ name: 'Jane' })

    expect(response.status).toBe(403)
    expect(userService.update).not.toHaveBeenCalled()
  })

  it('redirects an authenticated user to their stored avatar file', async () => {
    const avatarUrl = 'http://127.0.0.1:8090/api/files/users/1/avatar.jpg'
    authService.me.mockResolvedValue({ token: 'refreshed-token', user: mockUser })
    userService.getById.mockResolvedValue({ ...mockUser, avatar: avatarUrl })

    const response = await request(app)
      .get('/api/users/1/avatar')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe(avatarUrl)
  })

  it('does not expose another user avatar to non-admins', async () => {
    authService.me.mockResolvedValue({ token: 'refreshed-token', user: mockUser })

    const response = await request(app)
      .get('/api/users/other-user/avatar')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(403)
    expect(userService.getById).not.toHaveBeenCalled()
  })

  it('rejects invalid user input without calling the service', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Cookie', 'token=session-token')
      .send({ email: 'not-an-email' })

    expect(response.status).toBe(400)
    expect(userService.create).not.toHaveBeenCalled()
  })

  it('creates a user with the schema defaults applied', async () => {
    const input = {
      email: 'test@test.com',
      password: 'password123',
      passwordConfirm: 'password123',
      name: 'John',
      lastname: 'Doe',
      role: ROLES.VENDEDOR
    }
    userService.create.mockResolvedValue(mockUser)

    const response = await request(app)
      .post('/api/users')
      .set('Cookie', 'token=session-token')
      .send(input)

    expect(response.status).toBe(201)
    expect(response.body).toEqual(mockUser)
    expect(userService.create).toHaveBeenCalledWith({ ...input, isActive: true })
  })

  it('requires a file for avatar updates', async () => {
    const response = await request(app)
      .patch('/api/users/1/avatar')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(400)
    expect(userService.updateAvatar).not.toHaveBeenCalled()
  })

  it('allows a user to update their own avatar', async () => {
    authService.me.mockResolvedValue({ token: 'refreshed-token', user: mockUser })
    userService.updateAvatar.mockResolvedValue(mockUser)

    const response = await request(app)
      .patch('/api/users/1/avatar')
      .set('Cookie', 'token=session-token')
      .attach('avatar', Buffer.from('avatar'), 'avatar.png')

    expect(response.status).toBe(200)
    expect(userService.updateAvatar).toHaveBeenCalledWith('1', expect.any(Blob), 'avatar.png')
  })

  it('soft-deletes a user through the service', async () => {
    userService.delete.mockResolvedValue(undefined)

    const response = await request(app)
      .delete('/api/users/1')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'User deleted successfully' })
    expect(userService.delete).toHaveBeenCalledWith('1')
  })
})
