import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'

export async function cuentasRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const { tipo, search } = req.query as any
    let sql = `SET search_path = "${schemaName}"; SELECT * FROM cuentas_contables WHERE 1=1`
    const params: any[] = []
    if (tipo)   { params.push(tipo);   sql += ` AND tipo = $${params.length}` }
    if (search) { params.push(`%${search}%`); sql += ` AND (codigo ILIKE $${params.length} OR nombre ILIKE $${params.length})` }
    sql += ' ORDER BY codigo ASC'
    const data = await app.prisma.$queryRawUnsafe(sql, ...params)
    return rep.send({ success: true, data })
  })

  app.post('/', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const b = req.body as any
    const data = await app.prisma.$queryRawUnsafe(
      `SET search_path = "${schemaName}";
       INSERT INTO cuentas_contables (codigo,nombre,tipo,subtipo,centro_costo,moneda,cuenta_padre,acepta_rendiciones,descripcion,es_detalle)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      b.codigo, b.nombre, b.tipo, b.subtipo, b.centroCosto,
      b.moneda || 'CLP', b.cuentaPadre, b.aceptaRendiciones ?? true, b.descripcion, b.esDetalle ?? true
    )
    return rep.status(201).send({ success: true, data })
  })

  app.put('/:id', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const { id } = req.params as { id: string }
    const b = req.body as any
    const data = await app.prisma.$queryRawUnsafe(
      `SET search_path = "${schemaName}";
       UPDATE cuentas_contables SET nombre=$2,tipo=$3,subtipo=$4,centro_costo=$5,moneda=$6,descripcion=$7,updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      id, b.nombre, b.tipo, b.subtipo, b.centroCosto, b.moneda, b.descripcion
    )
    return rep.send({ success: true, data })
  })

  app.delete('/:id', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const { id } = req.params as { id: string }
    await app.prisma.$executeRawUnsafe(`SET search_path = "${schemaName}"; UPDATE cuentas_contables SET estado='inactivo' WHERE id=$1`, id)
    return rep.send({ success: true, message: 'Cuenta desactivada' })
  })
}
