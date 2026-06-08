import { FastifyInstance } from 'fastify'
import { requireAuth, requireSuperAdmin } from '../../middleware/auth'
import { SuscriptoresService } from './suscriptores.service'

export async function suscriptoresRoutes(app: FastifyInstance) {
  const svc = new SuscriptoresService(app)

  app.get('/',            { preHandler: [requireSuperAdmin] }, (req, rep) => svc.list(req, rep))
  app.post('/',           { preHandler: [requireSuperAdmin] }, (req, rep) => svc.create(req, rep))
  app.get('/:id',         { preHandler: [requireAuth] },       (req, rep) => svc.getOne(req, rep))
  app.put('/:id',         { preHandler: [requireSuperAdmin] }, (req, rep) => svc.update(req, rep))
  app.post('/:id/suspender',  { preHandler: [requireSuperAdmin] }, (req, rep) => svc.suspender(req, rep))
  app.post('/:id/reactivar',  { preHandler: [requireSuperAdmin] }, (req, rep) => svc.reactivar(req, rep))
  app.put('/:id/modulos',     { preHandler: [requireSuperAdmin] }, (req, rep) => svc.updateModulos(req, rep))
}
