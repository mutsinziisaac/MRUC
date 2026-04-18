import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const variants: Record<string, string> = {
  operational: "bg-emerald-50 text-emerald-700 border-emerald-200",
  degraded: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-red-50 text-red-700 border-red-200",
  resolved: "bg-slate-50 text-slate-600 border-slate-200",
  pending: "bg-blue-50 text-blue-700 border-blue-200",
  unresolved: "bg-red-50 text-red-700 border-red-200",
  acknowledged: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  expired: "bg-amber-50 text-amber-700 border-amber-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
  compliant: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "non-compliant": "bg-red-50 text-red-700 border-red-200",
  "in-transit": "bg-blue-50 text-blue-700 border-blue-200",
  overstay: "bg-red-50 text-red-700 border-red-200",
  cleared: "bg-slate-50 text-slate-600 border-slate-200",
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium capitalize", variants[status] ?? "", className)}>
      {status}
    </Badge>
  )
}
