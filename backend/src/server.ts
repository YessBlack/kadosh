import 'dotenv/config'
import { createApp } from './app'
import { createAuthRouter } from '@/routes/user/auth.routes'
import { authController, authMiddleware } from '@/container/auth.dependencies'
import { createUserRouter } from '@/routes/user/user.routes'
import { userController } from '@/container/user.dependencies'
import { createBusinessRouter } from '@/routes/business/business.routes'
import { businessController } from '@/container/business.dependencies'

const PORT = process.env.PORT ?? 3001

const app = createApp(
  { path: '/api/auth', router: createAuthRouter({ authController }) },
  { path: '/api/users', router: createUserRouter({ userController, authMiddleware }) },
  { path: '/api/business', router: createBusinessRouter({ businessController, authMiddleware }) }
)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
