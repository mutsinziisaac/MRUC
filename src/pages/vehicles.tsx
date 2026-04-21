import { useMemo, useState } from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  Filter,
  Search,
  Download,
  Plus,
  Truck,
  Globe2,
  ShieldCheck,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart as RArea,
  Area as RArea_Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import {
  registeredVehicles,
  transporters,
  foreignVehiclesInUganda,
  activeTrips,
  qrValidationLogs,
  registrationTrend,
  VEHICLE_CLASS_BRACKET,
  TIME_REGIMES,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// ─── Helpers ────────────────────────────────────────────────────────────────
const SPARK_COLOR = "oklch(0.62 0.06 195)"

function Sparkline({ data, color = SPARK_COLOR, height = 28 }: { data: number[]; color?: string; height?: number }) {
  const points = data.map((v, i) => ({ i, v }))
  const gradId = `sg-vh-${color.replace(/[^a-z0-9]/gi, "")}`
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

function HeaderButton({ children, icon: Icon, onClick, primary }: { children: React.ReactNode; icon?: typeof Filter; onClick?: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium shadow-sm transition-colors",
        primary
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border bg-card text-foreground/80 hover:bg-muted/50"
      )}
    >
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

// ─── Tone helpers ───────────────────────────────────────────────────────────
const regStatusTone = (s: string) => {
  if (s === "active") return "bg-emerald-50 text-emerald-700 ring-emerald-200"
  if (s === "expired") return "bg-amber-50 text-amber-700 ring-amber-200"
  if (s === "suspended") return "bg-rose-50 text-rose-700 ring-rose-200"
  return "bg-slate-50 text-slate-700 ring-slate-200"
}

const complianceTone = (s: string) => {
  if (s === "compliant") return "bg-emerald-50 text-emerald-700 ring-emerald-200"
  if (s === "pending") return "bg-amber-50 text-amber-700 ring-amber-200"
  if (s === "non-compliant") return "bg-rose-50 text-rose-700 ring-rose-200"
  return "bg-slate-50 text-slate-700 ring-slate-200"
}

const foreignTone = (s: string) => {
  if (s === "in-transit") return "bg-sky-50 text-sky-700 ring-sky-200"
  if (s === "cleared") return "bg-emerald-50 text-emerald-700 ring-emerald-200"
  if (s === "overstay") return "bg-rose-50 text-rose-700 ring-rose-200"
  return "bg-slate-50 text-slate-700 ring-slate-200"
}

const qrTone = (r: string) => {
  if (r === "valid") return { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2, color: "text-emerald-600" }
  if (r === "expired") return { pill: "bg-amber-50 text-amber-700 ring-amber-200", icon: Clock, color: "text-amber-600" }
  if (r === "not-scanned") return { pill: "bg-slate-50 text-slate-700 ring-slate-200", icon: Minus, color: "text-slate-500" }
  return { pill: "bg-rose-50 text-rose-700 ring-rose-200", icon: XCircle, color: "text-rose-600" }
}

// ─── Unified vehicle type (domestic + foreign) ──────────────────────────────
type UnifiedVehicle = {
  id: string
  plate: string
  ownerName: string
  transporterName: string
  vehicleClass: "Class 1" | "Class 2" | "Class 3" | "Class 4"
  registrationStatus: "active" | "expired" | "suspended"
  compliance: "compliant" | "non-compliant" | "pending"
  countryOfOrigin: string
  lastTripDate: string
  isForeign: boolean
}

// Merge domestic + foreign entries (domestic plates seen in both lists are already in registeredVehicles)
const allVehicles: UnifiedVehicle[] = [
  ...registeredVehicles.map((v) => ({ ...v })),
  ...foreignVehiclesInUganda
    .filter((fv) => !registeredVehicles.some((rv) => rv.plate === fv.plate))
    .map((fv) => ({
      id: fv.id,
      plate: fv.plate,
      ownerName: "—",
      transporterName: "—",
      vehicleClass: fv.vehicleClass as UnifiedVehicle["vehicleClass"],
      registrationStatus: "active" as const,
      compliance: (fv.status === "overstay" ? "non-compliant" : "pending") as UnifiedVehicle["compliance"],
      countryOfOrigin: fv.country,
      lastTripDate: fv.entryDate,
      isForeign: true,
    })),
]

const CLASS_OPTIONS = ["All", "Class 1", "Class 2", "Class 3", "Class 4"] as const
type ClassFilter = (typeof CLASS_OPTIONS)[number]

// ─── Derived metrics ────────────────────────────────────────────────────────
const totalRegistered = registeredVehicles.length
const compliantCount = registeredVehicles.filter((v) => v.compliance === "compliant").length
const complianceRate = (compliantCount / totalRegistered) * 100
const activePermitsToday = activeTrips.filter((t) => t.qrStatus === "valid").length
const foreignCount = foreignVehiclesInUganda.length
const overstayCount = foreignVehiclesInUganda.filter((f) => f.status === "overstay").length

const sparkRegistrations = registrationTrend.map((r) => r.newRegistrations + r.renewals)
const sparkPermits = [96, 108, 104, 112, 118, 114, 122, 127, 121, 130, 135, 133]
const sparkCompliance = [88, 89, 91, 90, 92, 91, 93, 93, 94, 93, 94, 95]
const sparkForeign = [6, 7, 5, 8, 7, 9, 8, 10, 9, 11, 10, 12]

const classDistribution = (["Class 1", "Class 2", "Class 3", "Class 4"] as const).map((c) => ({
  label: c,
  bracket: VEHICLE_CLASS_BRACKET[c],
  count: allVehicles.filter((v) => v.vehicleClass === c).length,
}))
const classMax = Math.max(...classDistribution.map((c) => c.count), 1)

// ─── Page ───────────────────────────────────────────────────────────────────
export default function Vehicles() {
  const [query, setQuery] = useState("")
  const [classFilter, setClassFilter] = useState<ClassFilter>("All")
  const [originFilter, setOriginFilter] = useState<"all" | "domestic" | "foreign">("all")
  const [selected, setSelected] = useState<UnifiedVehicle | null>(null)
  const [registerOpen, setRegisterOpen] = useState(false)

  const filteredVehicles = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allVehicles.filter((v) => {
      if (classFilter !== "All" && v.vehicleClass !== classFilter) return false
      if (originFilter === "domestic" && v.isForeign) return false
      if (originFilter === "foreign" && !v.isForeign) return false
      if (!q) return true
      return (
        v.plate.toLowerCase().includes(q) ||
        v.ownerName.toLowerCase().includes(q) ||
        v.transporterName.toLowerCase().includes(q)
      )
    })
  }, [query, classFilter, originFilter])

  const kpiCards: KpiSpec[] = [
    { label: "Total Registered", value: String(totalRegistered), spark: sparkRegistrations, delta: 4.8, deltaLabel: "vs last month" },
    { label: "Active Permits Today", value: String(activePermitsToday), spark: sparkPermits, delta: 3.2, deltaLabel: "vs yesterday" },
    { label: "Compliance Rate", value: complianceRate.toFixed(1), unit: "%", unitInline: true, spark: sparkCompliance, delta: 1.4, deltaLabel: "vs last week" },
    { label: "Foreign Vehicles In-Country", value: String(foreignCount), spark: sparkForeign, delta: overstayCount > 0 ? 12.0 : 0, deltaLabel: `${overstayCount} overstay`, goodWhenDown: true },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicles Management</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Registry, permits, compliance and weight classification
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HeaderButton icon={Calendar}>18 Apr 2025</HeaderButton>
            <HeaderButton icon={Download}>Export</HeaderButton>
            <HeaderButton icon={Filter}>Filters</HeaderButton>
            <HeaderButton icon={Plus} primary onClick={() => setRegisterOpen(true)}>
              Register Vehicle
            </HeaderButton>
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

      {/* Registry + side cards */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-3" style={{ animationDelay: "0.06s" }}>
        {/* Registry */}
        <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
          <CardHeader
            title="Vehicle Registry"
            description={`${filteredVehicles.length} of ${allVehicles.length} vehicles`}
            action={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search plate, owner…"
                    className="h-8 w-56 rounded-md border border-border bg-background py-1.5 pl-7 pr-2 text-xs shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                </div>
              </div>
            }
          />
          {/* Class pills + origin toggle */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/20 px-5 py-2.5">
            {CLASS_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setClassFilter(c)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  classFilter === c
                    ? "bg-foreground text-background"
                    : "bg-background text-muted-foreground ring-1 ring-border hover:text-foreground"
                )}
              >
                {c === "All" ? "All classes" : c}
              </button>
            ))}
            <span className="mx-2 h-4 w-px bg-border" />
            {([
              { v: "all", label: "All origins" },
              { v: "domestic", label: "Domestic" },
              { v: "foreign", label: "Foreign" },
            ] as const).map((o) => (
              <button
                key={o.v}
                onClick={() => setOriginFilter(o.v)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  originFilter === o.v
                    ? "bg-foreground text-background"
                    : "bg-background text-muted-foreground ring-1 ring-border hover:text-foreground"
                )}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5">Plate</th>
                  <th className="px-2 py-2.5">Owner / Transporter</th>
                  <th className="px-2 py-2.5">Class · Weight</th>
                  <th className="px-2 py-2.5">Origin</th>
                  <th className="px-2 py-2.5">Reg. Status</th>
                  <th className="px-2 py-2.5">Compliance</th>
                  <th className="px-5 py-2.5 text-right">Last Trip</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-xs text-muted-foreground">
                      No vehicles match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((v) => (
                    <tr
                      key={v.id}
                      onClick={() => setSelected(v)}
                      className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-5 py-2.5 font-mono text-xs font-medium">{v.plate}</td>
                      <td className="px-2 py-2.5 text-xs">
                        <div className="font-medium">{v.ownerName}</div>
                        <div className="text-[11px] text-muted-foreground">{v.transporterName}</div>
                      </td>
                      <td className="px-2 py-2.5 text-xs">
                        <div>{v.vehicleClass}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {VEHICLE_CLASS_BRACKET[v.vehicleClass]}
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-xs">
                        <div className="flex items-center gap-1.5">
                          {v.isForeign && <Globe2 className="size-3 text-sky-600" />}
                          <span>{v.countryOfOrigin}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5">
                        <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", regStatusTone(v.registrationStatus))}>
                          {v.registrationStatus}
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", complianceTone(v.compliance))}>
                          {v.compliance.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-right text-xs tabular-nums text-muted-foreground">
                        {v.lastTripDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5">
          {/* Registration Trend */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <CardHeader title="Registration Trend" description="New + renewals per month" />
            <div className="px-4 pt-4 pb-2">
              <ResponsiveContainer width="100%" height={140}>
                <RArea data={registrationTrend} margin={{ top: 5, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="reg-new" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.1 195)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.55 0.1 195)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="reg-ren" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.70 0.12 75)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="oklch(0.70 0.12 75)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e7e5e4" }} />
                  <RArea_Area type="monotone" dataKey="newRegistrations" stroke="oklch(0.55 0.1 195)" strokeWidth={1.4} fill="url(#reg-new)" isAnimationActive={false} />
                  <RArea_Area type="monotone" dataKey="renewals" stroke="oklch(0.70 0.12 75)" strokeWidth={1.4} fill="url(#reg-ren)" isAnimationActive={false} />
                </RArea>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 border-t border-border px-5 py-2.5 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[oklch(0.55_0.1_195)]" />New</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[oklch(0.70_0.12_75)]" />Renewals</span>
            </div>
          </div>

          {/* Weight Class Distribution */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <CardHeader title="Weight Class Distribution" description="Auto-matched from registry" />
            <ul className="divide-y divide-border">
              {classDistribution.map((c) => {
                const pct = (c.count / classMax) * 100
                return (
                  <li key={c.label} className="px-5 py-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium">{c.label}</span>
                        <span className="ml-2 text-[11px] text-muted-foreground">{c.bracket}</span>
                      </div>
                      <span className="tabular-nums font-semibold">{c.count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[oklch(0.55_0.1_195)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Top transporters */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <CardHeader title="Top Transporters" description={`${transporters.length} registered fleets`} />
            <ul className="divide-y divide-border">
              {transporters.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t.name}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {t.activeVehicles}/{t.fleetSize} active · {t.country}
                    </div>
                  </div>
                  <span className={cn(
                    "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ring-1",
                    t.complianceRate >= 95 ? "bg-emerald-50 text-emerald-700 ring-emerald-200" :
                    t.complianceRate >= 90 ? "bg-sky-50 text-sky-700 ring-sky-200" :
                    "bg-amber-50 text-amber-700 ring-amber-200"
                  )}>
                    {t.complianceRate}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Foreign Vehicles panel */}
      <section className="animate-in-section" style={{ animationDelay: "0.12s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="Foreign Vehicles In-Country"
            description="Cross-border transit tracking"
            action={
              overstayCount > 0 ? (
                <div className="flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700">
                  <AlertTriangle className="size-3.5" />
                  {overstayCount} overstay
                </div>
              ) : null
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5">Plate</th>
                  <th className="px-2 py-2.5">Country</th>
                  <th className="px-2 py-2.5">Class</th>
                  <th className="px-2 py-2.5">Entry Point</th>
                  <th className="px-2 py-2.5">Entry</th>
                  <th className="px-2 py-2.5">Expected Exit</th>
                  <th className="px-5 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {foreignVehiclesInUganda.map((f) => (
                  <tr key={f.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-2.5 font-mono text-xs font-medium">{f.plate}</td>
                    <td className="px-2 py-2.5 text-xs">{f.country}</td>
                    <td className="px-2 py-2.5 text-xs">{f.vehicleClass}</td>
                    <td className="px-2 py-2.5 text-xs">{f.entryPoint}</td>
                    <td className="px-2 py-2.5 text-xs text-muted-foreground">{f.entryDate}</td>
                    <td className="px-2 py-2.5 text-xs text-muted-foreground">{f.expectedExit}</td>
                    <td className="px-5 py-2.5 text-right">
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", foreignTone(f.status))}>
                        {f.status.replace("-", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Vehicle detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && <VehicleDetail vehicle={selected} />}
        </SheetContent>
      </Sheet>

      {/* Register dialog */}
      <RegisterVehicleDialog open={registerOpen} onOpenChange={setRegisterOpen} />
    </div>
  )
}

// ─── Detail drawer ──────────────────────────────────────────────────────────
function VehicleDetail({ vehicle }: { vehicle: UnifiedVehicle }) {
  const trips = activeTrips.filter((t) => t.vehiclePlate === vehicle.plate)
  const scans = qrValidationLogs.filter((q) => q.vehiclePlate === vehicle.plate)

  return (
    <div className="flex flex-col gap-5 px-1">
      <SheetHeader className="px-4 pb-0">
        <div className="flex items-center gap-2">
          <Truck className="size-4 text-muted-foreground" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Vehicle record
          </span>
        </div>
        <SheetTitle className="font-mono text-xl">{vehicle.plate}</SheetTitle>
        <SheetDescription>
          {vehicle.vehicleClass} · {VEHICLE_CLASS_BRACKET[vehicle.vehicleClass]} · {vehicle.countryOfOrigin}
        </SheetDescription>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", regStatusTone(vehicle.registrationStatus))}>
            {vehicle.registrationStatus}
          </span>
          <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", complianceTone(vehicle.compliance))}>
            {vehicle.compliance.replace("-", " ")}
          </span>
          {vehicle.isForeign && (
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700 ring-1 ring-sky-200">
              <Globe2 className="size-3" /> foreign
            </span>
          )}
        </div>
      </SheetHeader>

      <div className="mx-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border text-xs">
        <DetailCell label="Owner" value={vehicle.ownerName} />
        <DetailCell label="Transporter" value={vehicle.transporterName} />
        <DetailCell label="Country" value={vehicle.countryOfOrigin} />
        <DetailCell label="Last trip" value={vehicle.lastTripDate} />
      </div>

      {/* Trips */}
      <div className="mx-4 overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trips & Permits</h3>
          </div>
          <span className="text-[11px] text-muted-foreground">{trips.length}</span>
        </div>
        {trips.length === 0 ? (
          <div className="px-4 py-5 text-center text-[11px] text-muted-foreground">
            No recent trips recorded.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {trips.map((t) => {
              const tone = qrTone(t.qrStatus)
              return (
                <li key={t.id} className="px-4 py-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-[11px] text-muted-foreground">{t.id}</span>
                    <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", tone.pill)}>
                      {t.qrStatus.replace("-", " ")}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-xs">
                    <span>{t.origin}</span>
                    <span className="mx-1.5 text-muted-foreground/50">→</span>
                    <span>{t.destination}</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{t.entryTime}</span>
                    <span className="tabular-nums">{t.duration}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Scans */}
      <div className="mx-4 mb-4 overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            <QrCode className="size-3.5 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent QR Scans</h3>
          </div>
          <span className="text-[11px] text-muted-foreground">{scans.length}</span>
        </div>
        {scans.length === 0 ? (
          <div className="px-4 py-5 text-center text-[11px] text-muted-foreground">
            No QR scans on record.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {scans.map((s) => {
              const tone = qrTone(s.result)
              const Icon = tone.icon
              return (
                <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="flex items-start gap-2 min-w-0">
                    <Icon className={cn("mt-0.5 size-3.5 shrink-0", tone.color)} strokeWidth={2.2} />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-medium">{s.checkpoint}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{s.timestamp}</div>
                    </div>
                  </div>
                  <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", tone.pill)}>
                    {s.result}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  )
}

// ─── Register dialog ────────────────────────────────────────────────────────
function RegisterVehicleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [plate, setPlate] = useState("")
  const [owner, setOwner] = useState("")
  const [transporter, setTransporter] = useState(transporters[0]?.name ?? "")
  const [klass, setKlass] = useState<keyof typeof VEHICLE_CLASS_BRACKET>("Class 3")
  const [country, setCountry] = useState("Uganda")
  const [regime, setRegime] = useState<(typeof TIME_REGIMES)[number]>("Day")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock-data only: no persistence. Close and reset.
    onOpenChange(false)
    setPlate("")
    setOwner("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register Vehicle</DialogTitle>
          <DialogDescription>
            Capture the vehicle's plate, owner, weight class and journey regime. Fee bracket is
            auto-matched from the weight class.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Plate number">
            <input
              required
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="e.g. UAX 123B"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-mono outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </Field>

          <Field label="Owner name">
            <input
              required
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Full name"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </Field>

          <Field label="Transporter">
            <select
              value={transporter}
              onChange={(e) => setTransporter(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <option value="Individual">Individual</option>
              {transporters.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Weight class">
              <select
                value={klass}
                onChange={(e) => setKlass(e.target.value as keyof typeof VEHICLE_CLASS_BRACKET)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {(Object.keys(VEHICLE_CLASS_BRACKET) as (keyof typeof VEHICLE_CLASS_BRACKET)[]).map((c) => (
                  <option key={c} value={c}>{c} · {VEHICLE_CLASS_BRACKET[c]}</option>
                ))}
              </select>
            </Field>

            <Field label="Time regime">
              <select
                value={regime}
                onChange={(e) => setRegime(e.target.value as (typeof TIME_REGIMES)[number])}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {TIME_REGIMES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Country of origin">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {["Uganda", "Kenya", "Tanzania", "Rwanda", "South Sudan", "DR Congo", "Burundi"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Register</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
