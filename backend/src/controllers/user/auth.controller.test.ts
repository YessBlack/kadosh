import request from 'supertest'
import { createApp } from '@/app'
import { AuthController } from '@/controllers/user/auth.controller'
import { createAuthRouter } from '@/routes/user/auth.routes'
import { ROLES } from '@/types/user/role.type'
import { AppError } from '@/utils/app-error'

const authService = {
  login: jest.fn(),
  me: jest.fn(),
  changePassword: jest.fn()
}

const mockUser = {
  id: '123',
  email: 'test@test.com',
  name: 'Test',
  isActive: true,
  role: ROLES.ADMIN
}

const app = createApp({
  path: '/api/auth',
  router: createAuthRouter({ authController: new AuthController({ authService }) })
})

describe('AuthController', () => {
  beforeEach(() => jest.clearAllMocks())

  it('allows the loopback alias for the local frontend origin', async () => {
    const response = await request(app)
      .options('/api/auth/login')
      .set('Origin', 'http://127.0.0.1:5173')
      .set('Access-Control-Request-Method', 'POST')

    expect(response.status).toBe(204)
    expect(response.headers['access-control-allow-origin']).toBe('http://127.0.0.1:5173')
  })

  it('returns the user and an HttpOnly cookie after login', async () => {
    authService.login.mockResolvedValue({ token: 'fake-token', user: mockUser })

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockUser)
    expect(response.headers['set-cookie'][0]).toMatch(/HttpOnly/i)
    expect(authService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' })
  })

  it('rejects invalid login input without calling the service', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'short' })

    expect(response.status).toBe(400)
    expect(authService.login).not.toHaveBeenCalled()
  })

  it('maps invalid credentials to 401', async () => {
    authService.login.mockRejectedValue(new AppError('INVALID_CREDENTIALS', 'Invalid credentials'))

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' })

    expect(response.status).toBe(401)
  })

  it('denies login for inactive accounts', async () => {
    authService.login.mockRejectedValue(new AppError('ACCOUNT_INACTIVE', 'Account is inactive'))

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' })

    expect(response.status).toBe(403)
    expect(response.headers['set-cookie']).toBeUndefined()
  })

  it('requires a cookie for the current-user endpoint', async () => {
    const response = await request(app).get('/api/auth/me')

    expect(response.status).toBe(401)
    expect(authService.me).not.toHaveBeenCalled()
  })

  it('returns the current user using the session cookie', async () => {
    authService.me.mockResolvedValue({ token: 'refreshed-token', user: mockUser })

    const response = await request(app)
      .get('/api/auth/me')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockUser)
    expect(authService.me).toHaveBeenCalledWith('session-token')
  })

  it('clears the session cookie on logout', async () => {
    const response = await request(app).post('/api/auth/logout')

    expect(response.status).toBe(200)
    expect(response.headers['set-cookie'][0]).toMatch(/token=;/i)
  })
})
