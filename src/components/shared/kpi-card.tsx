import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  label: string
  value: string
  delta?: number
  deltaLabel?: string
  icon?: LucideIcon
  className?: string
}

export function KpiCard({ label, value, delta, deltaLabel, icon: Icon, className }: KpiCardProps) {
  const isPositive = delta !== undefined && delta > 0
  const isNegative = delta !== undefined && delta < 0
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {Icon && <Icon className="size-4 text-muted-foreground/60" />}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
      {delta !== undefined && (
        <div className="mt-1.5 flex items-center gap-1 text-xs">
          <TrendIcon className={cn("size-3", isPositive && "text-success", isNegative && "text-destructive")} />
          <span className={cn("font-medium", isPositive && "text-success", isNegative && "text-destructive")}>
            {isPositive && "+"}{delta.toFixed(1)}%
          </span>
          {deltaLabel && <span className="text-muted-foreground">{deltaLabel}</span>}
        </div>
      )}
    </div>
  )
}
