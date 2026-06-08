import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'

export async function empresasRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [requireAuth] }, async (req, rep) => {
    const { tenantId, schemaName } = (req as any).user
    const data = await app.prisma.$queryRawUnsafe(`SET search_path = "${schemaName}"; SELECT * FROM empresas ORDER BY created_at DESC`)
    return rep.send({ success: true, data })
  })

  app.post('/', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const b = req.body as any
    const data = await app.prisma.$queryRawUnsafe(
      `SET search_path = "${schemaName}";
       INSERT INTO empresas (nombre,rut,giro,direccion,ciudad,region,rep_nombre,rep_rut,rep_email,rep_cargo,telefono,banco,tipo_cuenta,numero_cuenta,email_banco)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      b.nombre, b.rut, b.giro, b.direccion, b.ciudad, b.region,
      b.repNombre, b.repRut, b.repEmail, b.repCargo, b.telefono,
      b.banco, b.tipoCuenta, b.numeroCuenta, b.emailBanco
    )
    return rep.status(201).send({ success: true, data })
  })

  app.get('/:id', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const { id } = req.params as { id: string }
    const data = await app.prisma.$queryRawUnsafe(`SET search_path = "${schemaName}"; SELECT * FROM empresas WHERE id = $1`, id)
    return rep.send({ success: true, data })
  })

  app.put('/:id', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const { id } = req.params as { id: string }
    const b = req.body as any
    const data = await app.prisma.$queryRawUnsafe(
      `SET search_path = "${schemaName}";
       UPDATE empresas SET nombre=$2, giro=$3, direccion=$4, ciudad=$5, region=$6, updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      id, b.nombre, b.giro, b.direccion, b.ciudad, b.region
    )
    return rep.send({ success: true, data })
  })

  app.delete('/:id', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const { id } = req.params as { id: string }
    await app.prisma.$executeRawUnsafe(`SET search_path = "${schemaName}"; UPDATE empresas SET estado='inactivo' WHERE id=$1`, id)
    return rep.send({ success: true, message: 'Empresa desactivada' })
  })
}
