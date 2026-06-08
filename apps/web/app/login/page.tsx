"use client"
import { useState } from "react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]   = useState({ email: "", password: "", tenant: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const { data } = await api.post("/auth/login", form)
      localStorage.setItem("lorindo_token",   data.data.accessToken)
      localStorage.setItem("lorindo_refresh",  data.data.refreshToken)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-sm bg-white border border-[var(--border)] rounded-[10px] p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white font-semibold">LR</div>
          <div>
            <div className="font-semibold text-base">LoRindo</div>
            <div className="text-xs text-[var(--text3)]">Backoffice</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--text2)]">Suscriptor (tenant)</label>
            <input className="border border-[var(--border)] rounded-md px-3 py-2 text-sm" placeholder="lorindo-admin" value={form.tenant} onChange={e => setForm(p => ({ ...p, tenant: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--text2)]">Email</label>
            <input type="email" className="border border-[var(--border)] rounded-md px-3 py-2 text-sm" placeholder="admin@lorindo.cl" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--text2)]">Contraseña</label>
            <input type="password" className="border border-[var(--border)] rounded-md px-3 py-2 text-sm" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          {error && <p className="text-xs text-[#A32D2D] bg-[#FCEBEB] rounded px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading} className="bg-[var(--accent)] text-white text-sm font-medium py-2 rounded-md mt-1 disabled:opacity-60">
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  )
}
