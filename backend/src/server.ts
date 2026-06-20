import 'dotenv/config'
import { createApp } from './app'
import { createAuthRouter } from '@/routes/user/auth.routes'
import { createUserRouter } from '@/routes/user/user.routes'
import { AuthModel } from './models/user/auth.model'
import { UserModel } from '@/models/user/user.model'

const PORT = process.env.PORT ?? 3001

const authModel = new AuthModel()
const userModel = new UserModel()

const app = createApp(
  { path: '/api/auth', router: createAuthRouter({ authModel }) },
  { path: '/api/users', router: createUserRouter({ userModel }) }
)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
