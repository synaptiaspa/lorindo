"use client"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useState } from "react"

export default function SuscriptoresPage() {
  const [search, setSearch] = useState("")
  const [estado, setEstado] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["suscriptores", search, estado],
    queryFn: () => api.get(`/suscriptores?search=${search}&estado=${estado}`).then(r => r.data),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Suscriptores</h1>
        <button className="flex items-center gap-2 bg-[var(--accent)] text-white text-xs font-medium px-4 py-2 rounded-md">
          + Nuevo suscriptor
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          className="flex-1 border border-[var(--border)] rounded-md px-3 py-2 text-sm"
          placeholder="Buscar por nombre o RUT..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="border border-[var(--border)] rounded-md px-3 py-2 text-sm" value={estado} onChange={e => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="TRIAL">Trial</option>
          <option value="SUSPENDIDO">Suspendido</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--border)] rounded-[10px] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-[var(--text2)]">Cargando...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface2)] text-xs text-[var(--text2)] uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Suscriptor</th>
                <th className="text-left px-4 py-3">RUT</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((s: any) => (
                <tr key={s.id} className="border-t border-[var(--border)] hover:bg-[var(--surface2)] cursor-pointer">
                  <td className="px-4 py-3 font-medium">{s.nombre}</td>
                  <td className="px-4 py-3 text-[var(--text2)]">{s.rut}</td>
                  <td className="px-4 py-3">{s.plan?.nombre}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      s.estado === 'ACTIVO' ? 'bg-[#E1F5EE] text-[#0F6E56]' :
                      s.estado === 'TRIAL'  ? 'bg-[#FAEEDA] text-[#633806]' :
                                              'bg-[#FCEBEB] text-[#791F1F]'
                    }`}>{s.estado}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a href={`/suscriptores/${s.id}`} className="text-xs text-[var(--accent)] font-medium">Ver detalle →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
