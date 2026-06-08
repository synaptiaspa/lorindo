export const ok = <T>(data: T, meta?: Record<string, unknown>) => ({
  success: true, data, ...(meta && { meta }),
})
export const paginated = <T>(data: T[], total: number, page: number, limit: number) => ({
  success: true, data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
})
export const created = <T>(data: T) => ({ success: true, data })
