import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function TrendPill({ value, className }: { value: number; className?: string }) {
  const up = value > 0
  return (
    <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
      up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700", className)}>
      {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {up && "+"}{value.toFixed(1)}%
    </span>
  )
}
