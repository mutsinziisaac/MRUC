import { useState } from "react"
import { Pencil } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { tariffBands, exemptionCategories, paymentChannels, userRoles } from "@/lib/mock-data"

function ConfigCard({ title, description, lastUpdated, onEdit, children }: { title: string; description: string; lastUpdated: string; onEdit?: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        {onEdit && (
          <button onClick={onEdit} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Edit">
            <Pencil className="size-3.5" />
          </button>
        )}
      </div>
      {children}
      <Separator className="my-3" />
      <div className="text-[11px] text-muted-foreground">{lastUpdated}</div>
    </div>
  )
}

function EditModal({ open, onClose, title, children, onSave }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; onSave: () => void }) {
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

export default function Configuration() {
  const [channels, setChannels] = useState<Record<string, boolean>>(
    Object.fromEntries(paymentChannels.map((c) => [c.id, true]))
  )
  const [editModal, setEditModal] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [tariffs, setTariffs] = useState(tariffBands.map(t => ({ ...t })))
  const [exemptions, setExemptions] = useState(exemptionCategories.map(e => ({ ...e })))
  const [thresholds, setThresholds] = useState([
    { name: "Revenue Drop Alert", value: "15%", desc: "Triggers when daily collection falls below 7-day average" },
    { name: "Uptime Threshold", value: "99.5%", desc: "Alert when service uptime drops below threshold" },
    { name: "Compliance Floor", value: "85%", desc: "Alert when corridor compliance falls below minimum" },
    { name: "Latency Ceiling", value: "2.0s", desc: "Alert when avg transaction time exceeds limit" },
  ])
  const [enforcement, setEnforcement] = useState([
    { name: "Grace Period", value: "48 hours", status: "operational" },
    { name: "Penalty Escalation", value: "2x after 7 days", status: "operational" },
    { name: "Repeat Offender Rule", value: "3 strikes → referral", status: "operational" },
    { name: "Automated ANPR Flagging", value: "Enabled", status: "operational" },
    { name: "Manual Override Authority", value: "Enforcement Lead+", status: "operational" },
  ])
  const [reporting, setReporting] = useState([
    { name: "Daily Summary", schedule: "Every day at 18:00", next: "Today, 18:00" },
    { name: "Weekly Digest", schedule: "Every Monday at 08:00", next: "21 Apr 2025" },
    { name: "Monthly Report", schedule: "1st of each month", next: "01 May 2025" },
  ])
  const [roles, setRoles] = useState(userRoles.map(r => ({ ...r })))

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }
  const closeModal = () => setEditModal(null)
  const inputClass = "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm"

  return (
    <div className="space-y-6">
      <section className="animate-in-section">
        <SectionHeader title="Active Policy Configuration" description="View current system settings. Changes require approval and are fully audited." />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Tariff Bands */}
        <ConfigCard title="Tariff Bands & Charge Categories" description="Current active toll rates by vehicle class" lastUpdated="Last updated by Dir. G. Akello on 17 Apr 2025" onEdit={() => setEditModal("tariffs")}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Vehicle Class</th>
                  <th className="pb-2 font-medium text-right">Rate</th>
                </tr>
              </thead>
              <tbody>
                {tariffs.map((t) => (
                  <tr key={t.vehicleClass} className="border-b border-border/50">
                    <td className="py-2 font-medium">{t.vehicleClass}</td>
                    <td className="py-2 text-right">{t.rate} {t.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Effective since 01 Mar 2025 · Next review: 01 Jul 2025</div>
        </ConfigCard>

        {/* Exemptions */}
        <ConfigCard title="Exemptions & Special Classes" description="Active exemption categories and approval authority" lastUpdated="Last reviewed by M. Okello on 16 Apr 2025" onEdit={() => setEditModal("exemptions")}>
          <div className="space-y-2.5">
            {exemptions.map((e) => (
              <div key={e.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">Approved by {e.approvedBy}</div>
                </div>
                <span className="text-sm font-semibold">{e.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Total: {exemptions.reduce((s, e) => s + e.count, 0)} active exemptions</div>
        </ConfigCard>

        {/* Alert Thresholds */}
        <ConfigCard title="Alert Thresholds" description="Automated alert trigger conditions" lastUpdated="Last modified by S. Nakato on 18 Apr 2025" onEdit={() => setEditModal("thresholds")}>
          <div className="space-y-3">
            {thresholds.map((t) => (
              <div key={t.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-sm font-semibold">{t.value}</span>
              </div>
            ))}
          </div>
        </ConfigCard>

        {/* Enforcement Policy */}
        <ConfigCard title="Enforcement Policy Settings" description="Active enforcement rules and escalation procedures" lastUpdated="Last updated by Transport Admin on 10 Apr 2025" onEdit={() => setEditModal("enforcement")}>
          <div className="space-y-3">
            {enforcement.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{p.value}</span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </ConfigCard>

        {/* Payment Channel Toggles — no edit button */}
        <ConfigCard title="Payment Channel Availability" description="Enable or disable payment methods across all toll points" lastUpdated="Last toggled by S. Nakato on 16 Apr 2025">
          <div className="space-y-3">
            {paymentChannels.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-sm font-medium">{c.name}</span>
                </div>
                <Switch
                  checked={channels[c.id]}
                  onCheckedChange={(v) => setChannels((prev) => ({ ...prev, [c.id]: v }))}
                  aria-label={`Toggle ${c.name}`}
                />
              </div>
            ))}
          </div>
        </ConfigCard>

        {/* Reporting Cadence */}
        <ConfigCard title="Reporting Cadence" description="Executive report schedule and delivery preferences" lastUpdated="Last configured by D. Ssekitoleko on 14 Apr 2025" onEdit={() => setEditModal("reporting")}>
          <div className="space-y-3">
            {reporting.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.schedule}</div>
                </div>
                <span className="text-xs text-muted-foreground">Next: {r.next}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Delivery: Portal + Email · Recipients: KCCA Leadership, Finance Director</div>
        </ConfigCard>
      </div>

      {/* Role-Based Access */}
      <section className="animate-in-section" style={{ animationDelay: "0.1s" }}>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <SectionHeader title="Role-Based Access Overview" description="Current access roles and permission summary" />
            <button onClick={() => setEditModal("roles")} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Edit">
              <Pencil className="size-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium">Permissions</th>
                  <th className="pb-2 font-medium text-right">Users</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.role} className="border-b border-border/50">
                    <td className="py-2 font-medium">{r.role}</td>
                    <td className="py-2 text-muted-foreground">{r.permissions}</td>
                    <td className="py-2 text-right font-medium">{r.users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Separator className="my-3" />
          <div className="text-[11px] text-muted-foreground">Total: {roles.reduce((s, r) => s + r.users, 0)} active users · Last access review: 10 Apr 2025 by System Admin</div>
        </div>
      </section>

      {/* Edit Modals */}
      <EditModal open={editModal === "tariffs"} onClose={closeModal} title="Edit Tariff Bands" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {tariffs.map((t, i) => (
          <div key={t.vehicleClass} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{t.vehicleClass}</label>
            <input className={inputClass + " w-24 text-right"} value={t.rate} onChange={(e) => setTariffs(prev => prev.map((x, j) => j === i ? { ...x, rate: Number(e.target.value) || 0 } : x))} />
          </div>
        ))}
      </EditModal>

      <EditModal open={editModal === "exemptions"} onClose={closeModal} title="Edit Exemptions" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {exemptions.map((e, i) => (
          <div key={e.name} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{e.name}</label>
            <input className={inputClass + " w-24 text-right"} value={e.count} onChange={(ev) => setExemptions(prev => prev.map((x, j) => j === i ? { ...x, count: Number(ev.target.value) || 0 } : x))} />
          </div>
        ))}
      </EditModal>

      <EditModal open={editModal === "thresholds"} onClose={closeModal} title="Edit Alert Thresholds" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {thresholds.map((t, i) => (
          <div key={t.name} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{t.name}</label>
            <input className={inputClass + " w-24 text-right"} value={t.value} onChange={(e) => setThresholds(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
          </div>
        ))}
      </EditModal>

      <EditModal open={editModal === "enforcement"} onClose={closeModal} title="Edit Enforcement Policy" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {enforcement.map((p, i) => (
          <div key={p.name} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{p.name}</label>
            <input className={inputClass + " w-28 text-right"} value={p.value} onChange={(e) => setEnforcement(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
          </div>
        ))}
      </EditModal>

      <EditModal open={editModal === "reporting"} onClose={closeModal} title="Edit Reporting Cadence" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {reporting.map((r, i) => (
          <div key={r.name} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{r.name}</label>
            <input className={inputClass + " w-40 text-right"} value={r.schedule} onChange={(e) => setReporting(prev => prev.map((x, j) => j === i ? { ...x, schedule: e.target.value } : x))} />
          </div>
        ))}
      </EditModal>

      <EditModal open={editModal === "roles"} onClose={closeModal} title="Edit Role Access" onSave={() => { closeModal(); showToast("Configuration updated successfully") }}>
        {roles.map((r, i) => (
          <div key={r.role} className="flex items-center justify-between gap-3">
            <label className="text-sm flex-1">{r.role}</label>
            <input className={inputClass + " w-20 text-right"} value={r.users} onChange={(e) => setRoles(prev => prev.map((x, j) => j === i ? { ...x, users: Number(e.target.value) || 0 } : x))} />
          </div>
        ))}
      </EditModal>

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-2">{toast}</div>}
    </div>
  )
}
