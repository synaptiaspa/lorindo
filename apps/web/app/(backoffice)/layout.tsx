"use client"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar }  from "@/components/layout/Topbar"

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1" style={{ marginLeft: '224px' }}>
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
