// Shared TypeScript types across apps

export type EstadoSuscriptor = 'TRIAL' | 'ACTIVO' | 'SUSPENDIDO' | 'CANCELADO'
export type EstadoFactura    = 'PENDIENTE' | 'PAGADO' | 'VENCIDO' | 'ANULADO'
export type TipoCuenta       = 'activo' | 'pasivo' | 'patrimonio' | 'ingreso' | 'gasto' | 'costo'

export interface Suscriptor {
  id: string
  nombre: string
  rut: string
  rubro?: string
  planId: string
  plan?: Plan
  estado: EstadoSuscriptor
  schemaName: string
  fechaInicio: string
  fechaExpiracion?: string
  createdAt: string
}

export interface Plan {
  id: string
  nombre: string
  precioMensual: number
  precioAnual?: number
  maxUsuarios: number
  maxStorageGb: number
  modulosIds: string[]
}

export interface Empresa {
  id: string
  nombre: string
  rut: string
  giro?: string
  direccion?: string
  ciudad?: string
  region?: string
  repNombre?: string
  repRut?: string
  repEmail?: string
  telefono?: string
  estado: string
  createdAt: string
}

export interface Usuario {
  id: string
  nombre: string
  apellido: string
  email: string
  rol: string
  totpActivo: boolean
  estado: string
  empresaId?: string
  ultimoAcceso?: string
}

export interface CuentaContable {
  id: string
  codigo: string
  nombre: string
  tipo: TipoCuenta
  subtipo?: string
  centroCosto?: string
  moneda: string
  cuentaPadre?: string
  aceptaRendiciones: boolean
  descripcion?: string
  esDetalle: boolean
  estado: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
