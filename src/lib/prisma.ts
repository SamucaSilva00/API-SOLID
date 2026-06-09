import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const url = new URL(connectionString)
  const schema = url.searchParams.get('schema') ?? undefined

  if (schema && !url.searchParams.has('options')) {
    url.searchParams.set('options', `-c search_path=${schema}`)
  }

  const adapter = new PrismaPg(
    { connectionString: url.toString() },
    schema ? { schema } : {},
  )

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'dev' ? ['query'] : [],
  })
}

export const prisma = createPrismaClient()
