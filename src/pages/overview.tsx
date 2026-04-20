import { useState } from "react"
import { ArrowUpRight, ArrowDownRight, Minus, Calendar, Filter, Sliders, ChevronRight } from "lucide-react"
import { ResponsiveContainer, AreaChart as RArea, Area as RArea_Area, PieChart, Pie, Cell } from "recharts"
import { AreaChart, Area, COLORS, Legend } from "@/components/shared/chart-wrappers"
import {
  kpis,
  monthlyRevenue,
  forecast,
  corridorPerformance,
  channelMix,
  alerts,
  auditTrail,
  enforcementPerformance,
  fmtUGX,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Derived data ──────────────────────────────────────────────────────────
const sparkRevenueToday = [5.4, 5.8, 5.2, 5.9, 6.1, 5.5, 6.3, 5.7, 6.0, 6.4, 5.8, 6.2, 6.5, 6.247].map((v) => v * 1_000_000)
const sparkEfficiency = [91.5, 92.8, 91.2, 93.4, 92.1, 93.8, 92.5, 94.0, 93.2, 94.5, 93.6, 94.2]
const sparkCompliance = [88.5, 89.2, 90.5, 89.8, 91.2, 92.4, 91.8, 90.6, 92.1, 93.0, 92.5, 91.7]
const sparkUptime = [99.85, 99.92, 99.78, 99.95, 99.70, 99.88, 99.93, 99.65, 99.91, 99.95, 99.82, 99.87]

const totalChannelAmount = channelMix.reduce((s, c) => s + c.amount, 0)
const dominantChannel = [...channelMix].sort((a, b) => b.value - a.value)[0]

const ytdActual = monthlyRevenue.reduce((s, m) => s + m.actual, 0)
const ytdTarget = monthlyRevenue.reduce((s, m) => s + m.target, 0)
const ytdPct = (ytdActual / ytdTarget) * 100

const visibleAlerts = alerts.filter((a) => a.status !== "resolved").slice(0, 4)

const avgResolutionRate = Math.round(
  enforcementPerformance.reduce((s, t) => s + t.resolutionRate, 0) / enforcementPerformance.length,
)
const monthEndForecast = forecast.find((f) => f.projected !== null)?.projected ?? 220_000_000

const donutPalette = [
  "oklch(0.32 0.07 195)", // dark teal
  "oklch(0.50 0.10 195)", // medium teal
  "oklch(0.72 0.06 195)", // light teal
  "oklch(0.65 0.13 75)",  // mustard
  "oklch(0.85 0.01 90)",  // light grey
]

const sevStyles: Record<string, { bar: string; pill: string }> = {
  critical: { bar: "bg-rose-600",   pill: "bg-rose-50 text-rose-700 ring-rose-200" },
  high:     { bar: "bg-amber-500",  pill: "bg-amber-50 text-amber-700 ring-amber-200" },
  medium:   { bar: "bg-teal-600",   pill: "bg-teal-50 text-teal-700 ring-teal-200" },
  low:      { bar: "bg-slate-400",  pill: "bg-slate-50 text-slate-700 ring-slate-200" },
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function fmtUGXSplit(v: number): { value: string; unit: string } {
  if (v >= 1e9) return { value: `${(v / 1e9).toFixed(2)}B`, unit: "UGX" }
  if (v >= 1e6) return { value: `${(v / 1e6).toFixed(1)}M`, unit: "UGX" }
  if (v >= 1e3) return { value: `${(v / 1e3).toFixed(0)}K`, unit: "UGX" }
  return { value: v.toLocaleString(), unit: "UGX" }
}

function timeAgo(idx: number): string {
  const presets = ["14 min ago", "38 min ago", "1 h ago", "2 h ago", "3 h ago", "5 h ago"]
  return presets[idx % presets.length]
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ─── Atoms ─────────────────────────────────────────────────────────────────
const SPARK_COLOR = "oklch(0.62 0.06 195)"

function Sparkline({ data, color = SPARK_COLOR, height = 36 }: { data: number[]; color?: string; height?: number }) {
  const points = data.map((v, i) => ({ i, v }))
  const gradId = `sg-${color.replace(/[^a-z0-9]/gi, "")}`
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RArea data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <RArea_Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.4}
          strokeOpacity={0.85}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
      </RArea>
    </ResponsiveContainer>
  )
}

function Delta({ value, label, neutral = false, suffix = "%" }: { value: number; label?: string; neutral?: boolean; suffix?: string }) {
  const Icon = neutral ? Minus : value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus
  const color = neutral ? "text-muted-foreground" : value > 0 ? "text-emerald-600" : value < 0 ? "text-rose-600" : "text-muted-foreground"
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={cn("inline-flex items-center gap-0.5 font-medium", color)}>
        <Icon className="size-3" strokeWidth={2.5} />
        {value > 0 ? "+" : ""}{value.toFixed(1)}{suffix}
      </span>
      {label && <span className="text-muted-foreground">{label}</span>}
    </div>
  )
}

function HeaderButton({ children, icon: Icon }: { children: React.ReactNode; icon?: typeof Filter }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm transition-colors hover:bg-muted/50">
      {Icon && <Icon className="size-3.5" />}
      {children}
    </button>
  )
}

// ─── KPI Card ──────────────────────────────────────────────────────────────
interface KpiSpec {
  label: string
  value: string
  unit?: string
  unitInline?: boolean
  spark: number[]
  sparkColor?: string
  delta: number
  deltaLabel: string
  deltaNeutral?: boolean
  deltaSuffix?: string
}

function KpiCard({ spec }: { spec: KpiSpec }) {
  return (
    <div className="flex flex-col bg-card px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{spec.label}</div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight tabular-nums">{spec.value}</span>
            {spec.unit && spec.unitInline && (
              <span className="text-xs text-muted-foreground">{spec.unit}</span>
            )}
            {spec.unit && !spec.unitInline && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{spec.unit}</span>
            )}
          </div>
        </div>
        <div className="h-7 w-16 shrink-0 opacity-90">
          <Sparkline data={spec.spark} color={spec.sparkColor} height={28} />
        </div>
      </div>
      <div className="mt-1.5">
        <Delta value={spec.delta} label={spec.deltaLabel} neutral={spec.deltaNeutral} suffix={spec.deltaSuffix ?? "%"} />
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Overview() {
  const [chartView, setChartView] = useState<"actual" | "forecast">("actual")

  const today = fmtUGXSplit(kpis.revenueToday)
  const ytd = fmtUGXSplit(ytdActual)
  const monthEnd = fmtUGXSplit(monthEndForecast)

  const kpiCards: KpiSpec[] = [
    { label: "Revenue Today",         value: today.value,                          unit: today.unit, spark: sparkRevenueToday, delta: 3.2,  deltaLabel: "vs yesterday" },
    { label: "Collection Efficiency", value: kpis.collectionEfficiency.toFixed(1), unit: "%", unitInline: true, spark: sparkEfficiency, delta: 1.4,  deltaLabel: "vs last mo." },
    { label: "Compliance Rate",       value: kpis.complianceRate.toFixed(1),       unit: "%", unitInline: true, spark: sparkCompliance, delta: -0.8, deltaLabel: "vs last mo." },
    { label: "System Uptime",         value: kpis.systemUptime.toFixed(2),         unit: "%", unitInline: true, spark: sparkUptime,     delta: 0.0,  deltaLabel: "30-day", deltaNeutral: true },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Executive Overview</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Real-time summary of revenue, compliance, and system health
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HeaderButton icon={Calendar}>Apr 1 – Apr 20</HeaderButton>
            <HeaderButton icon={Filter}>Filters</HeaderButton>
            <HeaderButton icon={Sliders}>Tweaks</HeaderButton>
          </div>
        </div>
      </header>

      {/* KPI strip — single bordered container with hairline dividers */}
      <section className="animate-in-section overflow-hidden rounded-xl border border-border bg-border">
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((spec) => (
            <KpiCard key={spec.label} spec={spec} />
          ))}
        </div>
      </section>

      {/* Revenue vs Target + Channel Mix */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-3" style={{ animationDelay: "0.06s" }}>
        {/* Revenue vs Target */}
        <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
          <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Revenue vs Target</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Monthly collections against municipal target (UGX, millions)</p>
            </div>
            <div className="inline-flex shrink-0 items-center rounded-md border border-border bg-muted/40 p-0.5 text-xs">
              {(["actual", "forecast"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setChartView(v)}
                  className={cn(
                    "rounded px-3 py-1 font-medium capitalize transition-colors",
                    chartView === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="px-3 pt-4">
            {chartView === "actual" ? (
              <AreaChart data={monthlyRevenue} height={300}>
                <Area type="monotone" dataKey="target" stroke={COLORS.muted} fill="transparent" strokeDasharray="4 4" name="Target" />
                <Area type="monotone" dataKey="actual" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.12} strokeWidth={2} name="Actual" />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </AreaChart>
            ) : (
              <AreaChart data={forecast} height={300}>
                <Area type="monotone" dataKey="target" stroke={COLORS.muted} fill="transparent" strokeDasharray="4 4" name="Target" />
                <Area type="monotone" dataKey="actual" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.12} strokeWidth={2} name="Actual" />
                <Area type="monotone" dataKey="projected" stroke={COLORS.gold} fill={COLORS.gold} fillOpacity={0.1} strokeDasharray="3 3" strokeWidth={2} name="Forecast" />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </AreaChart>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/20 px-5 py-3 text-xs">
            <div className="text-muted-foreground">
              Year-to-date: <span className="font-semibold text-foreground">{ytd.value} {ytd.unit}</span>
              <span className="mx-1.5 text-muted-foreground/60">·</span>
              <span className="font-medium text-foreground">{ytdPct.toFixed(1)}%</span> of target
            </div>
            <div className="text-muted-foreground/70">Source: Reconciliation engine</div>
          </div>
        </div>

        {/* Channel Mix */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold tracking-tight">Channel Mix</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Share of collections by method</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-[auto_1fr] items-center gap-5">
              {/* Donut */}
              <div className="relative h-[180px] w-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelMix}
                      dataKey="value"
                      nameKey="channel"
                      innerRadius={56}
                      outerRadius={82}
                      paddingAngle={1.5}
                      stroke="transparent"
                      isAnimationActive={false}
                    >
                      {channelMix.map((_, i) => (
                        <Cell key={i} fill={donutPalette[i % donutPalette.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold tracking-tight">{dominantChannel.value}%</span>
                  <span className="mt-0.5 max-w-[90px] text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {dominantChannel.channel}
                  </span>
                </div>
              </div>

              {/* Legend */}
              <ul className="space-y-2.5 text-sm">
                {channelMix.map((c, i) => (
                  <li key={c.channel} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className="size-2.5 shrink-0 rounded-sm"
                        style={{ backgroundColor: donutPalette[i % donutPalette.length] }}
                      />
                      <span className="truncate">{c.channel}</span>
                    </span>
                    <span className="font-semibold tabular-nums text-foreground">{c.value.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
              Total processed today · <span className="font-semibold text-foreground">{fmtUGX(totalChannelAmount)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Alerts + Recent Government Actions */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-2" style={{ animationDelay: "0.18s" }}>
        {/* Key Alerts */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Key Alerts</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Unresolved items requiring attention</p>
            </div>
            <button className="rounded-md border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm transition-colors hover:bg-muted/50">
              View all
            </button>
          </div>
          <ul className="divide-y divide-border">
            {visibleAlerts.map((a, i) => {
              const s = sevStyles[a.severity] ?? sevStyles.low
              return (
                <li key={a.id}>
                  <button className="group relative flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/30">
                    <span className={cn("absolute inset-y-3 left-2 w-[3px] rounded-full", s.bar)} />
                    <div className="min-w-0 pl-3">
                      <div className="truncate text-sm font-semibold">{a.title}</div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className={cn("rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider ring-1", s.pill)}>
                          {a.severity}
                        </span>
                        <span className="text-muted-foreground">{a.category}</span>
                        <span className="text-muted-foreground/50">·</span>
                        <span className="text-muted-foreground">{timeAgo(i)}</span>
                      </div>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Recent Government Actions */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold tracking-tight">Recent Government Actions</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Approvals, changes, and executive activity</p>
          </div>
          <ul className="space-y-4 p-5">
            {auditTrail.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <div className="mt-1 size-2.5 shrink-0 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-card" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{a.action}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {a.actor} <span className="text-muted-foreground/50">·</span> {capitalize(a.category)}{" "}
                    <span className="text-muted-foreground/50">·</span> {a.timestamp}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Effectiveness Summary */}
      <section className="animate-in-section overflow-hidden rounded-xl border border-border bg-card" style={{ animationDelay: "0.24s" }}>
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold tracking-tight">Effectiveness Summary</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">System contribution to KCCA's revenue and compliance goals</p>
        </div>
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          <SummaryStat label="Revenue Uplift"        value="+18.4%"           sub="vs pre-system baseline (2024)"        tone="positive" />
          <SummaryStat label="Leakage Reduction"     value="-6.2 pts"         sub="Est. leakage rate: 3.8%"              tone="positive" />
          <SummaryStat label={`Enforcement Coverage`} value={`${avgResolutionRate}%`} sub={`${enforcementPerformance.length} active teams · ${corridorPerformance.length} corridors`} />
          <SummaryStat label="Forecast · Month-End"  value={`${monthEnd.value} ${monthEnd.unit}`} sub={`On track · ${ytdPct.toFixed(1)}% of target`} tone="positive" />
        </div>
      </section>
    </div>
  )
}

// ─── Summary stat ──────────────────────────────────────────────────────────
function SummaryStat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: "positive" | "negative" }) {
  return (
    <div className="bg-card p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-2 text-3xl font-bold tracking-tight tabular-nums", tone === "positive" && "text-emerald-700", tone === "negative" && "text-rose-700")}>
        {value}
      </div>
      <div className="mt-1.5 text-xs text-muted-foreground">{sub}</div>
    </div>
  )
}
