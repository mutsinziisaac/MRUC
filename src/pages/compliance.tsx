import { ArrowUpRight, ArrowDownRight, Minus, Calendar, Filter, Sliders, ChevronRight } from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart as RArea,
  Area as RArea_Area,
  LineChart as RLine,
  Line as RLine_Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { COLORS, Legend } from "@/components/shared/chart-wrappers"
import {
  complianceTrend,
  corridorPerformance,
  violationsByType,
  enforcementPerformance,
  exemptionCategories,
  kpis,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Helpers ───────────────────────────────────────────────────────────────
function complianceTone(pct: number) {
  if (pct >= 95) return { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", bar: "bg-emerald-500", text: "text-emerald-700" }
  if (pct >= 90) return { pill: "bg-amber-50 text-amber-700 ring-amber-200",       bar: "bg-amber-500",   text: "text-amber-700" }
  return            { pill: "bg-rose-50 text-rose-700 ring-rose-200",                bar: "bg-rose-500",    text: "text-rose-700" }
}

// ─── Derived data ──────────────────────────────────────────────────────────
const totalViolations = violationsByType.reduce((s, v) => s + v.count, 0)
const totalExemptions = exemptionCategories.reduce((s, e) => s + e.count, 0)
const avgResolutionRate = Math.round(
  enforcementPerformance.reduce((s, t) => s + t.resolutionRate, 0) / enforcementPerformance.length,
)
const totalInspections = enforcementPerformance.reduce((s, t) => s + t.inspections, 0)

const sparkCompliance = [88.5, 89.2, 90.5, 89.8, 91.2, 92.4, 91.8, 90.6, 92.1, 93.0, 92.5, 91.7]
const sparkViolations = [1830, 1755, 1820, 1680, 1735, 1610, 1670, 1545, 1490]
const sparkResolution = [78.2, 79.5, 78.8, 81.2, 80.5, 82.4, 81.8, 83.5, 84.3]
const sparkCoverage = [88.5, 89.8, 87.9, 90.5, 89.2, 91.4, 90.6, 91.8, 92.1]

const violationTypes = violationsByType.map((v) => v.type)
const heatmapCorridors = corridorPerformance.slice(0, 6)
const heatmapColors = ["#e8efe6", "#c5d8c1", "#8fb591", "#5b8e6c", "#3a6e54"]
function patternScore(ci: number, vi: number): number {
  const a = (ci * 11 + vi * 7 + 13) % 19
  const b = (ci * 5 + vi * 3) % 17
  return ((a + b) % 24) / 23
}
function patternColor(s: number): string {
  if (s > 0.8) return heatmapColors[4]
  if (s > 0.6) return heatmapColors[3]
  if (s > 0.4) return heatmapColors[2]
  if (s > 0.2) return heatmapColors[1]
  return heatmapColors[0]
}

const exemptionPalette = [
  "oklch(0.32 0.07 195)",
  "oklch(0.50 0.10 195)",
  "oklch(0.72 0.06 195)",
  "oklch(0.65 0.13 75)",
  "oklch(0.85 0.01 90)",
]
const dominantExemption = [...exemptionCategories].sort((a, b) => b.count - a.count)[0]
const dominantExemptionPct = Math.round((dominantExemption.count / totalExemptions) * 100)

const suspiciousCards = [
  { title: "Exemption spike at Busega Plaza", desc: "340% increase in exemption claims over 48 hours. Pattern inconsistent with historical baseline.", severity: "critical" as const, time: "2 h ago" },
  { title: "Repeated toll evasion at Kampala CBD", desc: "Same 12 vehicle plates flagged 3+ times in 7 days. Possible organized evasion.", severity: "high" as const, time: "6 h ago" },
  { title: "Overweight detections up at Kajjansi", desc: "23% month-over-month increase. Correlates with new construction project traffic.", severity: "medium" as const, time: "1 d ago" },
  { title: "Cash reconciliation gap at Gayaza Gate", desc: "8.2% variance between vehicle count and cash receipts. Under investigation.", severity: "medium" as const, time: "1 d ago" },
]
const sevStyles: Record<string, { bar: string; pill: string }> = {
  critical: { bar: "bg-rose-600",  pill: "bg-rose-50 text-rose-700 ring-rose-200" },
  high:     { bar: "bg-amber-500", pill: "bg-amber-50 text-amber-700 ring-amber-200" },
  medium:   { bar: "bg-teal-600",  pill: "bg-teal-50 text-teal-700 ring-teal-200" },
  low:      { bar: "bg-slate-400", pill: "bg-slate-50 text-slate-700 ring-slate-200" },
}

const maxViolationCount = Math.max(...violationsByType.map((v) => v.count))

// ─── Atoms ─────────────────────────────────────────────────────────────────
const SPARK_COLOR = "oklch(0.62 0.06 195)"

function Sparkline({ data, color = SPARK_COLOR, height = 28 }: { data: number[]; color?: string; height?: number }) {
  const points = data.map((v, i) => ({ i, v }))
  const gradId = `sg-co-${color.replace(/[^a-z0-9]/gi, "")}`
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
  deltaIsGoodWhenDown?: boolean
  deltaNeutral?: boolean
}

function KpiCard({ spec }: { spec: KpiSpec }) {
  // For metrics where down is good (e.g. violations), invert the colour by passing the absolute delta with adjusted sign
  const displayDelta = spec.deltaIsGoodWhenDown ? -spec.delta : spec.delta
  return (
    <div className="flex flex-col bg-card px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{spec.label}</div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight tabular-nums">{spec.value}</span>
            {spec.unit && (
              <span className={cn(
                spec.unitInline ? "text-xs text-muted-foreground" : "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
              )}>
                {spec.unit}
              </span>
            )}
          </div>
        </div>
        <div className="h-7 w-16 shrink-0 opacity-90">
          <Sparkline data={spec.spark} height={28} />
        </div>
      </div>
      <div className="mt-1.5">
        <Delta value={displayDelta} label={spec.deltaLabel} neutral={spec.deltaNeutral} />
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
export default function Compliance() {
  const kpiCards: KpiSpec[] = [
    { label: "Compliance Rate",      value: kpis.complianceRate.toFixed(1), unit: "%", unitInline: true, spark: sparkCompliance, delta: -0.8, deltaLabel: "vs last mo." },
    { label: "Violations Detected",  value: totalViolations.toLocaleString(),                            spark: sparkViolations, delta: -5.2, deltaLabel: "vs prior period", deltaIsGoodWhenDown: true },
    { label: "Resolution Rate",      value: "84.3",                         unit: "%", unitInline: true, spark: sparkResolution, delta: 2.1,  deltaLabel: "improving" },
    { label: "Enforcement Coverage", value: "92.1",                         unit: "%", unitInline: true, spark: sparkCoverage,   delta: 1.5,  deltaLabel: "vs last mo." },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compliance & Enforcement</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Compliance trends, violation patterns, and enforcement performance
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

      {/* Compliance Trend + Exemption Usage donut */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-3" style={{ animationDelay: "0.06s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
          <CardHeader title="Compliance Rate Trend" description="Monthly compliance rate vs 95% policy target" />
          <div className="px-3 pt-4">
            <ResponsiveContainer width="100%" height={280}>
              <RLine data={complianceTrend} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#78716c" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[80, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7e5e4" }}
                  formatter={(v: number) => [`${v.toFixed(1)}%`, "Compliance"]}
                />
                <RLine_Line type="monotone" dataKey="rate" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 3, fill: COLORS.primary }} name="Compliance %" />
                <RLine_Line type="monotone" dataKey="target" stroke={COLORS.gold} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Target (95%)" />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </RLine>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Exemption Usage" description="Active exemptions by category" />
          <div className="p-5">
            <div className="grid grid-cols-[auto_1fr] items-center gap-5">
              <div className="relative h-[180px] w-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={exemptionCategories}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={56}
                      outerRadius={82}
                      paddingAngle={1.5}
                      stroke="transparent"
                      isAnimationActive={false}
                    >
                      {exemptionCategories.map((_, i) => (
                        <Cell key={i} fill={exemptionPalette[i % exemptionPalette.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold tracking-tight">{dominantExemptionPct}%</span>
                  <span className="mt-0.5 max-w-[110px] text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {dominantExemption.name}
                  </span>
                </div>
              </div>
              <ul className="space-y-2 text-xs">
                {exemptionCategories.map((c, i) => (
                  <li key={c.name} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: exemptionPalette[i % exemptionPalette.length] }} />
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="font-semibold tabular-nums text-foreground">{c.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
              Active exemptions · <span className="font-semibold text-foreground">{totalExemptions.toLocaleString()}</span>
              <span className="mx-1.5 text-muted-foreground/60">·</span>
              ~2.3% of total traffic
            </div>
          </div>
        </div>
      </section>

      {/* Violation Patterns heatmap + Violations by Type */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-2" style={{ animationDelay: "0.12s" }}>
        {/* Violation Patterns Heatmap */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Violation Patterns" description="Intensity by corridor and violation type" />
          <div className="p-5">
            <div className="grid items-center gap-1.5" style={{ gridTemplateColumns: "120px repeat(5, minmax(0, 1fr))" }}>
              <div />
              {violationTypes.map((t) => (
                <div key={t} className="truncate text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground" title={t}>
                  {t.split(" ")[0]}
                </div>
              ))}
              {heatmapCorridors.map((c, ci) => (
                <PatternRow key={c.id} name={c.name} ci={ci} types={violationTypes} />
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="font-medium uppercase tracking-wider">Intensity</span>
              <div className="flex gap-1">
                {heatmapColors.map((c, i) => (
                  <div key={i} className="h-3 w-7 rounded-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span>Low → High</span>
            </div>
          </div>
        </div>

        {/* Violations by Type bar chart */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Violations by Type" description="Counts and trend vs last period" />
          <ul className="divide-y divide-border">
            {violationsByType.map((v) => {
              const pct = (v.count / maxViolationCount) * 100
              return (
                <li key={v.type} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{v.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold tabular-nums">{v.count.toLocaleString()}</span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1",
                          v.trend < 0
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-rose-50 text-rose-700 ring-rose-200",
                        )}
                      >
                        {v.trend < 0 ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
                        {Math.abs(v.trend).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary/60" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Enforcement Teams */}
      <section className="animate-in-section" style={{ animationDelay: "0.18s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="Enforcement Team Performance"
            description="Inspections, violations found, and resolution rate"
            action={
              <span className="text-[11px] text-muted-foreground">
                {totalInspections.toLocaleString()} total inspections
              </span>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5">Team</th>
                  <th className="px-3 py-2.5 text-right">Inspections</th>
                  <th className="px-3 py-2.5 text-right">Violations</th>
                  <th className="px-5 py-2.5 text-right">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enforcementPerformance.map((t) => {
                  const tone = complianceTone(t.resolutionRate)
                  return (
                    <tr key={t.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3">
                        <div className="text-sm font-semibold">{t.name}</div>
                        <div className="text-[11px] text-muted-foreground">{t.zone} · {t.members} members</div>
                      </td>
                      <td className="px-3 py-3 text-right text-sm tabular-nums">{t.inspections.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-sm tabular-nums">{t.violations}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 tabular-nums", tone.pill)}>
                          {t.resolutionRate}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-muted/20 text-xs">
                  <td className="px-5 py-2.5 font-medium text-muted-foreground">Average</td>
                  <td className="px-3 py-2.5" />
                  <td className="px-3 py-2.5" />
                  <td className="px-5 py-2.5 text-right font-semibold tabular-nums">{avgResolutionRate}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* Suspicious Activity */}
      <section className="animate-in-section" style={{ animationDelay: "0.24s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Suspicious Activity" description="Patterns flagged for investigation" />
          <ul className="divide-y divide-border">
            {suspiciousCards.map((c, i) => {
              const s = sevStyles[c.severity]
              return (
                <li key={i}>
                  <button className="group relative flex w-full items-start justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/30">
                    <span className={cn("absolute inset-y-3 left-2 w-[3px] rounded-full", s.bar)} />
                    <div className="min-w-0 pl-3">
                      <div className="text-sm font-semibold">{c.title}</div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px]">
                        <span className={cn("rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider ring-1", s.pill)}>
                          {c.severity}
                        </span>
                        <span className="text-muted-foreground">{c.time}</span>
                      </div>
                    </div>
                    <ChevronRight className="size-4 shrink-0 self-center text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

      </section>
    </div>
  )
}

// ─── Heatmap row ───────────────────────────────────────────────────────────
function PatternRow({ name, ci, types }: { name: string; ci: number; types: string[] }) {
  return (
    <>
      <div className="truncate pr-2 text-xs font-medium text-foreground/80">{name}</div>
      {types.map((t, vi) => {
        const score = patternScore(ci, vi)
        return (
          <div
            key={t}
            className="h-5 rounded-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: patternColor(score) }}
            title={`${name} · ${t} · intensity ${(score * 100).toFixed(0)}%`}
          />
        )
      })}
    </>
  )
}
