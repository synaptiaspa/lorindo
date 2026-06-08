"use client"
import { usePathname } from "next/navigation"

const titles: Record<string, string> = {
  "/dashboard":    "Dashboard general",
  "/suscriptores": "Suscriptores",
  "/planes":       "Planes",
  "/modulos":      "Módulos",
  "/facturacion":  "Facturación",
  "/auditoria":    "Auditoría",
  "/alertas":      "Alertas",
  "/config":       "Configuración",
}

export function Topbar() {
  const pathname = usePathname()
  const title = Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] || "LoRindo"
  return (
    <header className="h-14 bg-white border-b border-[var(--border)] px-6 flex items-center gap-3 sticky top-0 z-40">
      <span className="flex-1 text-sm font-medium">{title}</span>
      <button className="flex items-center gap-1.5 text-xs text-[var(--text2)] border border-[var(--border)] rounded-md px-3 py-1.5">
        ↓ Exportar
      </button>
      <button className="flex items-center gap-1.5 bg-[var(--accent)] text-white text-xs font-medium px-3 py-1.5 rounded-md">
        + Nuevo suscriptor
      </button>
    </header>
  )
}
