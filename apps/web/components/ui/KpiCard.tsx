interface KpiCardProps {
  label: string
  value: string
  delta: string
  deltaType: "up" | "down"
  icon: string
  color: "accent" | "blue" | "green" | "red"
}

const colorMap: Record<string, { bg: string; iconBg: string; iconColor: string }> = {
  accent: { bg: "bg-white", iconBg: "bg-[#EEEDFE]", iconColor: "text-[#4A42B0]" },
  blue:   { bg: "bg-white", iconBg: "bg-[#E6F1FB]", iconColor: "text-[#185FA5]" },
  green:  { bg: "bg-white", iconBg: "bg-[#E1F5EE]", iconColor: "text-[#1D9E75]" },
  red:    { bg: "bg-white", iconBg: "bg-[#FCEBEB]", iconColor: "text-[#A32D2D]" },
}

export function KpiCard({ label, value, delta, deltaType, color }: KpiCardProps) {
  const c = colorMap[color]
  return (
    <div className={`${c.bg} border border-[var(--border)] rounded-[10px] p-4`}>
      <div className="text-xs text-[var(--text2)] mb-2">{label}</div>
      <div className={`text-2xl font-semibold tracking-tight ${color === 'red' ? 'text-[#A32D2D]' : 'text-[var(--text)]'}`}>
        {value}
      </div>
      <div className={`text-xs mt-1 ${deltaType === 'up' ? 'text-[#1D9E75]' : 'text-[#A32D2D]'}`}>
        {deltaType === 'up' ? '↑' : '↓'} {delta}
      </div>
    </div>
  )
}
