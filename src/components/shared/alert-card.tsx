import type { Alert } from "@/lib/mock-data"
import { StatusBadge } from "./status-badge"
import { MapPin, User, Clock } from "lucide-react"

export function AlertCard({ alert, onClick }: { alert: Alert; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={alert.severity} />
            <StatusBadge status={alert.status} />
          </div>
          <h3 className="text-sm font-medium leading-snug">{alert.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="size-3" />{alert.corridor}</span>
        <span className="flex items-center gap-1"><User className="size-3" />{alert.assignedTo}</span>
        <span className="flex items-center gap-1"><Clock className="size-3" />{alert.timestamp}</span>
      </div>
    </button>
  )
}
