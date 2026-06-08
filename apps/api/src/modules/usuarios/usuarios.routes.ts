import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import bcrypt from 'bcryptjs'

export async function usuariosRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const { empresaId } = req.query as any
    let sql = `SET search_path = "${schemaName}"; SELECT id,nombre,apellido,email,rol,totp_activo,estado,empresa_id,ultimo_acceso,created_at FROM usuarios WHERE 1=1`
    const params: any[] = []
    if (empresaId) { params.push(empresaId); sql += ` AND empresa_id = $${params.length}` }
    sql += ' ORDER BY created_at DESC'
    const data = await app.prisma.$queryRawUnsafe(sql, ...params)
    return rep.send({ success: true, data })
  })

  app.post('/', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const b = req.body as any
    const hash = await bcrypt.hash(b.password || Math.random().toString(36), 12)
    const data = await app.prisma.$queryRawUnsafe(
      `SET search_path = "${schemaName}";
       INSERT INTO usuarios (nombre,apellido,email,password_hash,rol,empresa_id)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,nombre,apellido,email,rol,estado`,
      b.nombre, b.apellido, b.email, hash, b.rol || 'rendidor', b.empresaId
    )
    // TODO: Enviar email de invitación
    return rep.status(201).send({ success: true, data })
  })

  app.put('/:id', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const { id } = req.params as { id: string }
    const b = req.body as any
    const data = await app.prisma.$queryRawUnsafe(
      `SET search_path = "${schemaName}";
       UPDATE usuarios SET nombre=$2,apellido=$3,rol=$4,estado=$5,empresa_id=$6,updated_at=NOW() WHERE id=$1 RETURNING *`,
      id, b.nombre, b.apellido, b.rol, b.estado, b.empresaId
    )
    return rep.send({ success: true, data })
  })

  app.post('/:id/reset-password', { preHandler: [requireAuth] }, async (req, rep) => {
    const { schemaName } = (req as any).user
    const { id } = req.params as { id: string }
    const hash = await bcrypt.hash(Math.random().toString(36).slice(2), 12)
    await app.prisma.$executeRawUnsafe(`SET search_path = "${schemaName}"; UPDATE usuarios SET password_hash=$2 WHERE id=$1`, id, hash)
    // Invalidar sesiones Redis
    await app.redis.del(`refresh:${id}`)
    return rep.send({ success: true, message: 'Contraseña reseteada. Se enviará email al usuario.' })
  })
}
