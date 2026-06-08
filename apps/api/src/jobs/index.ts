import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'
import { env } from '../utils/env'

const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null })

// Queues
export const emailQueue    = new Queue('emails',    { connection })
export const facturaQueue  = new Queue('facturas',  { connection })
export const webhookQueue  = new Queue('webhooks',  { connection })

// Workers
export function startWorkers() {
  // Email worker
  new Worker('emails', async (job) => {
    console.log(`[EMAIL] Sending ${job.name} to ${job.data.to}`)
    // TODO: Integrar con nodemailer + SES
  }, { connection })

  // Factura worker (cron mensual)
  new Worker('facturas', async (job) => {
    console.log(`[FACTURA] Generando facturas para periodo ${job.data.periodo}`)
    // TODO: Iterar suscriptores activos y crear facturas
  }, { connection })

  // Webhook worker
  new Worker('webhooks', async (job) => {
    const { url, payload } = job.data
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  }, { connection })

  console.log('✅ Workers de BullMQ iniciados')
}
