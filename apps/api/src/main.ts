import Fastify from 'fastify'
import { registerPlugins } from './plugins'
import { registerRoutes } from './modules'
import { env } from './utils/env'

const app = Fastify({
  logger: {
    level: env.LOG_LEVEL,
    transport:
      env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  },
})

async function start() {
  try {
    await registerPlugins(app)
    await registerRoutes(app)

    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    app.log.info(`LoRindo API running on port ${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
