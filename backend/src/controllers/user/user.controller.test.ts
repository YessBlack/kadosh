import request from 'supertest'
import { createApp } from '@/app'
import { createUserRouter } from '@/routes/user/user.routes'

const mockUserModel = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}

const app = createApp(
  { path: '/api/users', router: createUserRouter({ userModel: mockUserModel }) }
)

describe('UserController', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('GET /api/users/:id', () => {
    it('should return 200 with the user', async () => {
      const mockUser = { id: '1', email: 'test@test.com', name: 'John', lastname: 'Doe' }
      mockUserModel.getById.mockResolvedValue(mockUser)

      const res = await request(app).get('/api/users/1')
      expect(res.status).toBe(200)
      expect(res.body).toEqual(mockUser)
    })

    it('should return 404 if user does not exist', async () => {
      mockUserModel.getById.mockRejectedValue(new Error('User not found'))

      const res = await request(app).get('/api/users/999')
      expect(res.status).toBe(404)
    })
  })

  describe('POST /api/users', () => {
    it('should return 201 with the created user', async () => {
      const newUser = {
        email: 'test@test.com',
        password: 'password123',
        passwordConfirm: 'password123',
        name: 'John',
        lastname: 'Doe'
      }

      const createdUser = {
        id: '1',
        email: newUser.email,
        name: newUser.name,
        lastname: newUser.lastname,
        avatar: ''
      }

      mockUserModel.create.mockResolvedValue(createdUser)

      const res = await request(app).post('/api/users').send(newUser)
      expect(res.status).toBe(201)
      expect(res.body).toEqual(createdUser)
    })

    it('should return 400 for invalid input', async () => {
      const res = await request(app).post('/api/users').send({ email: 'notanemail' })
      expect(res.status).toBe(400)
    })

    it('should return 409 if user already exists', async () => {
      mockUserModel.create.mockRejectedValue(new Error('User already exists'))

      const res = await request(app)
        .post('/api/users')
        .send({ email: 'test@test.com', password: 'password123', passwordConfirm: 'password123', name: 'John', lastname: 'Doe' })
      expect(res.status).toBe(409)
    })

    it('should return 500 for server error', async () => {
      mockUserModel.create.mockRejectedValue(new Error('Server error'))

      const res = await request(app)
        .post('/api/users')
        .send({ email: 'test@test.com', password: 'password123', passwordConfirm: 'password123', name: 'John', lastname: 'Doe' })
      expect(res.status).toBe(500)
    })
  })

  describe('PATCH /api/users/:id', () => {
    it('should return 200 with the updated user', async () => {
      const updatedUser = { id: '1', email: 'test@test.com', name: 'John', lastname: 'Doe' }
      mockUserModel.update.mockResolvedValue(updatedUser)

      const res = await request(app)
        .patch('/api/users/1')
        .send({ name: 'John', lastname: 'Doe' })
      expect(res.status).toBe(200)
      expect(res.body).toEqual(updatedUser)
    })

    it('should return 400 for invalid input', async () => {
      const res = await request(app)
        .patch('/api/users/1')
        .send({ email: 'notanemail' })
      expect(res.status).toBe(400)
    })

    it('should return 404 if user does not exist', async () => {
      mockUserModel.update.mockRejectedValue(new Error('User not found'))

      const res = await request(app)
        .patch('/api/users/999')
        .send({ name: 'John', lastname: 'Doe' })
      expect(res.status).toBe(404)
    })

    it('should return 500 for server error', async () => {
      mockUserModel.update.mockRejectedValue(new Error('Server error'))

      const res = await request(app)
        .patch('/api/users/1')
        .send({ name: 'John', lastname: 'Doe' })
      expect(res.status).toBe(500)
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('should return 204 on successful deletion', async () => {
      mockUserModel.delete.mockResolvedValue(undefined)

      const res = await request(app).delete('/api/users/1')
      expect(res.status).toBe(204)
    })

    it('should return 404 if user does not exist', async () => {
      mockUserModel.delete.mockRejectedValue(new Error('User not found'))

      const res = await request(app).delete('/api/users/999')
      expect(res.status).toBe(404)
    })

    it('should return 500 for server error', async () => {
      mockUserModel.delete.mockRejectedValue(new Error('Server error'))

      const res = await request(app).delete('/api/users/1')
      expect(res.status).toBe(500)
    })
  })
})
