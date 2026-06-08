import { FastifyInstance } from 'fastify'
import { loginSchema, refreshSchema, totpSchema } from './auth.schema'
import { AuthService } from './auth.service'

export async function authRoutes(app: FastifyInstance) {
  const service = new AuthService(app)

  app.post('/login',        { schema: loginSchema },   (req, rep) => service.login(req, rep))
  app.post('/refresh',      { schema: refreshSchema }, (req, rep) => service.refresh(req, rep))
  app.post('/2fa/verify',   { schema: totpSchema },    (req, rep) => service.verify2fa(req, rep))
  app.post('/logout',       async (req, rep) => service.logout(req, rep))
  app.post('/password/reset', async (req, rep) => service.requestPasswordReset(req, rep))
}
