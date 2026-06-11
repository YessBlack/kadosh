import 'dotenv/config'
import { AppDependencies } from '@/types/dependencies/dependencies.type'
import { AuthModel } from './models/user/auth.model'
import { createApp } from './app'

const PORT = process.env.PORT ?? 3001

const dependencies: AppDependencies = {
  authModel: new AuthModel()
}

const app = createApp(dependencies)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
