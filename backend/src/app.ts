import express from 'express'
import helmet from 'helmet'
import { createAuthRouter } from '@/routes/user/auth.routes'
import { AppDependencies } from './types/dependencies/dependencies.type'
import { corsMiddleware } from './middlewares/cors'
import { cookieMiddleware } from './middlewares/cookies'

export const createApp = ({ authModel }: AppDependencies) => {
  const app = express()

  app.use(corsMiddleware())
  app.use(express.json())
  app.use(helmet())
  app.use(cookieMiddleware)

  app.use('/api/auth', createAuthRouter({ authModel }))
  return app
}
