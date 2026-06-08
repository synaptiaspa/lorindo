import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'LoRindo — Backoffice',
  description: 'Sistema SaaS de gestión de rendiciones multi-tenant',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={dmSans.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
