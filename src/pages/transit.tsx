import { Route, CheckCircle, XCircle, Truck, Package, QrCode, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { KpiCard } from "@/components/shared/kpi-card"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { BarChart, Bar, COLORS, Legend } from "@/components/shared/chart-wrappers"
import {
  activeTrips, qrValidationLogs, geofenceEvents,
  emptyTruckDetections, sctCargoShipments, fmtMZN,
} from "@/lib/mock-data"

const statusCounts = {
  "in-transit": activeTrips.filter((t) => t.status === "in-transit").length,
  completed: activeTrips.filter((t) => t.status === "completed").length,
  "auto-terminated": activeTrips.filter((t) => t.status === "auto-terminated").length,
}
const qrIssues = activeTrips.filter((t) => t.qrStatus !== "valid").length
const autoTerminated = activeTrips.filter((t) => t.status === "auto-terminated")
const chartData = Object.entries(statusCounts).map(([name, count]) => ({ name, count }))

const th = "pb-2 font-medium"

export default function Transit() {
  return (
    <div className="space-y-6">
      {/* 1 — KPI Band */}
      <section className="animate-in-section grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Active Trips" value={String(statusCounts["in-transit"])} delta={5.2} deltaLabel="vs yesterday" icon={Route} />
        <KpiCard label="Completed Today" value={String(statusCounts.completed)} delta={2.1} deltaLabel="vs yesterday" icon={CheckCircle} />
        <KpiCard label="Auto-Terminated" value={String(statusCounts["auto-terminated"])} delta={-12} deltaLabel="vs yesterday" icon={XCircle} />
        <KpiCard label="Empty Trucks Detected" value={String(emptyTruckDetections.length)} delta={0} deltaLabel="today" icon={Truck} />
        <KpiCard label="SCT Cargo Trips" value={String(sctCargoShipments.length)} delta={1.5} deltaLabel="vs yesterday" icon={Package} />
        <KpiCard label="QR Issues" value={String(qrIssues)} delta={-3.4} deltaLabel="vs yesterday" icon={QrCode} />
      </section>

      {/* 2 — Active Trips + Chart */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-2" style={{ animationDelay: "0.1s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Active Trips" description="All monitored trips today" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className={th}>Trip ID</th>
                  <th className={th}>Plate</th>
                  <th className={th}>Origin → Destination</th>
                  <th className={th}>Status</th>
                  <th className={th}>QR</th>
                  <th className={`${th} text-right`}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {activeTrips.map((t) => (
                  <tr key={t.id} className="border-b border-border/50">
                    <td className="py-1.5 font-medium">{t.id}</td>
                    <td className="py-1.5">{t.vehiclePlate}</td>
                    <td className="py-1.5 text-xs">{t.origin} → {t.destination}</td>
                    <td className="py-1.5"><StatusBadge status={t.status} /></td>
                    <td className="py-1.5"><StatusBadge status={t.qrStatus} /></td>
                    <td className="py-1.5 text-right text-muted-foreground">{t.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Trip Status Breakdown" description="Count by status category" />
          <BarChart data={chartData} height={300}>
            <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={48} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </div>
      </section>

      {/* 3 — QR Logs + Geofence + Auto-Term/Empty */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-3" style={{ animationDelay: "0.15s" }}>
        {/* QR Validation Log */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="QR Validation Log" description="Recent scan results" />
          <div className="space-y-2">
            {qrValidationLogs.map((q) => (
              <div key={q.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{q.checkpoint}</div>
                  <div className="text-xs text-muted-foreground">{q.vehiclePlate} · {q.timestamp}</div>
                </div>
                <StatusBadge status={q.result} />
              </div>
            ))}
          </div>
        </div>

        {/* Geofence Events */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Geofence Events" description="Zone entry/exit tracking" />
          <div className="space-y-2">
            {geofenceEvents.map((g) => (
              <div key={g.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  {g.eventType === "entry" ? (
                    <ArrowDownLeft className="size-4 text-success" />
                  ) : (
                    <ArrowUpRight className="size-4 text-destructive" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{g.zone}</div>
                    <div className="text-xs text-muted-foreground">{g.vehiclePlate} · {g.timestamp}</div>
                  </div>
                </div>
                <span className="text-xs capitalize text-muted-foreground">{g.eventType}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-Termination & Empty Trucks */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm space-y-4">
          <div>
            <SectionHeader title="Auto-Terminated Trips" description="Trips ended by system" />
            <div className="space-y-2">
              {autoTerminated.map((t) => (
                <div key={t.id} className="rounded-md border border-border px-3 py-2">
                  <div className="text-sm font-medium">{t.vehiclePlate}</div>
                  <div className="text-xs text-muted-foreground">{t.origin} → {t.destination} · {t.duration}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title="Empty Truck Detections" description="Flagged empty vehicles" />
            <div className="space-y-2">
              {emptyTruckDetections.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{e.vehiclePlate}</div>
                    <div className="text-xs text-muted-foreground">{e.detectedAt} · {e.asycudaRef}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{fmtMZN(e.amount)}</span>
                    <StatusBadge status={e.chargeStatus} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 — SCT Cargo Monitoring */}
      <section className="animate-in-section" style={{ animationDelay: "0.2s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="SCT Cargo Monitoring" description="Single Customs Territory shipments" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className={th}>ID</th>
                  <th className={th}>Plate</th>
                  <th className={th}>Cargo</th>
                  <th className={th}>Customs Status</th>
                  <th className={th}>Origin</th>
                  <th className={th}>Destination</th>
                  <th className={th}>Entry Point</th>
                  <th className={`${th} text-right`}>Time</th>
                </tr>
              </thead>
              <tbody>
                {sctCargoShipments.map((s) => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="py-1.5 font-medium">{s.id}</td>
                    <td className="py-1.5">{s.vehiclePlate}</td>
                    <td className="py-1.5">{s.cargoDesc}</td>
                    <td className="py-1.5"><StatusBadge status={s.customsStatus} /></td>
                    <td className="py-1.5">{s.origin}</td>
                    <td className="py-1.5">{s.destination}</td>
                    <td className="py-1.5">{s.entryPoint}</td>
                    <td className="py-1.5 text-right text-muted-foreground">{s.timestamp}</td>
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
