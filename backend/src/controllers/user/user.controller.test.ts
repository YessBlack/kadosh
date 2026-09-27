import request from 'supertest'
import { createApp } from '@/app'
import { UserController } from '@/controllers/user/user.controller'
import { createUserRouter } from '@/routes/user/user.routes'
import { AppError } from '@/utils/app-error'

const userService = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateAvatar: jest.fn(),
  delete: jest.fn()
}

const mockUser = {
  id: '1',
  email: 'test@test.com',
  name: 'John',
  lastname: 'Doe'
}

const app = createApp({
  path: '/api/users',
  router: createUserRouter({ userController: new UserController({ userService }) })
})

describe('UserController', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns a user by id', async () => {
    userService.getById.mockResolvedValue(mockUser)

    const response = await request(app).get('/api/users/1')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockUser)
    expect(userService.getById).toHaveBeenCalledWith('1')
  })

  it('maps a missing user to 404', async () => {
    userService.getById.mockRejectedValue(new AppError('USER_NOT_FOUND', 'User not found'))

    const response = await request(app).get('/api/users/unknown')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'User not found' })
  })

  it('rejects invalid user input without calling the service', async () => {
    const response = await request(app)
      .post('/api/users')
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
      lastname: 'Doe'
    }
    userService.create.mockResolvedValue(mockUser)

    const response = await request(app).post('/api/users').send(input)

    expect(response.status).toBe(201)
    expect(response.body).toEqual(mockUser)
    expect(userService.create).toHaveBeenCalledWith({ ...input, isActive: true })
  })

  it('requires a file for avatar updates', async () => {
    const response = await request(app).patch('/api/users/1/avatar')

    expect(response.status).toBe(400)
    expect(userService.updateAvatar).not.toHaveBeenCalled()
  })

  it('soft-deletes a user through the service', async () => {
    userService.delete.mockResolvedValue(undefined)

    const response = await request(app).delete('/api/users/1')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'User deleted successfully' })
    expect(userService.delete).toHaveBeenCalledWith('1')
  })
})
