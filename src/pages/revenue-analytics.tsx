import { ArrowUpRight, ArrowDownRight, Minus, Calendar, Filter, Sliders, MapPin } from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart as RArea,
  Area as RArea_Area,
  BarChart as RBar,
  Bar as RBar_Bar,
  LineChart as RLine,
  Line as RLine_Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { AreaChart, Area, COLORS, Legend } from "@/components/shared/chart-wrappers"
import {
  corridorPerformance,
  revenueByStream,
  hourlyThroughput,
  forecast,
  kpis,
  fmtUGX,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Helpers ───────────────────────────────────────────────────────────────
function fmtUGXSplit(v: number): { value: string; unit: string } {
  if (v >= 1e9) return { value: `${(v / 1e9).toFixed(2)}B`, unit: "UGX" }
  if (v >= 1e6) return { value: `${(v / 1e6).toFixed(1)}M`, unit: "UGX" }
  if (v >= 1e3) return { value: `${(v / 1e3).toFixed(1)}K`, unit: "UGX" }
  return { value: v.toLocaleString(), unit: "UGX" }
}
function pctTone(pct: number) {
  if (pct >= 100) return { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", bar: "bg-emerald-600" }
  if (pct >= 90)  return { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", bar: "bg-emerald-500" }
  if (pct >= 75)  return { pill: "bg-amber-50 text-amber-700 ring-amber-200",       bar: "bg-amber-500" }
  return            { pill: "bg-rose-50 text-rose-700 ring-rose-200",                bar: "bg-rose-500" }
}

// ─── Derived data ──────────────────────────────────────────────────────────
const sparkRevenueToday = [5.4, 5.8, 5.2, 5.9, 6.1, 5.5, 6.3, 5.7, 6.0, 6.4, 5.8, 6.2, 6.5, 6.247].map((v) => v * 1_000_000)
const sparkYtd = [165, 178, 172, 188, 195, 182, 201, 192, 207, 215, 198, 187].map((v) => v * 1_000_000)
const sparkEfficiency = [91.5, 92.8, 91.2, 93.4, 92.1, 93.8, 92.5, 94.0, 93.2, 94.5, 93.6, 94.2]
const sparkLeakage = [6.4, 5.9, 6.2, 5.5, 5.8, 5.0, 5.3, 4.8]

const totalTx = hourlyThroughput.reduce((s, h) => s + h.transactions, 0)
const avgTxPerHour = Math.round(totalTx / 24)
const peakRow = hourlyThroughput.reduce((max, h) => (h.transactions > max.transactions ? h : max))
const maxTx = Math.max(...hourlyThroughput.map((h) => h.transactions))

const ranked = [...corridorPerformance].sort((a, b) => b.collected / b.target - a.collected / a.target)
const topCorridors = ranked.slice(0, 5)

const heatmapDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const heatmapCorridors = corridorPerformance.slice(0, 6)
const heatmapColors = ["#e8efe6", "#c5d8c1", "#8fb591", "#5b8e6c", "#3a6e54"]
function leakageScore(ci: number, di: number): number {
  const a = (ci * 13 + di * 7 + 11) % 23
  const b = (ci * 5 + di * 3 + 4) % 17
  return ((a + b) % 24) / 23
}
function leakageColor(s: number): string {
  if (s > 0.8) return heatmapColors[4]
  if (s > 0.6) return heatmapColors[3]
  if (s > 0.4) return heatmapColors[2]
  if (s > 0.2) return heatmapColors[1]
  return heatmapColors[0]
}

function hourBarColor(value: number): string {
  const i = value / maxTx
  if (i > 0.85) return "oklch(0.40 0.10 195)"
  if (i > 0.65) return "oklch(0.52 0.10 195)"
  if (i > 0.45) return "oklch(0.65 0.08 195)"
  return "oklch(0.78 0.05 195)"
}

// ─── Atoms ─────────────────────────────────────────────────────────────────
const SPARK_COLOR = "oklch(0.62 0.06 195)"

function Sparkline({ data, color = SPARK_COLOR, height = 36 }: { data: number[]; color?: string; height?: number }) {
  const points = data.map((v, i) => ({ i, v }))
  const gradId = `sg-ra-${color.replace(/[^a-z0-9]/gi, "")}`
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

interface KpiSpec {
  label: string
  value: string
  unit?: string
  unitInline?: boolean
  spark: number[]
  delta: number
  deltaLabel: string
  deltaNeutral?: boolean
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
          <Sparkline data={spec.spark} height={28} />
        </div>
      </div>
      <div className="mt-1.5">
        <Delta value={spec.delta} label={spec.deltaLabel} neutral={spec.deltaNeutral} />
      </div>
    </div>
  )
}

function CardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function RevenueAnalytics() {
  const today = fmtUGXSplit(kpis.revenueToday)
  const ytd = fmtUGXSplit(kpis.revenueYTD)

  const kpiCards: KpiSpec[] = [
    { label: "Revenue Today",         value: today.value, unit: today.unit, spark: sparkRevenueToday, delta: 3.2,  deltaLabel: "vs yesterday" },
    { label: "Year-to-Date",          value: ytd.value,   unit: ytd.unit,   spark: sparkYtd,          delta: 11.3, deltaLabel: "vs prior year" },
    { label: "Collection Efficiency", value: kpis.collectionEfficiency.toFixed(1), unit: "%", unitInline: true, spark: sparkEfficiency, delta: 1.4, deltaLabel: "vs target" },
    { label: "Leakage Risk",          value: "4.8",       unit: "%",        unitInline: true, spark: sparkLeakage, delta: -1.2, deltaLabel: "improving" },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Revenue Analytics</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Collections, targets, channels, and leakage risk
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HeaderButton icon={Calendar}>Apr 1 – Apr 20</HeaderButton>
            <HeaderButton icon={Filter}>Filters</HeaderButton>
            <HeaderButton icon={Sliders}>Tweaks</HeaderButton>
          </div>
        </div>
      </header>

      {/* KPI strip */}
      <section className="animate-in-section overflow-hidden rounded-xl border border-border bg-border">
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((spec) => (
            <KpiCard key={spec.label} spec={spec} />
          ))}
        </div>
      </section>

      {/* Throughput 24h + Leakage Risk heatmap */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-2" style={{ animationDelay: "0.12s" }}>
        {/* Throughput 24h */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Throughput — 24h" description="Transactions per hour (normalized)" />
          <div className="px-4 pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <RBar data={hourlyThroughput} margin={{ top: 5, right: 8, bottom: 0, left: 0 }} barCategoryGap="14%">
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10, fill: "#a8a29e" }}
                  axisLine={false}
                  tickLine={false}
                  ticks={["00:00", "06:00", "12:00", "18:00", "23:00"]}
                  tickFormatter={(v: string) => v.split(":")[0]}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7e5e4" }}
                  formatter={(value: number) => [value.toLocaleString(), "Transactions"]}
                />
                <RBar_Bar dataKey="transactions" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                  {hourlyThroughput.map((h, i) => (
                    <Cell key={i} fill={hourBarColor(h.transactions)} />
                  ))}
                </RBar_Bar>
              </RBar>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
            <Stat label="Peak Hour" value={peakRow.hour} />
            <Stat label="Avg TX / HR" value={avgTxPerHour.toLocaleString()} />
            <Stat label="Avg TX Value" value={fmtUGX(kpis.avgTransactionValue)} />
          </div>
        </div>

        {/* Leakage Risk heatmap */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Leakage Risk" description="Unexplained variance by corridor (last 7 days)" />
          <div className="p-5">
            <div className="grid items-center gap-1.5" style={{ gridTemplateColumns: "120px repeat(7, minmax(0, 1fr))" }}>
              <div />
              {heatmapDays.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {d}
                </div>
              ))}
              {heatmapCorridors.map((c, ci) => (
                <FragmentRow key={c.id} name={c.name} ci={ci} />
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="font-medium uppercase tracking-wider">Risk</span>
              <div className="flex gap-1">
                {heatmapColors.map((c, i) => (
                  <div key={i} className="h-3 w-7 rounded-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span>Low → High</span>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue by Stream */}
      <section className="animate-in-section" style={{ animationDelay: "0.18s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Revenue by Stream" description="Stacked breakdown by revenue category over the year" />
          <div className="px-3 pt-4 pb-2">
            <AreaChart data={revenueByStream} height={300}>
              <Area type="monotone" dataKey="Toll Charges" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.55} />
              <Area type="monotone" dataKey="MRUC Levy" stackId="1" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.55} />
              <Area type="monotone" dataKey="Congestion Surcharge" stackId="1" stroke={COLORS.gold} fill={COLORS.gold} fillOpacity={0.55} />
              <Area type="monotone" dataKey="Overweight Penalty" stackId="1" stroke={COLORS.slate} fill={COLORS.slate} fillOpacity={0.55} />
              <Area type="monotone" dataKey="Late Payment Fee" stackId="1" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.55} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </div>
        </div>
      </section>

      {/* Top Corridors + Forecast */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-2" style={{ animationDelay: "0.24s" }}>
        {/* Top Corridors leaderboard */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Top Revenue Corridors" description="Ranked by collection-to-target ratio" />
          <ul className="divide-y divide-border">
            {topCorridors.map((c, i) => {
              const pct = Math.round((c.collected / c.target) * 100)
              const t = pctTone(pct)
              return (
                <li key={c.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-muted-foreground">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{c.name}</div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {c.district}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold tabular-nums">{fmtUGX(c.collected)}</span>
                      <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold ring-1", t.pill)}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", t.bar)} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Forecast chart */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Month-End Forecast" description="Actual collections, projection, and target" />
          <div className="px-3 pt-4">
            <ResponsiveContainer width="100%" height={260}>
              <RLine data={forecast} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#78716c" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : String(v))}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7e5e4" }}
                  formatter={(v: number) => fmtUGX(v)}
                />
                <RLine_Line type="monotone" dataKey="actual" stroke={COLORS.primary} strokeWidth={2} dot={false} name="Actual" />
                <RLine_Line type="monotone" dataKey="projected" stroke={COLORS.gold} strokeWidth={2} strokeDasharray="6 3" dot={false} name="Projected" />
                <RLine_Line type="monotone" dataKey="target" stroke={COLORS.muted} strokeWidth={1} strokeDasharray="3 3" dot={false} name="Target" />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </RLine>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Throughput stat tile ──────────────────────────────────────────────────
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-5 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-xl font-bold tracking-tight tabular-nums">{value}</div>
    </div>
  )
}

// ─── Heatmap row ───────────────────────────────────────────────────────────
function FragmentRow({ name, ci }: { name: string; ci: number }) {
  return (
    <>
      <div className="truncate pr-2 text-xs font-medium text-foreground/80">{name}</div>
      {heatmapDays.map((d, di) => {
        const score = leakageScore(ci, di)
        return (
          <div
            key={d}
            className="h-5 rounded-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: leakageColor(score) }}
            title={`${name} · ${d} · risk ${(score * 100).toFixed(0)}%`}
          />
        )
      })}
    </>
  )
}
