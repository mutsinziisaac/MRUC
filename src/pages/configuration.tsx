import { useState } from "react"
import { ArrowUpRight, Calendar, Filter, Sliders, Pencil, History, ShieldAlert, Receipt, BadgeCheck, CreditCard, FileClock, Users } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { tariffBands, exemptionCategories, paymentChannels, userRoles } from "@/lib/mock-data"
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

function CardHeader({
  title, description, icon: Icon, action,
}: { title: string; description?: string; icon?: typeof Filter; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-foreground/70">
            <Icon className="size-3.5" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

function EditButton({ onClick, label = "Edit" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground/80 shadow-sm transition-colors hover:bg-muted/50"
    >
      <Pencil className="size-3" /> {label}
    </button>
  )
}

interface StatSpec {
  label: string
  value: string
  unit?: string
  unitInline?: boolean
  sub: string
  icon?: typeof Filter
}

function MetricCard({ spec }: { spec: StatSpec }) {
  return (
    <div className="flex flex-col bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{spec.label}</div>
        {spec.icon && <spec.icon className="size-3.5 text-muted-foreground/70" />}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight tabular-nums">{spec.value}</span>
        {spec.unit && (
          <span className={cn(
            spec.unitInline ? "text-xs text-muted-foreground" : "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
          )}>
            {spec.unit}
          </span>
        )}
      </div>
      <div className="mt-1.5 text-xs text-muted-foreground">{spec.sub}</div>
    </div>
  )
}

function FootMeta({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-t border-border bg-muted/20 px-5 py-2.5 text-[11px] text-muted-foreground">
      <History className="size-3 shrink-0" />
      <span className="truncate">{children}</span>
    </div>
  )
}

// ─── Edit modal ────────────────────────────────────────────────────────────
function EditModal({
  open, onClose, title, children, onSave,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; onSave: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">{children}</div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Configuration() {
  const [channels, setChannels] = useState<Record<string, boolean>>(
    Object.fromEntries(paymentChannels.map((c) => [c.id, true])),
  )
  const [editModal, setEditModal] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [tariffs, setTariffs] = useState(tariffBands.map((t) => ({ ...t })))
  const [exemptions, setExemptions] = useState(exemptionCategories.map((e) => ({ ...e })))
  const [thresholds, setThresholds] = useState([
    { name: "Revenue Drop Alert", value: "15%", desc: "Triggers when daily collection falls below the 7-day average" },
    { name: "Uptime Threshold", value: "99.5%", desc: "Alert when service uptime drops below threshold" },
    { name: "Compliance Floor", value: "85%", desc: "Alert when corridor compliance falls below minimum" },
    { name: "Latency Ceiling", value: "2.0s", desc: "Alert when avg transaction time exceeds limit" },
  ])
  const [enforcement, setEnforcement] = useState([
    { name: "Grace Period", value: "48 hours" },
    { name: "Penalty Escalation", value: "2x after 7 days" },
    { name: "Repeat Offender Rule", value: "3 strikes → referral" },
    { name: "Automated ANPR Flagging", value: "Enabled" },
    { name: "Manual Override Authority", value: "Enforcement Lead+" },
  ])
  const [reporting, setReporting] = useState([
    { name: "Daily Summary", schedule: "Every day at 18:00", next: "Today, 18:00" },
    { name: "Weekly Digest", schedule: "Every Monday at 08:00", next: "21 Apr 2025" },
    { name: "Monthly Report", schedule: "1st of each month", next: "01 May 2025" },
  ])
  const [roles, setRoles] = useState(userRoles.map((r) => ({ ...r })))

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }
  const closeModal = () => setEditModal(null)
  const inputClass = "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"

  const totalExemptions = exemptions.reduce((s, e) => s + e.count, 0)
  const enabledChannels = Object.values(channels).filter(Boolean).length
  const totalUsers = roles.reduce((s, r) => s + r.users, 0)

  const stats: StatSpec[] = [
    { label: "Tariff Bands",    value: String(tariffs.length),       sub: "vehicle classes priced",     icon: Receipt },
    { label: "Exemptions",      value: totalExemptions.toLocaleString(), sub: `${exemptions.length} categories`, icon: BadgeCheck },
    { label: "Active Channels", value: `${enabledChannels}`, unit: `/ ${paymentChannels.length}`, unitInline: true, sub: "payment methods enabled", icon: CreditCard },
    { label: "Active Users",    value: String(totalUsers),         sub: `across ${roles.length} roles`, icon: Users },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Active policies, thresholds, and access controls. Changes are audited and require approval.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HeaderButton icon={Calendar}>Effective Apr 2025</HeaderButton>
            <HeaderButton icon={Filter}>Scope</HeaderButton>
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

      {/* Two-column config grid */}
      <section className="animate-in-section grid gap-5 lg:grid-cols-2" style={{ animationDelay: "0.06s" }}>
        {/* Tariff Bands */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="Tariff Bands"
            description="Toll rates by vehicle class · effective 01 Mar 2025"
            icon={Receipt}
            action={<EditButton onClick={() => setEditModal("tariffs")} />}
          />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-2.5">Vehicle Class</th>
                <th className="px-5 py-2.5 text-right">Rate (UGX)</th>
              </tr>
            </thead>
            <tbody>
              {tariffs.map((t) => (
                <tr key={t.vehicleClass} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-2.5 text-sm font-medium">{t.vehicleClass}</td>
                  <td className="px-5 py-2.5 text-right text-sm font-semibold tabular-nums">{t.rate.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <FootMeta>Updated by Dir. G. Akello · 17 Apr 2025 · Next review 01 Jul 2025</FootMeta>
        </div>

        {/* Exemptions */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="Exemptions & Special Classes"
            description={`${totalExemptions.toLocaleString()} active across ${exemptions.length} categories`}
            icon={BadgeCheck}
            action={<EditButton onClick={() => setEditModal("exemptions")} />}
          />
          <ul className="divide-y divide-border">
            {exemptions.map((e) => {
              const pct = (e.count / totalExemptions) * 100
              return (
                <li key={e.name} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{e.name}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">Approved by {e.approvedBy}</div>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{e.count.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-[oklch(0.50_0.10_195)]" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
          <FootMeta>Reviewed by M. Okello · 16 Apr 2025</FootMeta>
        </div>

        {/* Alert Thresholds */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="Alert Thresholds"
            description="Automated trigger conditions"
            icon={ShieldAlert}
            action={<EditButton onClick={() => setEditModal("thresholds")} />}
          />
          <ul className="divide-y divide-border">
            {thresholds.map((t) => (
              <li key={t.name} className="flex items-start justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{t.desc}</div>
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground">{t.value}</span>
              </li>
            ))}
          </ul>
          <FootMeta>Modified by S. Nakato · 18 Apr 2025</FootMeta>
        </div>

        {/* Enforcement Policy */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="Enforcement Policy"
            description="Active rules and escalation procedures"
            icon={ShieldAlert}
            action={<EditButton onClick={() => setEditModal("enforcement")} />}
          />
          <ul className="divide-y divide-border">
            {enforcement.map((p) => (
              <li key={p.name} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{p.value}</span>
                  <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
                    Active
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <FootMeta>Updated by Transport Admin · 10 Apr 2025</FootMeta>
        </div>

        {/* Payment Channels */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="Payment Channel Availability"
            description={`${enabledChannels} of ${paymentChannels.length} enabled`}
            icon={CreditCard}
          />
          <ul className="divide-y divide-border">
            {paymentChannels.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-sm font-medium">{c.name}</span>
                </div>
                <Switch
                  checked={channels[c.id]}
                  onCheckedChange={(v) => setChannels((prev) => ({ ...prev, [c.id]: v }))}
                  aria-label={`Toggle ${c.name}`}
                />
              </li>
            ))}
          </ul>
          <FootMeta>Toggled by S. Nakato · 16 Apr 2025</FootMeta>
        </div>

        {/* Reporting Cadence */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="Reporting Cadence"
            description="Executive report schedule and delivery"
            icon={FileClock}
            action={<EditButton onClick={() => setEditModal("reporting")} />}
          />
          <ul className="divide-y divide-border">
            {reporting.map((r) => (
              <li key={r.name} className="flex items-start justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{r.schedule}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Next</div>
                  <div className="text-xs font-medium text-foreground">{r.next}</div>
                </div>
              </li>
            ))}
          </ul>
          <FootMeta>Portal + Email · KCCA Leadership · Finance Director</FootMeta>
        </div>
      </section>

      {/* Role-Based Access */}
      <section className="animate-in-section" style={{ animationDelay: "0.12s" }}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <CardHeader
            title="Role-Based Access"
            description={`${totalUsers} active users across ${roles.length} roles · last review 10 Apr 2025`}
            icon={Users}
            action={<EditButton onClick={() => setEditModal("roles")} />}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5">Role</th>
                  <th className="px-2 py-2.5">Permissions</th>
                  <th className="px-5 py-2.5 text-right">Users</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.role} className="border-b border-border/60 last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-2.5 text-sm font-semibold">{r.role}</td>
                    <td className="px-2 py-2.5 text-xs text-muted-foreground">{r.permissions}</td>
                    <td className="px-5 py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums">
                        <ArrowUpRight className="size-3 text-muted-foreground" /> {r.users}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Edit Modals */}
      <EditModal open={editModal === "tariffs"} onClose={closeModal} title="Edit Tariff Bands" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {tariffs.map((t, i) => (
          <div key={t.vehicleClass} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{t.vehicleClass}</label>
            <input className={`${inputClass} w-28 text-right`} value={t.rate} onChange={(e) => setTariffs((prev) => prev.map((x, j) => (j === i ? { ...x, rate: Number(e.target.value) || 0 } : x)))} />
          </div>
        ))}
      </EditModal>

      <EditModal open={editModal === "exemptions"} onClose={closeModal} title="Edit Exemptions" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {exemptions.map((e, i) => (
          <div key={e.name} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{e.name}</label>
            <input className={`${inputClass} w-28 text-right`} value={e.count} onChange={(ev) => setExemptions((prev) => prev.map((x, j) => (j === i ? { ...x, count: Number(ev.target.value) || 0 } : x)))} />
          </div>
        ))}
      </EditModal>

      <EditModal open={editModal === "thresholds"} onClose={closeModal} title="Edit Alert Thresholds" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {thresholds.map((t, i) => (
          <div key={t.name} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{t.name}</label>
            <input className={`${inputClass} w-28 text-right`} value={t.value} onChange={(e) => setThresholds((prev) => prev.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
          </div>
        ))}
      </EditModal>

      <EditModal open={editModal === "enforcement"} onClose={closeModal} title="Edit Enforcement Policy" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {enforcement.map((p, i) => (
          <div key={p.name} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{p.name}</label>
            <input className={`${inputClass} w-40 text-right`} value={p.value} onChange={(e) => setEnforcement((prev) => prev.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
          </div>
        ))}
      </EditModal>

      <EditModal open={editModal === "reporting"} onClose={closeModal} title="Edit Reporting Cadence" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {reporting.map((r, i) => (
          <div key={r.name} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{r.name}</label>
            <input className={`${inputClass} w-48 text-right`} value={r.schedule} onChange={(e) => setReporting((prev) => prev.map((x, j) => (j === i ? { ...x, schedule: e.target.value } : x)))} />
          </div>
        ))}
      </EditModal>

      <EditModal open={editModal === "roles"} onClose={closeModal} title="Edit Role Access" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {roles.map((r, i) => (
          <div key={r.role} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{r.role}</label>
            <input className={`${inputClass} w-24 text-right`} value={r.users} onChange={(e) => setRoles((prev) => prev.map((x, j) => (j === i ? { ...x, users: Number(e.target.value) || 0 } : x)))} />
          </div>
        ))}
      </EditModal>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in slide-in-from-bottom-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
