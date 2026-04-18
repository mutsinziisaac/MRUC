import { DollarSign, Target, ShieldCheck, Wifi, AlertTriangle, CalendarDays } from "lucide-react"
import { KpiCard } from "@/components/shared/kpi-card"
import { SectionHeader } from "@/components/shared/section-header"
import { AlertCard } from "@/components/shared/alert-card"
import { AuditTimeline } from "@/components/shared/audit-timeline"
import { AreaChart, BarChart, Area, Bar, COLORS, Legend } from "@/components/shared/chart-wrappers"
import { kpis, monthlyRevenue, corridorPerformance, channelMix, alerts, auditTrail, fmtMZN, fmtPct } from "@/lib/mock-data"

const topStations = corridorPerformance.sort((a, b) => b.collected / b.target - a.collected / a.target)
const topPerformers = topStations.slice(0, 4)
const underPerformers = [...topStations].reverse().slice(0, 4)

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Hero KPI Band */}
      <section className="animate-in-section grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Revenue Today" value={fmtMZN(kpis.revenueToday)} delta={3.2} deltaLabel="vs yesterday" icon={DollarSign} />
        <KpiCard label="Month-to-Date" value={fmtMZN(kpis.revenueMTD)} delta={7.1} deltaLabel="vs last month" icon={CalendarDays} />
        <KpiCard label="Collection Efficiency" value={fmtPct(kpis.collectionEfficiency)} delta={1.4} deltaLabel="vs prior period" icon={Target} />
        <KpiCard label="Compliance Rate" value={fmtPct(kpis.complianceRate)} delta={-0.8} deltaLabel="vs last month" icon={ShieldCheck} />
        <KpiCard label="System Uptime" value={fmtPct(kpis.systemUptime)} delta={0.02} deltaLabel="30-day" icon={Wifi} />
        <KpiCard label="Open Alerts" value={String(kpis.openAlerts)} delta={-2} deltaLabel="vs last week" icon={AlertTriangle} />
      </section>

      {/* Revenue vs Target + Corridor Performance */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-2" style={{ animationDelay: "0.1s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Revenue vs Target" description="Monthly actual collections against target (MZN)" />
          <AreaChart data={monthlyRevenue}>
            <Area type="monotone" dataKey="target" stroke={COLORS.muted} fill="transparent" strokeDasharray="4 4" name="Target" />
            <Area type="monotone" dataKey="actual" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.1} name="Actual" />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </AreaChart>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Corridor Performance" description="Collections by corridor (MZN)" />
          <BarChart data={corridorPerformance.map((c) => ({ name: c.name, Collected: c.collected, Target: c.target }))} layout="vertical" height={260}>
            <Bar dataKey="Target" fill={COLORS.muted} radius={[0, 2, 2, 0]} barSize={10} name="Target" />
            <Bar dataKey="Collected" fill={COLORS.primary} radius={[0, 2, 2, 0]} barSize={10} name="Collected" />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </div>
      </section>

      {/* Payment Channel Mix + Top/Under Performers */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-3" style={{ animationDelay: "0.15s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Payment Channel Mix" description="Share of collections by payment method" />
          <BarChart data={channelMix.map((c) => ({ name: c.channel, Share: c.value }))} height={220}>
            <Bar dataKey="Share" fill={COLORS.secondary} radius={[4, 4, 0, 0]} barSize={28} />
          </BarChart>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Top Performing" description="Highest collection efficiency corridors" />
          <div className="space-y-3 mt-2">
            {topPerformers.map((c) => {
              const pct = Math.round((c.collected / c.target) * 100)
              return (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-success" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className="text-xs font-medium text-success w-10 text-right">{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Underperforming" description="Corridors below collection targets" />
          <div className="space-y-3 mt-2">
            {underPerformers.map((c) => {
              const pct = Math.round((c.collected / c.target) * 100)
              return (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-destructive/70" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className="text-xs font-medium text-destructive w-10 text-right">{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Alerts + Recent Actions + Effectiveness */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-3" style={{ animationDelay: "0.2s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm lg:col-span-1">
          <SectionHeader title="Key Alerts" description="High-priority items requiring attention" />
          <div className="space-y-2">
            {alerts.filter((a) => a.status !== "resolved").slice(0, 4).map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Recent Actions" description="Government-relevant changes and events" />
          <AuditTimeline entries={auditTrail.slice(0, 6)} />
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Effectiveness Summary" description="System performance assessment" />
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              The MRUC system is <span className="font-semibold text-success">performing above target</span> with
              collection efficiency at {fmtPct(kpis.collectionEfficiency)} and overall compliance at {fmtPct(kpis.complianceRate)}.
            </p>
            <p>
              Revenue collections are trending <span className="font-semibold text-success">+7.1% month-over-month</span>,
              driven by strong M-Pesa adoption and improved enforcement coverage on EN1 corridors.
            </p>
            <p className="text-destructive/90">
              <span className="font-semibold">Attention needed:</span> Compliance at EN4 Machava has dropped below the 85% policy floor
              for 3 consecutive days. Exemption claims at Circular West show anomalous patterns requiring audit.
            </p>
            <p className="text-muted-foreground">
              System uptime remains excellent at {fmtPct(kpis.systemUptime)}. One ANPR camera at Matola is under maintenance.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
