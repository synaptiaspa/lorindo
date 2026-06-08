import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import IORedis from 'ioredis'
import { env } from '../utils/env'

// Prisma plugin
const prismaPlugin = fp(async (app: FastifyInstance) => {
  const prisma = new PrismaClient()
  await prisma.$connect()
  app.decorate('prisma', prisma)
  app.addHook('onClose', async () => { await prisma.$disconnect() })
})

// Redis plugin
const redisPlugin = fp(async (app: FastifyInstance) => {
  const redis = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: 3 })
  app.decorate('redis', redis)
  app.addHook('onClose', async () => { redis.disconnect() })
})

export async function registerPlugins(app: FastifyInstance) {
  await app.register(helmet, { contentSecurityPolicy: false })
  await app.register(cors, {
    origin: env.NODE_ENV === 'production'
      ? ['https://lorindo.cl', 'https://app.lorindo.cl']
      : true,
    credentials: true,
  })
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' })
  await app.register(jwt, { secret: env.JWT_SECRET, sign: { expiresIn: env.JWT_EXPIRY } })
  await app.register(prismaPlugin)
  await app.register(redisPlugin)

  app.setErrorHandler((error, _request, reply) => {
    const status = (error as any).statusCode || 500
    reply.status(status).send({
      success: false,
      error: { code: (error as any).code || 'INTERNAL_ERROR', message: error.message },
    })
  })
}
