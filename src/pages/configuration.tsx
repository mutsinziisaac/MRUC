import { useState } from "react"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { tariffBands, exemptionCategories, paymentChannels, userRoles } from "@/lib/mock-data"

function ConfigCard({ title, description, lastUpdated, children }: { title: string; description: string; lastUpdated: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 text-xs">Request Change</Button>
      </div>
      {children}
      <Separator className="my-3" />
      <div className="text-[11px] text-muted-foreground">{lastUpdated}</div>
    </div>
  )
}

export default function Configuration() {
  const [channels, setChannels] = useState<Record<string, boolean>>(
    Object.fromEntries(paymentChannels.map((c) => [c.id, true]))
  )

  return (
    <div className="space-y-6">
      <section className="animate-in-section">
        <SectionHeader title="Active Policy Configuration" description="View current system settings. Changes require approval and are fully audited." />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Tariff Bands */}
        <ConfigCard title="Tariff Bands & Charge Categories" description="Current active toll rates by vehicle class" lastUpdated="Last updated by Gov. A. Mondlane on 17 Apr 2025">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Vehicle Class</th>
                  <th className="pb-2 font-medium text-right">Rate</th>
                </tr>
              </thead>
              <tbody>
                {tariffBands.map((t) => (
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
        <ConfigCard title="Exemptions & Special Classes" description="Active exemption categories and approval authority" lastUpdated="Last reviewed by L. Cossa on 16 Apr 2025">
          <div className="space-y-2.5">
            {exemptionCategories.map((e) => (
              <div key={e.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">Approved by {e.approvedBy}</div>
                </div>
                <span className="text-sm font-semibold">{e.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Total: {exemptionCategories.reduce((s, e) => s + e.count, 0)} active exemptions</div>
        </ConfigCard>

        {/* Alert Thresholds */}
        <ConfigCard title="Alert Thresholds" description="Automated alert trigger conditions" lastUpdated="Last modified by S. Nhaca on 18 Apr 2025">
          <div className="space-y-3">
            {[
              { name: "Revenue Drop Alert", value: "15%", desc: "Triggers when daily collection falls below 7-day average" },
              { name: "Uptime Threshold", value: "99.5%", desc: "Alert when service uptime drops below threshold" },
              { name: "Compliance Floor", value: "85%", desc: "Alert when corridor compliance falls below minimum" },
              { name: "Latency Ceiling", value: "2.0s", desc: "Alert when avg transaction time exceeds limit" },
            ].map((t) => (
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
        <ConfigCard title="Enforcement Policy Settings" description="Active enforcement rules and escalation procedures" lastUpdated="Last updated by Transport Admin on 10 Apr 2025">
          <div className="space-y-3">
            {[
              { name: "Grace Period", value: "48 hours", status: "operational" },
              { name: "Penalty Escalation", value: "2x after 7 days", status: "operational" },
              { name: "Repeat Offender Rule", value: "3 strikes → referral", status: "operational" },
              { name: "Automated ANPR Flagging", value: "Enabled", status: "operational" },
              { name: "Manual Override Authority", value: "Enforcement Lead+", status: "operational" },
            ].map((p) => (
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

        {/* Payment Channel Toggles */}
        <ConfigCard title="Payment Channel Availability" description="Enable or disable payment methods across all toll points" lastUpdated="Last toggled by S. Nhaca on 16 Apr 2025">
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
        <ConfigCard title="Reporting Cadence" description="Executive report schedule and delivery preferences" lastUpdated="Last configured by J. Macamo on 14 Apr 2025">
          <div className="space-y-3">
            {[
              { name: "Daily Summary", schedule: "Every day at 18:00", next: "Today, 18:00" },
              { name: "Weekly Digest", schedule: "Every Monday at 08:00", next: "21 Apr 2025" },
              { name: "Monthly Report", schedule: "1st of each month", next: "01 May 2025" },
            ].map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.schedule}</div>
                </div>
                <span className="text-xs text-muted-foreground">Next: {r.next}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Delivery: Portal + Email · Recipients: Governor's Office, Finance Director</div>
        </ConfigCard>
      </div>

      {/* Role-Based Access */}
      <section className="animate-in-section" style={{ animationDelay: "0.1s" }}>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <SectionHeader title="Role-Based Access Overview" description="Current access roles and permission summary" />
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
                {userRoles.map((r) => (
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
          <div className="text-[11px] text-muted-foreground">Total: {userRoles.reduce((s, r) => s + r.users, 0)} active users · Last access review: 10 Apr 2025 by System Admin</div>
        </div>
      </section>
    </div>
  )
}
