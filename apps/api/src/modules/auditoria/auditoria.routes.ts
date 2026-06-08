import { FastifyInstance } from 'fastify'
import { requireSuperAdmin } from '../../middleware/auth'

export async function auditoriaRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [requireSuperAdmin] }, async (req, rep) => {
    const { page = '1', limit = '50', suscriptorId, accion } = req.query as any
    const skip = (Number(page) - 1) * Number(limit)
    const where: any = {}
    if (suscriptorId) where.suscriptorId = suscriptorId
    if (accion) where.accion = { contains: accion }
    const [data, total] = await Promise.all([
      app.prisma.auditoria.findMany({ where, skip, take: Number(limit), include: { suscriptor: { select: { nombre: true } } }, orderBy: { createdAt: 'desc' } }),
      app.prisma.auditoria.count({ where }),
    ])
    return rep.send({ success: true, data, meta: { total } })
  })
}
