import request from 'supertest'
import { createApp } from '@/app'

const mockAuthModel = {
  login: jest.fn(),
  logout: jest.fn(),
  me: jest.fn()
}

const app = createApp({ authModel: mockAuthModel })

describe('AuthController', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should return 200 on login successfully', async () => {
    mockAuthModel.login.mockResolvedValue({
      token: 'fake-token',
      user: { id: '123', email: 'test@test.com', name: 'Test' }
    })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: '123456789' })

    expect(res.status).toBe(200)
    expect(res.body.user).toEqual({
      id: '123',
      email: 'test@test.com',
      name: 'Test'
    })
  })

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notanemail', password: '123456789' })

    expect(res.status).toBe(400)
  })

  it('should return 400 for invalid credentials', async () => {
    mockAuthModel.login.mockRejectedValue(new Error('Login failed'))

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrong' })

    expect(res.status).toBe(400)
  })

  it('should return 200 on logout', async () => {
    const res = await request(app)
      .post('/api/auth/logout')

    expect(res.status).toBe(200)
  })
})
