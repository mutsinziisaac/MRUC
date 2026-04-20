import { DollarSign, Clock, Shield, Building, Briefcase, CheckCircle } from "lucide-react"
import { KpiCard } from "@/components/shared/kpi-card"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { BarChart, Bar, LineChart, Line, COLORS, Legend } from "@/components/shared/chart-wrappers"
import {
  reconciliationRecords, remittanceLog, bankGuarantee,
  pppRevenueShare, asycudaIntegrationStatus, tenYearProjection, fmtUGX, fmtPct,
} from "@/lib/mock-data"

const matched = reconciliationRecords.filter((r) => r.status === "matched").length
const pending = reconciliationRecords.filter((r) => r.status !== "matched").length
const reconRate = (matched / reconciliationRecords.length) * 100
const latest = pppRevenueShare[pppRevenueShare.length - 1]
const todayRemitted = remittanceLog
  .filter((r) => r.timestamp.startsWith("18 Apr"))
  .reduce((s, r) => s + r.amount, 0)
const utilizationPct = (bankGuarantee.utilized / bankGuarantee.amount) * 100

export default function Reconciliation() {
  return (
    <div className="space-y-6">
      {/* KPI Band */}
      <section className="animate-in-section grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Remitted Today" value={fmtUGX(todayRemitted)} icon={DollarSign} />
        <KpiCard label="Pending Reconciliation" value={String(pending)} icon={Clock} />
        <KpiCard label="Bank Guarantee" value={fmtUGX(bankGuarantee.available)} icon={Shield} />
        <KpiCard label="KCCA Share 75%" value={fmtUGX(latest.municipalityShare)} icon={Building} />
        <KpiCard label="BSMART Share 25%" value={fmtUGX(latest.bsmartShare)} icon={Briefcase} />
        <KpiCard label="Reconciliation Rate" value={fmtPct(reconRate)} icon={CheckCircle} />
      </section>

      {/* Charts Row */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-2" style={{ animationDelay: "0.1s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="PPP Revenue Share" description="Monthly KCCA vs BSMART split" />
          <BarChart data={pppRevenueShare.map((d) => ({ name: d.month, municipalityShare: d.municipalityShare, bsmartShare: d.bsmartShare }))}>
            <Bar dataKey="municipalityShare" stackId="a" fill={COLORS.primary} barSize={20} name="KCCA (75%)" />
            <Bar dataKey="bsmartShare" stackId="a" fill={COLORS.gold} radius={[2, 2, 0, 0]} barSize={20} name="BSMART (25%)" />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="10-Year Revenue Projection" description="Projected revenue with PPP split" />
          <LineChart data={tenYearProjection.map((d) => ({ month: String(d.year), ...d }))}>
            <Line type="monotone" dataKey="projected" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 3 }} name="Projected" />
            <Line type="monotone" dataKey="municipalityShare" stroke={COLORS.success} strokeWidth={2} dot={{ r: 3 }} name="KCCA" />
            <Line type="monotone" dataKey="bsmartShare" stroke={COLORS.gold} strokeWidth={2} dot={{ r: 3 }} name="BSMART" />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </LineChart>
        </div>
      </section>

      {/* Info Cards Row */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-3" style={{ animationDelay: "0.15s" }}>
        {/* Bank Guarantee */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Bank Guarantee Status" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span className="font-medium">{bankGuarantee.provider}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Amount</span><span className="font-medium">{fmtUGX(bankGuarantee.amount)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Utilized</span><span className="font-medium">{fmtUGX(bankGuarantee.utilized)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Available</span><span className="font-medium">{fmtUGX(bankGuarantee.available)}</span></div>
            <div>
              <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">Utilization</span><span>{fmtPct(utilizationPct)}</span></div>
              <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${utilizationPct}%` }} /></div>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Expiry</span><span className="font-medium">{bankGuarantee.expiryDate}</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Status</span><StatusBadge status={bankGuarantee.status} /></div>
          </div>
        </div>

        {/* ASYCUDA Integration */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="ASYCUDA Integration" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Connection</span><StatusBadge status={asycudaIntegrationStatus.status} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Last Sync</span><span className="font-medium">{asycudaIntegrationStatus.lastSync}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Records Processed</span><span className="font-medium">{asycudaIntegrationStatus.recordsProcessed.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pending Records</span><span className="font-medium">{asycudaIntegrationStatus.pendingRecords}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Uptime</span><span className="font-medium">{fmtPct(asycudaIntegrationStatus.uptime)}</span></div>
          </div>
        </div>

        {/* Remittance Feed */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Remittance Feed" description="Recent remittance entries" />
          <div className="space-y-2.5 max-h-[320px] overflow-y-auto">
            {remittanceLog.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{r.reference}</div>
                  <div className="text-xs text-muted-foreground">{r.channel} · {r.timestamp}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium">{fmtUGX(r.amount)}</div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reconciliation Table */}
      <section className="animate-in-section" style={{ animationDelay: "0.2s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Payment Reconciliation" description="Daily reconciliation records by channel" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium text-right">Expected</th>
                  <th className="pb-2 font-medium text-right">Actual</th>
                  <th className="pb-2 font-medium text-right">Variance</th>
                  <th className="pb-2 font-medium">Channel</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {reconciliationRecords.map((r) => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="py-2 font-medium">{r.date}</td>
                    <td className="py-2 text-right">{fmtUGX(r.expected)}</td>
                    <td className="py-2 text-right">{fmtUGX(r.actual)}</td>
                    <td className={`py-2 text-right font-medium ${r.variance < 0 ? "text-destructive" : ""}`}>{fmtUGX(r.variance)}</td>
                    <td className="py-2">{r.channel}</td>
                    <td className="py-2 text-right"><StatusBadge status={r.status} /></td>
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
