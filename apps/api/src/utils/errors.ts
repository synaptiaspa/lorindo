import { FastifyError } from 'fastify'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const Errors = {
  UNAUTHORIZED:    () => new AppError(401, 'UNAUTHORIZED', 'No autorizado'),
  FORBIDDEN:       () => new AppError(403, 'FORBIDDEN', 'Acceso denegado'),
  NOT_FOUND:       (e: string) => new AppError(404, 'NOT_FOUND', `${e} no encontrado`),
  CONFLICT:        (m: string) => new AppError(409, 'CONFLICT', m),
  VALIDATION:      (m: string) => new AppError(422, 'VALIDATION_ERROR', m),
  INTERNAL:        () => new AppError(500, 'INTERNAL_ERROR', 'Error interno del servidor'),
}
