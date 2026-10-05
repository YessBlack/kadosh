import request from 'supertest'
import { createApp } from '@/app'
import { BusinessController } from '@/controllers/business/business.controller'
import { createAuthMiddleware } from '@/middlewares/auth.middleware'
import { createBusinessRouter } from '@/routes/business/business.routes'
import { ROLES } from '@/types/user/role.type'

const businessService = {
  get: jest.fn(),
  update: jest.fn(),
  updateLogo: jest.fn()
}

const authService = {
  login: jest.fn(),
  me: jest.fn(),
  changePassword: jest.fn()
}

const adminUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  name: 'Admin',
  lastname: 'User',
  isActive: true,
  role: ROLES.ADMIN
}

const app = createApp({
  path: '/api/business',
  router: createBusinessRouter({
    businessController: new BusinessController(businessService),
    authMiddleware: createAuthMiddleware(authService)
  })
})

describe('BusinessController', () => {
  const business = {
    id: 'business-1',
    name: 'Kadosh',
    nit: '900123456',
    companyType: 'SAS',
    industry: 'Retail',
    description: 'Business description',
    email: 'contact@kadosh.com',
    phone: '+573001234567',
    city: 'Bogota',
    logo: '',
    createdAt: '2026-01-01 00:00:00.000Z',
    updatedAt: '2026-01-01 00:00:00.000Z'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    authService.me.mockResolvedValue({ token: 'refreshed-token', user: adminUser })
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('rejects requests without an authenticated session', async () => {
    const response = await request(app).get('/api/business')

    expect(response.status).toBe(401)
    expect(businessService.get).not.toHaveBeenCalled()
  })

  it('restricts business management to administrators', async () => {
    authService.me.mockResolvedValue({
      token: 'refreshed-token',
      user: { ...adminUser, role: ROLES.VENDEDOR }
    })

    const response = await request(app)
      .get('/api/business')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(403)
    expect(businessService.get).not.toHaveBeenCalled()
  })

  it('returns the business for an administrator', async () => {
    businessService.get.mockResolvedValue(business)

    const response = await request(app)
      .get('/api/business')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(business)
    expect(businessService.get).toHaveBeenCalledTimes(1)
  })

  it('updates the business with valid fields', async () => {
    businessService.update.mockResolvedValue({ ...business, name: 'Kadosh Store' })

    const response = await request(app)
      .patch('/api/business/business-1')
      .set('Cookie', 'token=session-token')
      .send({ name: 'Kadosh Store' })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Kadosh Store')
    expect(businessService.update).toHaveBeenCalledWith({ name: 'Kadosh Store' })
  })

  it('rejects invalid business input without calling the service', async () => {
    const response = await request(app)
      .patch('/api/business/business-1')
      .set('Cookie', 'token=session-token')
      .send({ email: 'invalid-email' })

    expect(response.status).toBe(400)
    expect(businessService.update).not.toHaveBeenCalled()
  })

  it('requires a file when updating the business logo', async () => {
    const response = await request(app)
      .patch('/api/business/business-1/logo')
      .set('Cookie', 'token=session-token')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: 'No file provided' })
    expect(businessService.updateLogo).not.toHaveBeenCalled()
  })

  it('updates the business logo from an uploaded file', async () => {
    businessService.updateLogo.mockResolvedValue({ ...business, logo: 'logo.png' })

    const response = await request(app)
      .patch('/api/business/business-1/logo')
      .set('Cookie', 'token=session-token')
      .attach('logo', Buffer.from('logo-content'), 'logo.png')

    expect(response.status).toBe(200)
    expect(response.body.logo).toBe('logo.png')
    expect(businessService.updateLogo).toHaveBeenCalledWith('business-1', expect.any(Blob), 'logo.png')
  })
})
