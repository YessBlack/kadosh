import express from 'express'
import helmet from 'helmet'

const app = express()
const PORT = process.env.PORT || 1234

app.use(helmet())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
