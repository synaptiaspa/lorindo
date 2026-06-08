import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ok, paginated, created } from '../../utils/response'

const CreateBody = z.object({
  nombre:      z.string().min(2),
  rut:         z.string().min(8),
  rubro:       z.string().optional(),
  planId:      z.string().uuid(),
  adminEmail:  z.string().email(),
  adminNombre: z.string().min(2),
})

export class SuscriptoresService {
  constructor(private app: FastifyInstance) {}

  async list(req: FastifyRequest, rep: FastifyReply) {
    const { page = '1', limit = '20', estado, search } = req.query as any
    const skip = (Number(page) - 1) * Number(limit)
    const where: any = {}
    if (estado) where.estado = estado
    if (search) where.OR = [
      { nombre: { contains: search, mode: 'insensitive' } },
      { rut: { contains: search } },
    ]
    const [data, total] = await Promise.all([
      this.app.prisma.suscriptor.findMany({ where, skip, take: Number(limit), include: { plan: true }, orderBy: { createdAt: 'desc' } }),
      this.app.prisma.suscriptor.count({ where }),
    ])
    return rep.send(paginated(data, total, Number(page), Number(limit)))
  }

  async create(req: FastifyRequest, rep: FastifyReply) {
    const body = CreateBody.parse(req.body)
    const schemaName = `tenant_${body.rut.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`

    // Crear suscriptor en tabla global
    const suscriptor = await this.app.prisma.suscriptor.create({
      data: {
        nombre: body.nombre,
        rut: body.rut,
        rubro: body.rubro,
        planId: body.planId,
        schemaName,
        estado: 'TRIAL',
        fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    // Provisionar schema PostgreSQL para el tenant
    await this.app.prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)
    await this.provisionTenantSchema(schemaName)

    // TODO: Enviar email de invitación al adminEmail
    return rep.status(201).send(created(suscriptor))
  }

  private async provisionTenantSchema(schemaName: string) {
    const sql = `
      SET search_path = "${schemaName}";
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(120) NOT NULL,
        apellido VARCHAR(120) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        rol VARCHAR(60) NOT NULL DEFAULT 'rendidor',
        totp_secret VARCHAR(255),
        totp_activo BOOLEAN DEFAULT false,
        estado VARCHAR(20) DEFAULT 'activo',
        empresa_id UUID,
        ultimo_acceso TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS empresas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(255) NOT NULL,
        rut VARCHAR(20) UNIQUE NOT NULL,
        giro TEXT,
        direccion TEXT,
        ciudad VARCHAR(100),
        region VARCHAR(100),
        rep_nombre VARCHAR(255),
        rep_rut VARCHAR(20),
        rep_email VARCHAR(255),
        rep_cargo VARCHAR(120),
        telefono VARCHAR(30),
        logo_url TEXT,
        banco VARCHAR(100),
        tipo_cuenta VARCHAR(60),
        numero_cuenta VARCHAR(50),
        email_banco VARCHAR(255),
        estado VARCHAR(20) DEFAULT 'activo',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS cuentas_contables (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        codigo VARCHAR(50) UNIQUE NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        tipo VARCHAR(30) NOT NULL,
        subtipo VARCHAR(30),
        centro_costo VARCHAR(100),
        moneda VARCHAR(10) DEFAULT 'CLP',
        cuenta_padre VARCHAR(50),
        acepta_rendiciones BOOLEAN DEFAULT true,
        descripcion TEXT,
        es_detalle BOOLEAN DEFAULT true,
        estado VARCHAR(20) DEFAULT 'activo',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS perfiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(120) NOT NULL,
        descripcion TEXT,
        permisos JSONB DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS flujos_aprobacion (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(255) NOT NULL,
        monto_minimo DECIMAL(14,2) DEFAULT 0,
        monto_maximo DECIMAL(14,2),
        empresa_id UUID,
        tipo_rendicion VARCHAR(60),
        niveles JSONB DEFAULT '[]',
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    await this.app.prisma.$executeRawUnsafe(sql)
  }

  async getOne(req: FastifyRequest, rep: FastifyReply) {
    const { id } = req.params as { id: string }
    const data = await this.app.prisma.suscriptor.findUniqueOrThrow({ where: { id }, include: { plan: true } })
    return rep.send(ok(data))
  }

  async update(req: FastifyRequest, rep: FastifyReply) {
    const { id } = req.params as { id: string }
    const data = await this.app.prisma.suscriptor.update({ where: { id }, data: req.body as any })
    return rep.send(ok(data))
  }

  async suspender(req: FastifyRequest, rep: FastifyReply) {
    const { id } = req.params as { id: string }
    const data = await this.app.prisma.suscriptor.update({ where: { id }, data: { estado: 'SUSPENDIDO' } })
    return rep.send(ok(data))
  }

  async reactivar(req: FastifyRequest, rep: FastifyReply) {
    const { id } = req.params as { id: string }
    const data = await this.app.prisma.suscriptor.update({ where: { id }, data: { estado: 'ACTIVO' } })
    return rep.send(ok(data))
  }

  async updateModulos(req: FastifyRequest, rep: FastifyReply) {
    const { id } = req.params as { id: string }
    const { modulosActivos } = req.body as { modulosActivos: string[] }
    const data = await this.app.prisma.suscriptor.update({ where: { id }, data: { modulosActivos } })
    return rep.send(ok(data))
  }
}
