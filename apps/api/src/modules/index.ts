import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth/auth.routes'
import { suscriptoresRoutes } from './suscriptores/suscriptores.routes'
import { empresasRoutes } from './empresas/empresas.routes'
import { usuariosRoutes } from './usuarios/usuarios.routes'
import { cuentasRoutes } from './cuentas/cuentas.routes'
import { planesRoutes } from './planes/planes.routes'
import { facturacionRoutes } from './facturacion/facturacion.routes'
import { auditoriaRoutes } from './auditoria/auditoria.routes'

export async function registerRoutes(app: FastifyInstance) {
  const prefix = '/api/v1'

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  }))

  await app.register(authRoutes,        { prefix: `${prefix}/auth` })
  await app.register(suscriptoresRoutes, { prefix: `${prefix}/suscriptores` })
  await app.register(empresasRoutes,    { prefix: `${prefix}/empresas` })
  await app.register(usuariosRoutes,    { prefix: `${prefix}/usuarios` })
  await app.register(cuentasRoutes,     { prefix: `${prefix}/cuentas` })
  await app.register(planesRoutes,      { prefix: `${prefix}/planes` })
  await app.register(facturacionRoutes, { prefix: `${prefix}/facturacion` })
  await app.register(auditoriaRoutes,   { prefix: `${prefix}/auditoria` })
}
