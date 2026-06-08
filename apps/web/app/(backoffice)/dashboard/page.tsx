"use client"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { KpiCard }   from "@/components/ui/KpiCard"
import { AlertList } from "@/components/ui/AlertList"

export default function DashboardPage() {
  const { data: suscriptores } = useQuery({
    queryKey: ["suscriptores"],
    queryFn: () => api.get("/suscriptores?limit=5").then(r => r.data),
  })

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold">Dashboard general</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="Suscriptores activos" value="84"  delta="+6 este mes"  deltaType="up"   icon="store"  color="accent" />
        <KpiCard label="Usuarios totales"      value="1,247" delta="+43 este mes" deltaType="up" icon="users"  color="blue" />
        <KpiCard label="Facturación mensual"   value="$4.2M" delta="+12% vs abril" deltaType="up" icon="coin"  color="green" />
        <KpiCard label="Suspendidos"           value="5"   delta="+2 vs abril"  deltaType="down" icon="alert" color="red" />
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[var(--border)] rounded-[10px] p-5">
          <h2 className="text-sm font-medium mb-4">Suscriptores recientes</h2>
          <p className="text-xs text-[var(--text2)]">Cargando datos del servidor...</p>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-[10px] p-5">
          <h2 className="text-sm font-medium mb-4">Alertas del sistema</h2>
          <AlertList />
        </div>
      </div>
    </div>
  )
}
