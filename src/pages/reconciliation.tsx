import { ArrowUpRight, ArrowDownRight, Minus, Calendar, Filter, Sliders, AlertTriangle, CheckCircle2, Clock, XCircle, Wifi } from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart as RArea,
  Area as RArea_Area,
  LineChart as RLine,
  Line as RLine_Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend as RLegend,
} from "recharts"
import {
  reconciliationRecords, remittanceLog, bankGuarantee,
  asycudaIntegrationStatus, tenYearProjection, fmtUGX, fmtPct,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Helpers ───────────────────────────────────────────────────────────────
const SPARK_COLOR = "oklch(0.62 0.06 195)"

function Sparkline({ data, color = SPARK_COLOR, height = 28 }: { data: number[]; color?: string; height?: number }) {
  const points = data.map((v, i) => ({ i, v }))
  const gradId = `sg-rc-${color.replace(/[^a-z0-9]/gi, "")}`
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RArea data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <RArea_Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.4} strokeOpacity={0.85} fill={`url(#${gradId})`} dot={false} activeDot={false} isAnimationActive={false} />
      </RArea>
    </ResponsiveContainer>
  )
}

function Delta({ value, label, neutral = false, suffix = "%", goodWhenDown = false }: { value: number; label?: string; neutral?: boolean; suffix?: string; goodWhenDown?: boolean }) {
  const Icon = neutral ? Minus : value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus
  const isGood = goodWhenDown ? value < 0 : value > 0
  const isBad = goodWhenDown ? value > 0 : value < 0
  const color = neutral ? "text-muted-foreground" : isGood ? "text-emerald-600" : isBad ? "text-rose-600" : "text-muted-foreground"
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
  goodWhenDown?: boolean
}

function KpiCard({ spec }: { spec: KpiSpec }) {
  return (
    <div className="flex flex-col bg-card px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{spec.label}</div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight tabular-nums">{spec.value}</span>
            {spec.unit && (
              <span className={cn(spec.unitInline ? "text-xs text-muted-foreground" : "text-[10px] font-medium uppercase tracking-wider text-muted-foreground")}>
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
        <Delta value={spec.delta} label={spec.deltaLabel} neutral={spec.deltaNeutral} goodWhenDown={spec.goodWhenDown} />
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

function fmtUGXSplit(v: number): { value: string; unit: string } {
  if (v >= 1e9) return { value: `${(v / 1e9).toFixed(2)}B`, unit: "UGX" }
  if (v >= 1e6) return { value: `${(v / 1e6).toFixed(1)}M`, unit: "UGX" }
  if (v >= 1e3) return { value: `${(v / 1e3).toFixed(0)}K`, unit: "UGX" }
  return { value: v.toLocaleString(), unit: "UGX" }
}

// ─── Tone helpers ──────────────────────────────────────────────────────────
const reconTone = (s: string) => {
  if (s === "matched") return { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2, color: "text-emerald-600" }
  if (s === "under-review") return { pill: "bg-amber-50 text-amber-700 ring-amber-200", icon: Clock, color: "text-amber-600" }
  return { pill: "bg-rose-50 text-rose-700 ring-rose-200", icon: XCircle, color: "text-rose-600" }
}

const remitTone = (s: string) => {
  if (s === "completed") return "bg-emerald-50 text-emerald-700 ring-emerald-200"
  if (s === "pending") return "bg-amber-50 text-amber-700 ring-amber-200"
  return "bg-rose-50 text-rose-700 ring-rose-200"
}

// ─── Derived data ──────────────────────────────────────────────────────────
const matched = reconciliationRecords.filter((r) => r.status === "matched").length
const pending = reconciliationRecords.filter((r) => r.status !== "matched").length
const reconRate = (matched / reconciliationRecords.length) * 100
const totalVariance = reconciliationRecords.reduce((s, r) => s + r.variance, 0)
const maxAbsVariance = Math.max(...reconciliationRecords.map((r) => Math.abs(r.variance)))

const todayRemitted = remittanceLog.filter((r) => r.timestamp.startsWith("18 Apr")).reduce((s, r) => s + r.amount, 0)
const utilizationPct = (bankGuarantee.utilized / bankGuarantee.amount) * 100

const sparkRemittance = [3.2, 4.1, 3.8, 4.5, 5.1, 4.6, 5.4, 4.9, 5.7, 5.2, 6.0, 5.5, 6.3, 4.5].map((v) => v * 1_000_000)
const sparkPending = [4, 3, 5, 4, 6, 3, 5, 4, 3, 4, 3, 3]
const sparkRecon = [82.5, 84.1, 83.6, 85.2, 84.8, 86.1, 85.5, 87.2, 86.8, 88.4, 87.9, 90.0]
const sparkBankUsage = [38, 41, 39, 43, 42, 45, 44, 46, 43, 44, 42, 42]

const guaranteeFreshness = (() => {
  const d = new Date("2025-12-31").getTime() - new Date("2025-04-18").getTime()
  return Math.round(d / (1000 * 60 * 60 * 24))
})()

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Reconciliation() {
  const remitted = fmtUGXSplit(todayRemitted)
  const guarantee = fmtUGXSplit(bankGuarantee.available)

  const kpiCards: KpiSpec[] = [
    { label: "Remitted Today",        value: remitted.value, unit: remitted.unit, spark: sparkRemittance, delta: 4.6, deltaLabel: "vs yesterday" },
    { label: "Pending Reconciliation", value: String(pending),                   spark: sparkPending,    delta: -1.0, deltaLabel: "open items", goodWhenDown: true },
    { label: "Reconciliation Rate",   value: reconRate.toFixed(1), unit: "%", unitInline: true, spark: sparkRecon, delta: 1.4, deltaLabel: "vs last week" },
    { label: "Bank Guarantee",        value: guarantee.value, unit: guarantee.unit, spark: sparkBankUsage, delta: 0.0, deltaLabel: `expires in ${guaranteeFreshness}d`, deltaNeutral: true },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Reconciliation</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Daily reconciliation, PPP revenue split, and integration health
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HeaderButton icon={Calendar}>Apr 1 – Apr 20</HeaderButton>
            <HeaderButton icon={Filter}>Channel</HeaderButton>
            <HeaderButton icon={Sliders}>Tweaks</HeaderButton>
          </div>
        </div>
      </header>

      {/* KPI strip */}
      <section className="animate-in-section overflow-hidden rounded-xl border border-border bg-border">
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((spec) => <KpiCard key={spec.label} spec={spec} />)}
        </div>
      </section>

      {/* Reconciliation table */}
      <section className="animate-in-section" style={{ animationDelay: "0.12s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="Daily Reconciliation"
            description={`${reconciliationRecords.length} records · ${matched} matched · ${pending} need attention`}
            action={
              <span className={cn(
                "rounded-md px-2 py-0.5 text-xs font-semibold ring-1",
                totalVariance < 0 ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200",
              )}>
                Net {fmtUGX(totalVariance)}
              </span>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5">Date</th>
                  <th className="px-2 py-2.5">Channel</th>
                  <th className="px-2 py-2.5 text-right">Expected</th>
                  <th className="px-2 py-2.5 text-right">Actual</th>
                  <th className="px-2 py-2.5">Variance</th>
                  <th className="px-5 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {reconciliationRecords.map((r) => {
                  const t = reconTone(r.status)
                  const variancePct = Math.abs(r.variance) / maxAbsVariance
                  return (
                    <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20">
                      <td className="px-5 py-2.5 text-xs font-medium">{r.date}</td>
                      <td className="px-2 py-2.5 text-xs">{r.channel}</td>
                      <td className="px-2 py-2.5 text-right text-xs tabular-nums text-muted-foreground">{fmtUGX(r.expected)}</td>
                      <td className="px-2 py-2.5 text-right text-xs tabular-nums">{fmtUGX(r.actual)}</td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="relative flex h-1.5 w-20 items-center overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn("absolute h-full rounded-full", r.variance < 0 ? "right-1/2 bg-rose-500" : "left-1/2 bg-emerald-500", r.variance === 0 && "hidden")}
                              style={{ width: `${variancePct * 50}%` }}
                            />
                            <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
                          </div>
                          <span className={cn("text-xs font-medium tabular-nums", r.variance < 0 ? "text-rose-700" : r.variance > 0 ? "text-emerald-700" : "text-muted-foreground")}>
                            {r.variance > 0 ? "+" : ""}{fmtUGX(r.variance)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", t.pill)}>
                          {r.status.replace("-", " ")}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bank Guarantee + ASYCUDA + Remittance Feed */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-3" style={{ animationDelay: "0.18s" }}>
        {/* Bank Guarantee */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Bank Guarantee" description={bankGuarantee.provider} />
          <div className="space-y-4 p-5">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Available</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">of {fmtUGX(bankGuarantee.amount)}</span>
              </div>
              <div className="mt-1 text-2xl font-bold tracking-tight tabular-nums">{fmtUGX(bankGuarantee.available)}</div>
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">Utilization</span>
                <span className="font-medium">{fmtPct(utilizationPct)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", utilizationPct > 80 ? "bg-rose-500" : utilizationPct > 50 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${utilizationPct}%` }} />
              </div>
            </div>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between"><dt className="text-muted-foreground">Utilized</dt><dd className="font-medium tabular-nums">{fmtUGX(bankGuarantee.utilized)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Expiry</dt><dd className="font-medium">{bankGuarantee.expiryDate}</dd></div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
                    {bankGuarantee.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* ASYCUDA Integration */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="ASYCUDA Integration"
            description="Customs platform sync"
            action={
              <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <Wifi className="size-3" />
                {asycudaIntegrationStatus.status}
              </div>
            }
          />
          <div className="space-y-4 p-5">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Records Processed</div>
              <div className="mt-1 text-2xl font-bold tracking-tight tabular-nums">{asycudaIntegrationStatus.recordsProcessed.toLocaleString()}</div>
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">Uptime (30d)</span>
                <span className="font-medium">{fmtPct(asycudaIntegrationStatus.uptime)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${asycudaIntegrationStatus.uptime}%` }} />
              </div>
            </div>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between"><dt className="text-muted-foreground">Last Sync</dt><dd className="font-medium">{asycudaIntegrationStatus.lastSync}</dd></div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Pending Records</dt>
                <dd className="flex items-center gap-1.5">
                  {asycudaIntegrationStatus.pendingRecords > 0 && <AlertTriangle className="size-3 text-amber-600" />}
                  <span className="font-medium tabular-nums">{asycudaIntegrationStatus.pendingRecords}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Remittance Feed */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Remittance Feed" description="Recent transfers to Treasury" />
          <ul className="divide-y divide-border">
            {remittanceLog.slice(0, 7).map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium tabular-nums">{fmtUGX(r.amount)}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="font-mono">{r.reference}</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span>{r.channel}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", remitTone(r.status))}>
                    {r.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{r.timestamp.split(", ")[0]}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10-Year Projection */}
      <section className="animate-in-section" style={{ animationDelay: "0.24s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="10-Year Revenue Projection"
            description="Long-range PPP allocation forecast (UGX, billions)"
          />
          <div className="px-3 pt-4 pb-2">
            <ResponsiveContainer width="100%" height={280}>
              <RLine data={tenYearProjection} margin={{ top: 5, right: 12, bottom: 0, left: -5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1e9).toFixed(1)}B`} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7e5e4" }} formatter={(v: number) => fmtUGX(v)} />
                <RLine_Line type="monotone" dataKey="projected" stroke="oklch(0.40 0.10 195)" strokeWidth={2.2} dot={{ r: 3 }} name="Total Projected" />
                <RLine_Line type="monotone" dataKey="municipalityShare" stroke="oklch(0.55 0.16 155)" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="5 3" name="KCCA Share" />
                <RLine_Line type="monotone" dataKey="bsmartShare" stroke="oklch(0.65 0.13 75)" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="5 3" name="BSMART Share" />
                <RLegend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </RLine>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  )
}

