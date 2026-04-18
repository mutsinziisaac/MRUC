import { Wifi, Zap, Clock, AlertTriangle } from "lucide-react"
import { KpiCard } from "@/components/shared/kpi-card"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { LineChart, BarChart, Line, Bar, COLORS, Legend } from "@/components/shared/chart-wrappers"
import {
  services, checkpointHealth, incidentsBySeverity, uptimeTrend,
  zoneStatus, maintenanceHistory, kpis, fmtPct,
} from "@/lib/mock-data"

export default function Operations() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section className="animate-in-section grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="System Uptime" value={fmtPct(kpis.systemUptime)} delta={0.02} deltaLabel="30-day" icon={Wifi} />
        <KpiCard label="Tx Success Rate" value={fmtPct(kpis.txSuccessRate)} delta={0.1} deltaLabel="vs last week" icon={Zap} />
        <KpiCard label="Avg Latency" value={`${kpis.avgLatency}s`} delta={-0.3} deltaLabel="improving" icon={Clock} />
        <KpiCard label="Avg Resolution" value={`${kpis.avgResolutionTime}h`} delta={-1.1} deltaLabel="faster" icon={AlertTriangle} />
      </section>

      {/* Service Availability */}
      <section className="animate-in-section" style={{ animationDelay: "0.1s" }}>
        <SectionHeader title="Service Availability" description="Uptime and status by system component" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((s) => (
            <div key={s.name} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{s.name}</span>
                <StatusBadge status={s.status} />
              </div>
              <div className="text-2xl font-bold">{s.uptime}%</div>
              <div className="text-xs text-muted-foreground mt-1">Last incident: {s.lastIncident}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Checkpoint Health + Incidents */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-2" style={{ animationDelay: "0.15s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Checkpoint Connectivity" description="Device health by toll station" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Checkpoint</th>
                  <th className="pb-2 font-medium text-center">Devices</th>
                  <th className="pb-2 font-medium text-center">Online</th>
                  <th className="pb-2 font-medium text-center">Offline</th>
                  <th className="pb-2 font-medium text-right">Heartbeat</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {checkpointHealth.map((c) => (
                  <tr key={c.id} className="border-b border-border/50">
                    <td className="py-2 font-medium">{c.name}</td>
                    <td className="py-2 text-center">{c.devices}</td>
                    <td className="py-2 text-center text-success">{c.online}</td>
                    <td className="py-2 text-center">{c.offline > 0 ? <span className="text-destructive">{c.offline}</span> : "—"}</td>
                    <td className="py-2 text-right text-muted-foreground">{c.lastHeartbeat}</td>
                    <td className="py-2 text-right"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Incidents by Severity" description="Weekly incident count over last 6 weeks" />
          <BarChart data={incidentsBySeverity.map((d) => ({ name: d.week, ...d }))} height={260}>
            <Bar dataKey="Critical" stackId="a" fill="#ef4444" barSize={24} />
            <Bar dataKey="High" stackId="a" fill="#f97316" barSize={24} />
            <Bar dataKey="Medium" stackId="a" fill="#f59e0b" barSize={24} />
            <Bar dataKey="Low" stackId="a" fill="#94a3b8" radius={[2, 2, 0, 0]} barSize={24} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </div>
      </section>

      {/* Zone Status + Reliability + Maintenance */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-3" style={{ animationDelay: "0.2s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Live Status Board" description="Operational zones" />
          <div className="space-y-2">
            {zoneStatus.map((z) => (
              <div key={z.zone} className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                <div>
                  <div className="text-sm font-medium">{z.zone}</div>
                  <div className="text-xs text-muted-foreground">Load: {z.load}</div>
                </div>
                <StatusBadge status={z.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Reliability Trend" description="Monthly uptime over 12 months" />
          <LineChart data={uptimeTrend}>
            <Line type="monotone" dataKey="uptime" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 3 }} name="Uptime %" />
          </LineChart>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Maintenance & Outage History" description="Recent events" />
          <div className="space-y-2.5">
            {maintenanceHistory.map((m, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className={`mt-1 size-2 shrink-0 rounded-full ${m.type === "outage" ? "bg-destructive" : "bg-primary"}`} />
                <div>
                  <div className="font-medium">{m.event}</div>
                  <div className="text-xs text-muted-foreground">{m.date} · Duration: {m.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
