import express from 'express'
import helmet from 'helmet'
import { createAuthRouter } from '@/routes/user/auth.routes'
import { AppDependencies } from './types/dependencies/dependencies.type'
import { corsMiddleware } from './middlewares/cors'

export const createApp = ({ authModel }: AppDependencies) => {
  const app = express()

  app.use(express.json())
  app.use(helmet())
  app.use(corsMiddleware())

  app.use('/api/auth', createAuthRouter({ authModel }))
  return app
}
