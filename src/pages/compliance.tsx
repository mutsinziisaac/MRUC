import { ShieldCheck, AlertTriangle, FileWarning, Users } from "lucide-react"
import { KpiCard } from "@/components/shared/kpi-card"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { TrendPill } from "@/components/shared/trend-pill"
import { LineChart, BarChart, Line, Bar, COLORS, Legend } from "@/components/shared/chart-wrappers"
import {
  complianceTrend, corridorPerformance, violationsByType,
  enforcementPerformance, exemptionCategories, kpis, fmtPct,
} from "@/lib/mock-data"

const totalViolations = violationsByType.reduce((s, v) => s + v.count, 0)
const resolvedData = complianceTrend.map((m) => ({
  month: m.month,
  Resolved: Math.round(40 + Math.random() * 30),
  Unresolved: Math.round(10 + Math.random() * 20),
}))

const hotspots = corridorPerformance.map((c) => ({
  ...c,
  level: c.compliance >= 93 ? "operational" : c.compliance >= 85 ? "degraded" : "critical",
})).sort((a, b) => a.compliance - b.compliance)

const suspiciousCards = [
  { title: "Exemption spike at Circular West", desc: "340% increase in exemption claims over 48 hours. Pattern inconsistent with historical baseline.", severity: "critical" as const },
  { title: "Repeated toll evasion — EN1 Sul secondary", desc: "Same 12 vehicle plates flagged 3+ times in 7 days. Possible organized evasion.", severity: "high" as const },
  { title: "Overweight detections up at Marracuene", desc: "23% month-over-month increase. Correlates with new construction project traffic.", severity: "medium" as const },
  { title: "Cash reconciliation gap — Marginal Coastal", desc: "8.2% variance between vehicle count and cash receipts. Under investigation.", severity: "medium" as const },
]

const priorityActions = [
  { corridor: "EN4 Machava", trend: -3.2, action: "Increase enforcement presence; review exemption claims" },
  { corridor: "Circular de Maputo", trend: -1.8, action: "Audit exemption spike; freeze new claims pending review" },
  { corridor: "EN1 Sul", trend: -0.9, action: "Address staffing gap at secondary checkpoint" },
]

export default function Compliance() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section className="animate-in-section grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Compliance Rate" value={fmtPct(kpis.complianceRate)} delta={-0.8} deltaLabel="vs last month" icon={ShieldCheck} />
        <KpiCard label="Violations Detected" value={totalViolations.toLocaleString()} delta={-5.2} deltaLabel="vs prior period" icon={AlertTriangle} />
        <KpiCard label="Resolution Rate" value="84.3%" delta={2.1} deltaLabel="improving" icon={FileWarning} />
        <KpiCard label="Enforcement Coverage" value="92.1%" delta={1.5} deltaLabel="vs last month" icon={Users} />
      </section>

      {/* Compliance Trend + Resolved vs Unresolved */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-2" style={{ animationDelay: "0.1s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Compliance Rate Trend" description="Monthly compliance rate vs 95% target" />
          <LineChart data={complianceTrend}>
            <Line type="monotone" dataKey="rate" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 3 }} name="Compliance %" />
            <Line type="monotone" dataKey="target" stroke={COLORS.gold} strokeWidth={1} strokeDasharray="4 4" dot={false} name="Target (95%)" />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </LineChart>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Resolved vs Unresolved" description="Enforcement issue resolution over time" />
          <BarChart data={resolvedData.map((d) => ({ name: d.month, ...d }))} height={260}>
            <Bar dataKey="Resolved" stackId="a" fill={COLORS.success} radius={[0, 0, 0, 0]} barSize={20} />
            <Bar dataKey="Unresolved" stackId="a" fill={COLORS.gold} radius={[2, 2, 0, 0]} barSize={20} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </div>
      </section>

      {/* Evasion Hotspots + Enforcement Teams */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-2" style={{ animationDelay: "0.15s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Evasion Hotspots" description="Corridor compliance scores" />
          <div className="space-y-2">
            {hotspots.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.district} · {c.violations} violations</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{c.compliance}%</span>
                  <StatusBadge status={c.level} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Enforcement Team Performance" description="Inspections, violations found, and resolution rates" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Team</th>
                  <th className="pb-2 font-medium text-right">Inspections</th>
                  <th className="pb-2 font-medium text-right">Violations</th>
                  <th className="pb-2 font-medium text-right">Resolution</th>
                </tr>
              </thead>
              <tbody>
                {enforcementPerformance.map((t) => (
                  <tr key={t.id} className="border-b border-border/50">
                    <td className="py-2">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.zone} · {t.members} members</div>
                    </td>
                    <td className="py-2 text-right">{t.inspections}</td>
                    <td className="py-2 text-right">{t.violations}</td>
                    <td className="py-2 text-right font-medium">{t.resolutionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Exemptions + Suspicious Activity + Priority Actions */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-3" style={{ animationDelay: "0.2s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Exemption Usage" description="Active exemptions by category" />
          <div className="space-y-2.5">
            {exemptionCategories.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">Approved by {e.approvedBy}</div>
                </div>
                <span className="text-sm font-semibold">{e.count}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 text-xs text-muted-foreground">
              Total: {exemptionCategories.reduce((s, e) => s + e.count, 0)} active exemptions · ~2.3% of total traffic
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Suspicious Activity" description="Patterns requiring investigation" />
          <div className="space-y-2.5">
            {suspiciousCards.map((c) => (
              <div key={c.title} className="rounded-md border border-border p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={c.severity} />
                </div>
                <div className="text-sm font-medium">{c.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Priority Actions" description="Areas with declining compliance requiring intervention" />
          <div className="space-y-3">
            {priorityActions.map((a, i) => (
              <div key={a.corridor} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">#{i + 1} {a.corridor}</span>
                  <TrendPill value={a.trend} />
                </div>
                <p className="text-xs text-muted-foreground">{a.action}</p>
              </div>
            ))}
          </div>

          {/* Violation breakdown */}
          <div className="mt-4">
            <SectionHeader title="Violations by Type" />
            <div className="space-y-2">
              {violationsByType.map((v) => (
                <div key={v.type} className="flex items-center justify-between text-sm">
                  <span>{v.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{v.count}</span>
                    <TrendPill value={v.trend} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
