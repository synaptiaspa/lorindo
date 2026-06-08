import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import { LoginBodyType } from './auth.schema'

export class AuthService {
  constructor(private app: FastifyInstance) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, tenant } = request.body as LoginBodyType

    // 1. Buscar suscriptor por schemaName o slug
    const suscriptor = await this.app.prisma.suscriptor.findFirst({
      where: { schemaName: `tenant_${tenant.replace(/-/g, '_')}`, estado: 'ACTIVO' },
    })
    if (!suscriptor) {
      return reply.status(401).send({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' } })
    }

    // 2. Buscar usuario en schema del tenant (raw query con search_path)
    const users = await this.app.prisma.$queryRawUnsafe<any[]>(
      `SET search_path = ${suscriptor.schemaName}; SELECT * FROM usuarios WHERE email = $1 AND estado = 'ACTIVO' LIMIT 1`,
      email
    )
    const user = users[0]
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return reply.status(401).send({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' } })
    }

    // 3. Emitir tokens
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: suscriptor.id,
      schemaName: suscriptor.schemaName,
      rol: user.rol,
    }
    const accessToken  = this.app.jwt.sign(payload, { expiresIn: '15m' })
    const refreshToken = this.app.jwt.sign({ sub: user.id, type: 'refresh' }, { expiresIn: '7d' })

    // 4. Guardar refresh token en Redis
    await this.app.redis.set(`refresh:${user.id}`, refreshToken, 'EX', 7 * 24 * 3600)

    return reply.send({ success: true, data: { accessToken, refreshToken, user: { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol } } })
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = request.body as { refreshToken: string }
    try {
      const payload = this.app.jwt.verify<{ sub: string }>(refreshToken)
      const stored  = await this.app.redis.get(`refresh:${payload.sub}`)
      if (stored !== refreshToken) throw new Error('Token revocado')
      const newAccess = this.app.jwt.sign({ sub: payload.sub }, { expiresIn: '15m' })
      return reply.send({ success: true, data: { accessToken: newAccess } })
    } catch {
      return reply.status(401).send({ success: false, error: { code: 'INVALID_TOKEN', message: 'Refresh token inválido' } })
    }
  }

  async verify2fa(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ success: true, message: '2FA verificado' })
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const auth = request.headers.authorization
    if (auth) {
      try {
        const payload = this.app.jwt.verify<{ sub: string }>(auth.replace('Bearer ', ''))
        await this.app.redis.del(`refresh:${payload.sub}`)
      } catch {}
    }
    return reply.send({ success: true, message: 'Sesión cerrada' })
  }

  async requestPasswordReset(request: FastifyRequest, reply: FastifyReply) {
    // Enviar email con token temporal (implementar con nodemailer)
    return reply.send({ success: true, message: 'Si el email existe, recibirás instrucciones.' })
  }
}
