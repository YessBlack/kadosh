import express, { Router } from 'express'
import helmet from 'helmet'
import { corsMiddleware } from './middlewares/cors'
import { cookieMiddleware } from './middlewares/cookies'
import { errorMiddleware } from './middlewares/error.middleware'

type AppRoute = {
  path: string
  router: Router
}

export const createApp = (...routes: AppRoute[]) => {
  const app = express()

  app.use(corsMiddleware())
  app.use(express.json())
  app.use(helmet())
  app.use(cookieMiddleware)

  routes.forEach(({ path, router }) => app.use(path, router))

  app.use(errorMiddleware)

  return app
}
