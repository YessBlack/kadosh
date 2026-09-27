import cors from 'cors'

const DEFAULT_ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3001',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3000'
]
const ACCEPTED_ORIGINS = process.env.ACCEPTED_ORIGINS
  ? process.env.ACCEPTED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : DEFAULT_ACCEPTED_ORIGINS

const getLocalOriginAlias = (origin: string): string | undefined => {
  if (origin.includes('://localhost:')) return origin.replace('://localhost:', '://127.0.0.1:')
  if (origin.includes('://127.0.0.1:')) return origin.replace('://127.0.0.1:', '://localhost:')
  return undefined
}

interface CorsMiddlewareOptions {
  acceptedOrigins?: string[]
}

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS }: CorsMiddlewareOptions = {}) => cors({
  origin: (origin, callback) => {
    const normalizedOrigins = acceptedOrigins.map(acceptedOrigin => acceptedOrigin.trim().replace(/\/$/, ''))
    const localAlias = origin ? getLocalOriginAlias(origin) : undefined

    if (!origin || normalizedOrigins.includes(origin) || (localAlias !== undefined && normalizedOrigins.includes(localAlias))) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
