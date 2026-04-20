import { ArrowUpRight, ArrowDownRight, Minus, Calendar, Filter, Sliders, ArrowDownLeft, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart as RArea,
  Area as RArea_Area,
  BarChart as RBar,
  Bar as RBar_Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import {
  activeTrips, qrValidationLogs, geofenceEvents,
  emptyTruckDetections, sctCargoShipments, hourlyThroughput, fmtUGX,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Helpers ───────────────────────────────────────────────────────────────
const SPARK_COLOR = "oklch(0.62 0.06 195)"

function Sparkline({ data, color = SPARK_COLOR, height = 28 }: { data: number[]; color?: string; height?: number }) {
  const points = data.map((v, i) => ({ i, v }))
  const gradId = `sg-tr-${color.replace(/[^a-z0-9]/gi, "")}`
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

// ─── Derived data ──────────────────────────────────────────────────────────
const inTransit = activeTrips.filter((t) => t.status === "in-transit").length
const completed = activeTrips.filter((t) => t.status === "completed").length
const autoTerminatedCount = activeTrips.filter((t) => t.status === "auto-terminated").length
const validQR = qrValidationLogs.filter((q) => q.result === "valid").length
const qrSuccessRate = (validQR / qrValidationLogs.length) * 100

// Trip flow: hourly throughput proxy as trips/hour
const tripFlow = hourlyThroughput.map((h) => ({ ...h, hourLabel: h.hour.split(":")[0] }))
const peakFlow = tripFlow.reduce((max, h) => (h.transactions > max.transactions ? h : max))
const maxFlow = Math.max(...tripFlow.map((h) => h.transactions))

const sparkActive = [22, 26, 24, 28, 31, 27, 33, 29, 32, 30, 35, 33]
const sparkCompleted = [88, 92, 87, 95, 91, 99, 94, 102, 97, 105, 101, 108]
const sparkAuto = [12, 14, 11, 13, 15, 12, 10, 11, 9, 8, 9, 7]
const sparkQrIssues = [18, 16, 19, 14, 17, 12, 15, 11, 13, 10, 12, 9]

const autoTerminated = activeTrips.filter((t) => t.status === "auto-terminated")

const qrTone = (r: string) => {
  if (r === "valid") return { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2, color: "text-emerald-600" }
  if (r === "expired") return { pill: "bg-amber-50 text-amber-700 ring-amber-200", icon: Clock, color: "text-amber-600" }
  return { pill: "bg-rose-50 text-rose-700 ring-rose-200", icon: XCircle, color: "text-rose-600" }
}

const tripStatusTone = (s: string) => {
  if (s === "in-transit") return "bg-sky-50 text-sky-700 ring-sky-200"
  if (s === "completed") return "bg-emerald-50 text-emerald-700 ring-emerald-200"
  if (s === "auto-terminated") return "bg-rose-50 text-rose-700 ring-rose-200"
  return "bg-slate-50 text-slate-700 ring-slate-200"
}

const customsTone = (s: string) => {
  if (s === "cleared") return "bg-emerald-50 text-emerald-700 ring-emerald-200"
  if (s === "pending") return "bg-amber-50 text-amber-700 ring-amber-200"
  if (s === "flagged") return "bg-rose-50 text-rose-700 ring-rose-200"
  return "bg-slate-50 text-slate-700 ring-slate-200"
}

const chargeTone = (s: string) => {
  if (s === "charged") return "bg-emerald-50 text-emerald-700 ring-emerald-200"
  if (s === "pending") return "bg-amber-50 text-amber-700 ring-amber-200"
  return "bg-slate-50 text-slate-700 ring-slate-200"
}

function flowBarColor(value: number): string {
  const i = value / maxFlow
  if (i > 0.85) return "oklch(0.40 0.10 195)"
  if (i > 0.65) return "oklch(0.52 0.10 195)"
  if (i > 0.45) return "oklch(0.65 0.08 195)"
  return "oklch(0.78 0.05 195)"
}


// ─── Page ──────────────────────────────────────────────────────────────────
export default function Transit() {
  const kpiCards: KpiSpec[] = [
    { label: "Active Trips",     value: String(inTransit),                  spark: sparkActive,    delta: 5.2,  deltaLabel: "vs yesterday" },
    { label: "Completed Today",  value: String(completed),                  spark: sparkCompleted, delta: 2.1,  deltaLabel: "vs yesterday" },
    { label: "Auto-Terminated",  value: String(autoTerminatedCount),        spark: sparkAuto,      delta: -12.0, deltaLabel: "vs yesterday", goodWhenDown: true },
    { label: "QR Success Rate",  value: qrSuccessRate.toFixed(1), unit: "%", unitInline: true, spark: sparkQrIssues, delta: 1.8, deltaLabel: "vs last week" },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transit Management</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Live view of trips, QR validation, geofence events, and SCT cargo
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HeaderButton icon={Calendar}>18 Apr 2025</HeaderButton>
            <HeaderButton icon={Filter}>Corridors</HeaderButton>
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

      {/* Trip Flow */}
      <section className="animate-in-section" style={{ animationDelay: "0.06s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Trip Flow — 24h" description="Trips entering corridors per hour" />
          <div className="px-4 pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <RBar data={tripFlow} margin={{ top: 5, right: 8, bottom: 0, left: 0 }} barCategoryGap="14%">
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10, fill: "#a8a29e" }}
                  axisLine={false}
                  tickLine={false}
                  ticks={["00:00", "06:00", "12:00", "18:00", "23:00"]}
                  tickFormatter={(v: string) => v.split(":")[0]}
                />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7e5e4" }} formatter={(v: number) => [v.toLocaleString(), "Trips"]} />
                <RBar_Bar dataKey="transactions" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                  {tripFlow.map((h, i) => <Cell key={i} fill={flowBarColor(h.transactions)} />)}
                </RBar_Bar>
              </RBar>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
            <Stat label="Peak Hour" value={peakFlow.hour} />
            <Stat label="Peak Trips/HR" value={peakFlow.transactions.toLocaleString()} />
            <Stat label="Avg Duration" value="2h 04m" />
          </div>
        </div>
      </section>

      {/* Active Trips */}
      <section className="animate-in-section" style={{ animationDelay: "0.12s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Active Trips Today" description={`${activeTrips.length} monitored trips · live tracking`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5">Trip</th>
                  <th className="px-2 py-2.5">Plate</th>
                  <th className="px-2 py-2.5">Origin → Destination</th>
                  <th className="px-2 py-2.5">Class</th>
                  <th className="px-2 py-2.5">Status</th>
                  <th className="px-2 py-2.5">QR</th>
                  <th className="px-5 py-2.5 text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                {activeTrips.slice(0, 10).map((t) => (
                  <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-2.5 font-mono text-xs font-medium">{t.id}</td>
                    <td className="px-2 py-2.5 font-mono text-xs">{t.vehiclePlate}</td>
                    <td className="px-2 py-2.5 text-xs text-muted-foreground">
                      <span className="text-foreground">{t.origin}</span>
                      <span className="mx-1.5 text-muted-foreground/50">→</span>
                      <span className="text-foreground">{t.destination}</span>
                    </td>
                    <td className="px-2 py-2.5 text-xs">{t.vehicleClass}</td>
                    <td className="px-2 py-2.5">
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", tripStatusTone(t.status))}>
                        {t.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", qrTone(t.qrStatus).pill)}>
                        {t.qrStatus.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-right text-xs tabular-nums text-muted-foreground">{t.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* QR Validation + Geofence + Anomalies */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-3" style={{ animationDelay: "0.18s" }}>
        {/* QR Validation Log */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="QR Validation Log" description={`${qrValidationLogs.length} scans · ${qrSuccessRate.toFixed(1)}% valid`} />
          <ul className="divide-y divide-border">
            {qrValidationLogs.slice(0, 6).map((q) => {
              const t = qrTone(q.result)
              const Icon = t.icon
              return (
                <li key={q.id} className="flex items-start justify-between gap-3 px-5 py-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <Icon className={cn("mt-0.5 size-4 shrink-0", t.color)} strokeWidth={2.2} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{q.checkpoint}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="font-mono">{q.vehiclePlate}</span>
                        <span className="text-muted-foreground/50">·</span>
                        <span>{q.timestamp.split(", ")[1]}</span>
                      </div>
                    </div>
                  </div>
                  <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", t.pill)}>
                    {q.result}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Geofence Events */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Geofence Events" description="Recent zone entries and exits" />
          <ul className="divide-y divide-border">
            {geofenceEvents.slice(0, 6).map((g) => (
              <li key={g.id} className="flex items-start justify-between gap-3 px-5 py-3">
                <div className="flex items-start gap-3 min-w-0">
                  {g.eventType === "entry" ? (
                    <ArrowDownLeft className="mt-0.5 size-4 shrink-0 text-emerald-600" strokeWidth={2.2} />
                  ) : (
                    <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-sky-600" strokeWidth={2.2} />
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{g.zone}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="font-mono">{g.vehiclePlate}</span>
                      <span className="text-muted-foreground/50">·</span>
                      <span>{g.timestamp.split(", ")[1]}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g.eventType}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Auto-terminated + Empty trucks */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader title="Trip Anomalies" description="Auto-terminations and empty trucks" />
          <div className="space-y-1 px-5 pt-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Auto-Terminated</div>
            <ul className="mt-2 space-y-2">
              {autoTerminated.map((t) => (
                <li key={t.id} className="rounded-md border border-border bg-muted/20 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-medium">{t.vehiclePlate}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.duration}</span>
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {t.origin} → {t.destination}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-1 px-5 pt-5 pb-5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Empty Trucks Detected</div>
            <ul className="mt-2 space-y-2">
              {emptyTruckDetections.slice(0, 4).map((e) => (
                <li key={e.id} className="rounded-md border border-border bg-muted/20 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-medium">{e.vehiclePlate}</span>
                    <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", chargeTone(e.chargeStatus))}>
                      {e.chargeStatus}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate">{e.detectedAt}</span>
                    <span className="ml-2 shrink-0 font-medium tabular-nums text-foreground">{e.amount > 0 ? fmtUGX(e.amount) : "—"}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SCT Cargo Monitoring */}
      <section className="animate-in-section" style={{ animationDelay: "0.24s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="SCT Cargo Monitoring"
            description="Single Customs Territory cross-border shipments"
            action={
              <div className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                <AlertTriangle className="size-3.5" />
                {sctCargoShipments.filter((s) => s.customsStatus !== "cleared").length} need attention
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5">Shipment</th>
                  <th className="px-2 py-2.5">Plate</th>
                  <th className="px-2 py-2.5">Cargo</th>
                  <th className="px-2 py-2.5">Origin → Destination</th>
                  <th className="px-2 py-2.5">Entry</th>
                  <th className="px-2 py-2.5">Status</th>
                  <th className="px-5 py-2.5 text-right">Logged</th>
                </tr>
              </thead>
              <tbody>
                {sctCargoShipments.map((s) => (
                  <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-2.5 font-mono text-xs font-medium">{s.id}</td>
                    <td className="px-2 py-2.5 font-mono text-xs">{s.vehiclePlate}</td>
                    <td className="px-2 py-2.5 text-xs">{s.cargoDesc}</td>
                    <td className="px-2 py-2.5 text-xs text-muted-foreground">
                      <span className="text-foreground">{s.origin}</span>
                      <span className="mx-1.5 text-muted-foreground/50">→</span>
                      <span className="text-foreground">{s.destination}</span>
                    </td>
                    <td className="px-2 py-2.5 text-xs">{s.entryPoint}</td>
                    <td className="px-2 py-2.5">
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", customsTone(s.customsStatus))}>
                        {s.customsStatus}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-right text-xs tabular-nums text-muted-foreground">{s.timestamp.split(", ")[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-5 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-xl font-bold tracking-tight tabular-nums">{value}</div>
    </div>
  )
}
