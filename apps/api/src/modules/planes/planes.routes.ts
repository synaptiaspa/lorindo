import { FastifyInstance } from 'fastify'
import { requireAuth, requireSuperAdmin } from '../../middleware/auth'

export async function planesRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [requireAuth] }, async (_req, rep) => {
    const data = await app.prisma.plan.findMany({ where: { activo: true }, orderBy: { precioMensual: 'asc' } })
    return rep.send({ success: true, data })
  })

  app.post('/', { preHandler: [requireSuperAdmin] }, async (req, rep) => {
    const b = req.body as any
    const data = await app.prisma.plan.create({ data: b })
    return rep.status(201).send({ success: true, data })
  })

  app.put('/:id', { preHandler: [requireSuperAdmin] }, async (req, rep) => {
    const { id } = req.params as { id: string }
    const data = await app.prisma.plan.update({ where: { id }, data: req.body as any })
    return rep.send({ success: true, data })
  })
}
