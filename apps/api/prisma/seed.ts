import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Planes
  const starter = await prisma.plan.upsert({
    where: { id: 'plan-starter' },
    update: {},
    create: {
      id: 'plan-starter',
      nombre: 'Starter',
      precioMensual: 29000,
      precioAnual: 290000,
      maxUsuarios: 20,
      maxStorageGb: 5,
      modulosIds: ['rendiciones', 'usuarios', 'perfiles', 'empresas', 'reportes-basicos'],
    },
  })

  const pro = await prisma.plan.upsert({
    where: { id: 'plan-pro' },
    update: {},
    create: {
      id: 'plan-pro',
      nombre: 'Pro',
      precioMensual: 79000,
      precioAnual: 790000,
      maxUsuarios: 50,
      maxStorageGb: 10,
      modulosIds: ['rendiciones', 'usuarios', 'perfiles', 'empresas', 'reportes', 'centros-costo', 'aprobaciones', 'cuentas-contables'],
    },
  })

  const enterprise = await prisma.plan.upsert({
    where: { id: 'plan-enterprise' },
    update: {},
    create: {
      id: 'plan-enterprise',
      nombre: 'Enterprise',
      precioMensual: 199000,
      precioAnual: 1990000,
      maxUsuarios: 100,
      maxStorageGb: 20,
      modulosIds: ['rendiciones', 'usuarios', 'perfiles', 'empresas', 'reportes', 'centros-costo', 'aprobaciones', 'cuentas-contables', 'flujos', 'contabilidad', 'api-access', 'sso'],
    },
  })

  // Módulos
  const modulosDef = [
    { id: 'rendiciones',      nombre: 'Rendiciones',       version: '2.3.1', dependencias: ['usuarios'] },
    { id: 'usuarios',         nombre: 'Usuarios',          version: '1.8.4', dependencias: [] },
    { id: 'perfiles',         nombre: 'Perfiles',          version: '1.5.0', dependencias: ['usuarios'] },
    { id: 'empresas',         nombre: 'Empresas',          version: '1.2.0', dependencias: ['usuarios'] },
    { id: 'cuentas-contables',nombre: 'Cuentas contables', version: '1.3.1', dependencias: ['empresas'] },
    { id: 'centros-costo',    nombre: 'Centros de costo',  version: '1.2.0', dependencias: ['usuarios'] },
    { id: 'aprobaciones',     nombre: 'Aprobaciones',      version: '2.1.3', dependencias: ['rendiciones', 'perfiles'] },
    { id: 'flujos',           nombre: 'Flujos',            version: '1.0.4', dependencias: ['aprobaciones'] },
    { id: 'reportes',         nombre: 'Reportes',          version: '3.0.2', dependencias: ['rendiciones'] },
    { id: 'contabilidad',     nombre: 'Contabilidad',      version: '1.1.2', dependencias: ['cuentas-contables'] },
  ]

  for (const m of modulosDef) {
    await prisma.modulo.upsert({
      where: { id: m.id },
      update: {},
      create: m,
    })
  }

  // Suscriptor demo (LoRindo admin)
  await prisma.suscriptor.upsert({
    where: { rut: '76.000.000-0' },
    update: {},
    create: {
      id: 'sub-lorindo-admin',
      nombre: 'LoRindo Admin',
      rut: '76.000.000-0',
      rubro: 'Tecnología',
      planId: enterprise.id,
      estado: 'ACTIVO',
      schemaName: 'tenant_lorindo_admin',
      modulosActivos: modulosDef.map(m => m.id),
      fechaExpiracion: new Date('2099-12-31'),
    },
  })

  console.log('✅ Seed completado')
  console.log('👤 Super Admin: admin@lorindo.cl / Lorindo2026!')
  console.log('⚠️  Cambia la contraseña inmediatamente después del primer login.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
