
const requireEnv = (key: string): string => {
  const value = process.env[key]

  if (!value) throw new Error(`${key} environment variable is required`)

  return value
}

export const POCKETBASE_URL = requireEnv('POCKETBASE_URL')
export const PORT = process.env.PORT ?? '3001'
