const alerts = [
  { type: "danger", text: "Comercial Cienfuegos — pago vencido 15 días", time: "hace 2h" },
  { type: "warn",   text: "3 facturas próximas a vencer",                 time: "hace 5h" },
  { type: "warn",   text: "5 intentos fallidos de login — Red Digital",   time: "hace 6h" },
  { type: "info",   text: "Módulo Contabilidad v1.2 disponible",          time: "hace 1d" },
]
const typeColors: Record<string, string> = {
  danger: "bg-[#FCEBEB] text-[#A32D2D]",
  warn:   "bg-[#FAEEDA] text-[#BA7517]",
  info:   "bg-[#E6F1FB] text-[#185FA5]",
}

export function AlertList() {
  return (
    <div className="flex flex-col divide-y divide-[var(--border)]">
      {alerts.map((a, i) => (
        <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${typeColors[a.type]}`}>{a.type.toUpperCase()}</span>
          <div className="flex-1">
            <p className="text-xs font-medium">{a.text}</p>
            <p className="text-xs text-[var(--text3)]">{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
