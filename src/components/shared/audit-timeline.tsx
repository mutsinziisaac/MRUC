import type { AuditEntry } from "@/lib/mock-data"
import { Settings, Bell, Shield, UserCog, Server } from "lucide-react"

const catIcons = { config: Settings, alert: Bell, policy: Shield, user: UserCog, system: Server }
const catColors = { config: "text-blue-600 bg-blue-50", alert: "text-amber-600 bg-amber-50", policy: "text-teal-600 bg-teal-50", user: "text-violet-600 bg-violet-50", system: "text-slate-600 bg-slate-50" }

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  // Group by date prefix
  const grouped = new Map<string, AuditEntry[]>()
  for (const e of entries) {
    const day = e.timestamp.split(",")[0]
    if (!grouped.has(day)) grouped.set(day, [])
    grouped.get(day)!.push(e)
  }

  return (
    <div className="space-y-4">
      {[...grouped.entries()].map(([day, items]) => (
        <div key={day}>
          <div className="mb-2 text-xs font-semibold text-muted-foreground">{day}</div>
          <div className="space-y-2 border-l-2 border-border pl-4">
            {items.map((e) => {
              const Icon = catIcons[e.category]
              const color = catColors[e.category]
              return (
                <div key={e.id} className="relative flex gap-3">
                  <div className={`absolute -left-[1.35rem] top-0.5 flex size-5 items-center justify-center rounded-full ${color}`}>
                    <Icon className="size-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium">{e.action}</div>
                    <div className="text-xs text-muted-foreground">{e.detail}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground/70">{e.actor} · {e.timestamp.split(", ")[1]}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
