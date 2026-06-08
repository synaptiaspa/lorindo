import { FastifyRequest, FastifyReply } from 'fastify'

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Token inválido o expirado' } })
  }
}

export async function requireSuperAdmin(request: FastifyRequest, reply: FastifyReply) {
  await requireAuth(request, reply)
  const user = (request as any).user
  if (user?.rol !== 'SUPER_ADMIN') {
    return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Acceso denegado' } })
  }
}
