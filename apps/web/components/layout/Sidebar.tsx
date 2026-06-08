"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { href: "/dashboard",     label: "Dashboard",       section: "Principal" },
  { href: "/suscriptores",  label: "Suscriptores",    section: "Principal" },
  { href: "/planes",        label: "Planes",          section: "Configuración" },
  { href: "/modulos",       label: "Módulos",         section: "Configuración" },
  { href: "/facturacion",   label: "Facturación",     section: "Configuración" },
  { href: "/auditoria",     label: "Auditoría",       section: "Sistema", badge: "12" },
  { href: "/alertas",       label: "Alertas",         section: "Sistema", badge: "3" },
  { href: "/config",        label: "Configuración",   section: "Sistema" },
]

export function Sidebar() {
  const pathname = usePathname()
  const sections = [...new Set(NAV.map(n => n.section))]

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-[var(--border)] flex flex-col fixed top-0 left-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white text-sm font-semibold">LR</div>
        <div>
          <div className="text-sm font-semibold">LoRindo</div>
          <div className="text-xs text-[var(--text3)]">Backoffice</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {sections.map(section => (
          <div key={section}>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text3)] px-2 py-2 mt-2">{section}</div>
            {NAV.filter(n => n.section === section).map(item => {
              const active = pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                    active ? "bg-[var(--accent-lt)] text-[#3C3489] font-medium" : "text-[var(--text2)] hover:bg-[var(--surface2)]"
                  }`}>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && <span className="text-[10px] bg-[#FCEBEB] text-[#791F1F] px-1.5 py-0.5 rounded-full font-semibold">{item.badge}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--accent-lt)] text-[#3C3489] text-xs font-semibold flex items-center justify-center">MA</div>
          <div>
            <div className="text-xs font-medium">Miguel Araya</div>
            <div className="text-[11px] text-[var(--text3)]">Super admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
