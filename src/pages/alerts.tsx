import { useMemo, useState } from "react"
import {
  Calendar, Filter, Sliders, MapPin, User, Clock, Lightbulb, ChevronRight, Search,
  Settings, Bell, Shield, UserCog, Server, AlertTriangle, CheckCircle2, CircleDot, Activity,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { alerts, auditTrail } from "@/lib/mock-data"
import type { Alert, AlertSeverity, AuditEntry } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Atoms ─────────────────────────────────────────────────────────────────
function HeaderButton({ children, icon: Icon }: { children: React.ReactNode; icon?: typeof Filter }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm transition-colors hover:bg-muted/50">
      {Icon && <Icon className="size-3.5" />}
      {children}
    </button>
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

interface StatSpec {
  label: string
  value: string
  sub: string
  icon?: typeof Filter
  tone?: "neutral" | "warn" | "danger" | "good"
}

const toneClasses: Record<NonNullable<StatSpec["tone"]>, string> = {
  neutral: "text-foreground",
  warn: "text-amber-700",
  danger: "text-rose-700",
  good: "text-emerald-700",
}

function MetricCard({ spec }: { spec: StatSpec }) {
  return (
    <div className="flex flex-col bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{spec.label}</div>
        {spec.icon && <spec.icon className="size-3.5 text-muted-foreground/70" />}
      </div>
      <div className={cn("mt-1 text-2xl font-bold tracking-tight tabular-nums", toneClasses[spec.tone ?? "neutral"])}>
        {spec.value}
      </div>
      <div className="mt-1.5 text-xs text-muted-foreground">{spec.sub}</div>
    </div>
  )
}

// ─── Tone helpers ──────────────────────────────────────────────────────────
const sevStyles: Record<AlertSeverity, { bar: string; pill: string; dot: string }> = {
  critical: { bar: "bg-rose-600",  pill: "bg-rose-50 text-rose-700 ring-rose-200",   dot: "bg-rose-500" },
  high:     { bar: "bg-amber-500", pill: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  medium:   { bar: "bg-teal-600",  pill: "bg-teal-50 text-teal-700 ring-teal-200",   dot: "bg-teal-500" },
  low:      { bar: "bg-slate-400", pill: "bg-slate-50 text-slate-700 ring-slate-200", dot: "bg-slate-400" },
}

const statusPill = (s: string) => {
  if (s === "unresolved") return "bg-rose-50 text-rose-700 ring-rose-200"
  if (s === "acknowledged") return "bg-amber-50 text-amber-700 ring-amber-200"
  return "bg-emerald-50 text-emerald-700 ring-emerald-200"
}

const catIcons: Record<AuditEntry["category"], typeof Settings> = {
  config: Settings, alert: Bell, policy: Shield, user: UserCog, system: Server,
}
const catColors: Record<AuditEntry["category"], string> = {
  config: "text-sky-700 bg-sky-50 ring-sky-200",
  alert:  "text-amber-700 bg-amber-50 ring-amber-200",
  policy: "text-teal-700 bg-teal-50 ring-teal-200",
  user:   "text-violet-700 bg-violet-50 ring-violet-200",
  system: "text-slate-700 bg-slate-50 ring-slate-200",
}

const categories = ["All", "Revenue Anomaly", "System Outage", "Compliance Drop", "Policy Breach", "Device Failure"]

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Alerts() {
  const [severity, setSeverity] = useState<"all" | AlertSeverity>("all")
  const [category, setCategory] = useState("All")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Alert | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return alerts.filter((a) => {
      if (severity !== "all" && a.severity !== severity) return false
      if (category !== "All" && a.category !== category) return false
      if (q && !(a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.corridor.toLowerCase().includes(q))) return false
      return true
    })
  }, [severity, category, query])

  const counts = useMemo(() => ({
    total: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    high: alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low: alerts.filter((a) => a.severity === "low").length,
    unresolved: alerts.filter((a) => a.status === "unresolved").length,
    acknowledged: alerts.filter((a) => a.status === "acknowledged").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  }), [])

  const stats: StatSpec[] = [
    { label: "Open Alerts",       value: String(counts.unresolved), sub: `of ${counts.total} total this window`, icon: AlertTriangle, tone: "danger" },
    { label: "Critical",          value: String(counts.critical),   sub: "highest priority",                     icon: CircleDot,     tone: "danger" },
    { label: "Acknowledged",      value: String(counts.acknowledged), sub: "in progress",                        icon: Activity,      tone: "warn" },
    { label: "Resolved (window)", value: String(counts.resolved),   sub: "closed by ops",                        icon: CheckCircle2,  tone: "good" },
  ]

  // Group audit by day for timeline
  const grouped = useMemo(() => {
    const m = new Map<string, AuditEntry[]>()
    for (const e of auditTrail) {
      const day = e.timestamp.split(",")[0]
      if (!m.has(day)) m.set(day, [])
      m.get(day)!.push(e)
    }
    return [...m.entries()]
  }, [])

  const sevTabs: { key: "all" | AlertSeverity; label: string; count: number }[] = [
    { key: "all",      label: "All",      count: counts.total },
    { key: "critical", label: "Critical", count: counts.critical },
    { key: "high",     label: "High",     count: counts.high },
    { key: "medium",   label: "Medium",   count: counts.medium },
    { key: "low",      label: "Low",      count: counts.low },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alerts & Audit Trail</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Active incidents requiring attention and full chronological system activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HeaderButton icon={Calendar}>Last 7 days</HeaderButton>
            <HeaderButton icon={Filter}>Assignee</HeaderButton>
            <HeaderButton icon={Sliders}>Tweaks</HeaderButton>
          </div>
        </div>
      </header>

      {/* Metric strip */}
      <section className="animate-in-section overflow-hidden rounded-xl border border-border bg-border">
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => <MetricCard key={s.label} spec={s} />)}
        </div>
      </section>

      {/* Filter toolbar */}
      <section className="animate-in-section overflow-hidden rounded-xl border border-border bg-card" style={{ animationDelay: "0.06s" }}>
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          {/* Severity tabs */}
          <div className="inline-flex items-center rounded-md border border-border bg-muted/40 p-0.5 text-xs">
            {sevTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setSeverity(t.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-medium transition-colors",
                  severity === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.key !== "all" && <span className={cn("size-1.5 rounded-full", sevStyles[t.key].dot)} />}
                {t.label}
                <span className="text-[10px] tabular-nums opacity-70">{t.count}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative ml-auto">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search title, description, corridor…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 w-64 rounded-md border border-border bg-background pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border px-4 py-2.5">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                category === c ? "border-foreground/80 bg-foreground/5 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Inbox + Audit timeline */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-5" style={{ animationDelay: "0.12s" }}>
        {/* Alert Inbox */}
        <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-3">
          <CardHeader
            title="Alert Inbox"
            description={`${filtered.length} matching · ${counts.unresolved} unresolved`}
            action={<span className="text-[11px] text-muted-foreground">Click to view details</span>}
          />
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
              <CheckCircle2 className="size-8 text-muted-foreground/40" />
              <div className="text-sm font-medium">No alerts match the current filters</div>
              <div className="text-xs text-muted-foreground">Try clearing filters or adjusting the search.</div>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((a) => {
                const s = sevStyles[a.severity]
                return (
                  <li key={a.id}>
                    <button
                      onClick={() => setSelected(a)}
                      className="group relative flex w-full items-start justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/30"
                    >
                      <span className={cn("absolute inset-y-3 left-2 w-[3px] rounded-full", s.bar)} />
                      <div className="min-w-0 pl-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", s.pill)}>
                            {a.severity}
                          </span>
                          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", statusPill(a.status))}>
                            {a.status}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{a.category}</span>
                        </div>
                        <div className="mt-1.5 truncate text-sm font-semibold">{a.title}</div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{a.corridor}</span>
                          <span className="inline-flex items-center gap-1"><User className="size-3" />{a.assignedTo}</span>
                          <span className="inline-flex items-center gap-1"><Clock className="size-3" />{a.timestamp}</span>
                        </div>
                      </div>
                      <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Audit Timeline */}
        <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
          <CardHeader title="Audit Timeline" description="Chronological log of system and user actions" />
          <div className="space-y-5 px-5 py-5">
            {grouped.map(([day, items]) => (
              <div key={day}>
                <div className="mb-2 flex items-center gap-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{day}</div>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <ul className="space-y-3 border-l border-border pl-5">
                  {items.map((e) => {
                    const Icon = catIcons[e.category]
                    return (
                      <li key={e.id} className="relative">
                        <div className={cn("absolute -left-[2.05rem] top-0.5 flex size-5 items-center justify-center rounded-full ring-1", catColors[e.category])}>
                          <Icon className="size-3" />
                        </div>
                        <div className="text-xs font-semibold">{e.action}</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{e.detail}</div>
                        <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                          {e.actor} · {e.timestamp.split(", ")[1] ?? e.timestamp}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Drawer */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader className="px-5 pt-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", sevStyles[selected.severity].pill)}>
                    {selected.severity}
                  </span>
                  <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1", statusPill(selected.status))}>
                    {selected.status}
                  </span>
                  <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {selected.category}
                  </span>
                </div>
                <SheetTitle className="text-base leading-snug">{selected.title}</SheetTitle>
              </SheetHeader>

              <div className="space-y-5 px-5 pb-6 pt-4">
                <p className="text-sm leading-relaxed text-foreground/85">{selected.description}</p>

                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border">
                  <DrawerStat label="Corridor"  value={selected.corridor}   icon={MapPin} />
                  <DrawerStat label="Assignee"  value={selected.assignedTo} icon={User} />
                  <DrawerStat label="Reported"  value={selected.timestamp}  icon={Clock} />
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="size-4 text-amber-700" />
                    <span className="text-sm font-semibold text-amber-900">Recommended Action</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-amber-900/85">{selected.recommended}</p>
                </div>

                <div>
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status History</div>
                  <ul className="space-y-3 border-l border-border pl-5">
                    <li className="relative">
                      <div className="absolute -left-[1.7rem] top-0.5 size-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100" />
                      <div className="text-xs font-semibold">Alert Created</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">System · {selected.timestamp}</div>
                    </li>
                    {selected.status !== "unresolved" && (
                      <li className="relative">
                        <div className="absolute -left-[1.7rem] top-0.5 size-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
                        <div className="text-xs font-semibold">Acknowledged</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{selected.assignedTo} · {selected.timestamp}</div>
                      </li>
                    )}
                    {selected.status === "resolved" && (
                      <li className="relative">
                        <div className="absolute -left-[1.7rem] top-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                        <div className="text-xs font-semibold">Resolved</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{selected.assignedTo} · {selected.timestamp}</div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function DrawerStat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof MapPin }) {
  return (
    <div className="flex items-center gap-3 bg-card px-4 py-3">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  )
}
