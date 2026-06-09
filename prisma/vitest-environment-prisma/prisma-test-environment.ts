import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaPg } from '@prisma/adapter-pg'
import type { Environment } from 'vitest/environments'
import { PrismaClient } from '../../generated/prisma/client.js'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function buildDatabaseUrl(schema: string): string {
  const baseUrl = process.env.DATABASE_URL
  if (!baseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const url = new URL(baseUrl)
  url.searchParams.set('schema', schema)
  return url.toString()
}

function createAdapter(connectionString: string) {
  const schema =
    new URL(connectionString).searchParams.get('schema') ?? undefined

  return new PrismaPg({ connectionString }, schema ? { schema } : {})
}

async function withClient<T>(
  connectionString: string,
  fn: (client: PrismaClient) => Promise<T>,
): Promise<T> {
  const client = new PrismaClient({ adapter: createAdapter(connectionString) })

  try {
    return await fn(client)
  } finally {
    await client.$disconnect()
  }
}

export default <Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',
  async setup() {
    const schema = `test_${randomUUID().replace(/-/g, '_')}`
    const originalUrl = process.env.DATABASE_URL

    if (!originalUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    const databaseUrl = buildDatabaseUrl(schema)

    await withClient(originalUrl, async (client) => {
      await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}";`)
    })

    process.env.DATABASE_URL = databaseUrl

    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: databaseUrl },
      cwd: projectRoot,
      stdio: 'pipe',
    })

    return {
      async teardown() {
        process.env.DATABASE_URL = originalUrl

        try {
          await withClient(originalUrl, async (client) => {
            await client.$executeRawUnsafe(
              `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`,
            )
          })
        } catch (error) {
          console.warn(`Failed to drop test schema ${schema}:`, error)
        }
      },
    }
  },
}
