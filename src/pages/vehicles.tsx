import { useState, useMemo } from "react"
import { Car, Users, Globe, ShieldCheck, Clock, Ban, Search } from "lucide-react"
import { KpiCard } from "@/components/shared/kpi-card"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { BarChart, Bar, COLORS, Legend } from "@/components/shared/chart-wrappers"
import { registeredVehicles, transporters, foreignVehiclesInMaputo, registrationTrend } from "@/lib/mock-data"

export default function Vehicles() {
  const [search, setSearch] = useState("")

  const filteredVehicles = useMemo(() => {
    const q = search.toLowerCase()
    return q ? registeredVehicles.filter(v => v.plate.toLowerCase().includes(q) || v.ownerName.toLowerCase().includes(q)) : registeredVehicles
  }, [search])

  const complianceRate = useMemo(() => {
    const compliant = registeredVehicles.filter(v => v.compliance === "compliant").length
    return ((compliant / registeredVehicles.length) * 100).toFixed(1)
  }, [])

  const pendingCount = registeredVehicles.filter(v => v.compliance === "pending").length
  const suspendedCount = registeredVehicles.filter(v => v.registrationStatus === "suspended").length
  const foreignActive = foreignVehiclesInMaputo.filter(v => v.status !== "cleared").length

  const complianceByClass = useMemo(() => {
    const map: Record<string, { name: string; compliant: number; "non-compliant": number; pending: number }> = {}
    for (const v of registeredVehicles) {
      if (!map[v.vehicleClass]) map[v.vehicleClass] = { name: v.vehicleClass, compliant: 0, "non-compliant": 0, pending: 0 }
      map[v.vehicleClass][v.compliance]++
    }
    return Object.values(map)
  }, [])

  const countryBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    for (const v of registeredVehicles) map[v.countryOfOrigin] = (map[v.countryOfOrigin] || 0) + 1
    return Object.entries(map).map(([name, count]) => ({ name, count }))
  }, [])

  const trendData = registrationTrend.map(r => ({ name: r.month, newRegistrations: r.newRegistrations, renewals: r.renewals }))
  const sortedTransporters = [...transporters].sort((a, b) => b.fleetSize - a.fleetSize)

  return (
    <div className="space-y-6">
      <SectionHeader title="Vehicle Registry" description="Fleet registration, compliance tracking, and foreign vehicle monitoring" />

      {/* KPI Band */}
      <div className="animate-in-section grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total Registered" value={String(registeredVehicles.length)} icon={Car} />
        <KpiCard label="Active Transporters" value={String(transporters.length)} icon={Users} />
        <KpiCard label="Foreign Vehicles" value={String(foreignActive)} icon={Globe} />
        <KpiCard label="Compliance Rate" value={`${complianceRate}%`} icon={ShieldCheck} />
        <KpiCard label="Pending Registrations" value={String(pendingCount)} icon={Clock} />
        <KpiCard label="Suspended" value={String(suspendedCount)} icon={Ban} />
      </div>

      {/* Registered Vehicles Table */}
      <div className="animate-in-section rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Registered Vehicles</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search plate or owner..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 rounded-md border border-input bg-background pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Plate</th>
                <th className="pb-2 font-medium">Owner</th>
                <th className="pb-2 font-medium">Transporter</th>
                <th className="pb-2 font-medium">Class</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Compliance</th>
                <th className="pb-2 font-medium">Country</th>
                <th className="pb-2 font-medium">Last Trip</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(v => (
                <tr key={v.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2 font-mono font-medium">{v.plate}</td>
                  <td className="py-2">{v.ownerName}</td>
                  <td className="py-2">{v.transporterName}</td>
                  <td className="py-2">{v.vehicleClass}</td>
                  <td className="py-2"><StatusBadge status={v.registrationStatus} /></td>
                  <td className="py-2"><StatusBadge status={v.compliance} /></td>
                  <td className="py-2">{v.countryOfOrigin}</td>
                  <td className="py-2">{v.lastTripDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Three-column grid */}
      <div className="animate-in-section grid gap-4 lg:grid-cols-3">
        {/* Top Transporters */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">Top Transporters</h3>
          <div className="space-y-3">
            {sortedTransporters.map(t => (
              <div key={t.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-muted-foreground">{t.complianceRate}%</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>Fleet: {t.fleetSize}</span>
                  <span>Active: {t.activeVehicles}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${t.complianceRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Foreign Vehicles in Maputo */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">Foreign Vehicles in Maputo</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Plate</th>
                  <th className="pb-2 font-medium">Country</th>
                  <th className="pb-2 font-medium">Entry</th>
                  <th className="pb-2 font-medium">Exit</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {foreignVehiclesInMaputo.map(v => (
                  <tr key={v.id} className={`border-b border-border/50 last:border-0 ${v.status === "overstay" ? "bg-red-50/50" : ""}`}>
                    <td className="py-1.5 font-mono">{v.plate}</td>
                    <td className="py-1.5">{v.country}</td>
                    <td className="py-1.5">{v.entryPoint}</td>
                    <td className="py-1.5">{v.expectedExit}</td>
                    <td className="py-1.5"><StatusBadge status={v.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registration Trend */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">Registration Trend</h3>
          <BarChart data={trendData} height={220}>
            <Bar dataKey="newRegistrations" stackId="a" fill={COLORS.primary} name="New" />
            <Bar dataKey="renewals" stackId="a" fill={COLORS.gold} name="Renewals" radius={[3, 3, 0, 0]} />
            <Legend />
          </BarChart>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="animate-in-section grid gap-4 lg:grid-cols-2">
        {/* Compliance by Vehicle Class */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">Compliance by Vehicle Class</h3>
          <BarChart data={complianceByClass} height={240}>
            <Bar dataKey="compliant" stackId="a" fill={COLORS.success} name="Compliant" />
            <Bar dataKey="non-compliant" stackId="a" fill="#ef4444" name="Non-Compliant" />
            <Bar dataKey="pending" stackId="a" fill={COLORS.gold} name="Pending" radius={[3, 3, 0, 0]} />
            <Legend />
          </BarChart>
        </div>

        {/* Country of Origin Breakdown */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">Country of Origin Breakdown</h3>
          <BarChart data={countryBreakdown} layout="vertical" height={240}>
            <Bar dataKey="count" fill={COLORS.secondary} name="Vehicles" radius={[0, 3, 3, 0]} />
          </BarChart>
        </div>
      </div>
    </div>
  )
}
