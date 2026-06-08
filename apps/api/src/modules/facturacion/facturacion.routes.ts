import { FastifyInstance } from 'fastify'
import { requireSuperAdmin } from '../../middleware/auth'

export async function facturacionRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [requireSuperAdmin] }, async (req, rep) => {
    const { page = '1', limit = '20', estado } = req.query as any
    const skip = (Number(page) - 1) * Number(limit)
    const where = estado ? { estado } : {}
    const [data, total] = await Promise.all([
      app.prisma.factura.findMany({ where, skip, take: Number(limit), include: { suscriptor: { select: { nombre: true } } }, orderBy: { createdAt: 'desc' } }),
      app.prisma.factura.count({ where }),
    ])
    return rep.send({ success: true, data, meta: { total, page: Number(page), limit: Number(limit) } })
  })

  app.post('/generar', { preHandler: [requireSuperAdmin] }, async (req, rep) => {
    const { periodo, suscriptorIds } = req.body as any
    const suscriptores = await app.prisma.suscriptor.findMany({
      where: { id: { in: suscriptorIds }, estado: 'ACTIVO' },
      include: { plan: true },
    })
    const facturas = await Promise.all(suscriptores.map(s =>
      app.prisma.factura.create({
        data: {
          suscriptorId: s.id,
          periodo,
          monto: s.plan.precioMensual,
          estado: 'PENDIENTE',
          fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    ))
    return rep.status(201).send({ success: true, data: facturas })
  })

  app.post('/:id/pago', { preHandler: [requireSuperAdmin] }, async (req, rep) => {
    const { id } = req.params as { id: string }
    const { metodoPago } = req.body as { metodoPago: string }
    const data = await app.prisma.factura.update({
      where: { id },
      data: { estado: 'PAGADO', metodoPago, fechaPago: new Date() },
    })
    return rep.send({ success: true, data })
  })
}
