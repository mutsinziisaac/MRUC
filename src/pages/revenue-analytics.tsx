import { useState } from "react"
import { DollarSign, Clock, AlertTriangle, TrendingUp } from "lucide-react"
import { KpiCard } from "@/components/shared/kpi-card"
import { SectionHeader } from "@/components/shared/section-header"
import { AreaChart, BarChart, LineChart, Area, Bar, Line, COLORS, Legend } from "@/components/shared/chart-wrappers"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  dailyRevenue, monthlyRevenue, corridorPerformance, channelMix,
  revenueByStream, hourlyThroughput, forecast, kpis, fmtMZN, fmtPct,
} from "@/lib/mock-data"

const weeklyRevenue = dailyRevenue.reduce<{ week: string; value: number }[]>((acc, d, i) => {
  const wi = Math.floor(i / 7)
  const label = `W${wi + 1}`
  if (!acc[wi]) acc[wi] = { week: label, value: 0 }
  acc[wi].value += d.value
  return acc
}, [])

const leakageData = corridorPerformance.map((c) => ({
  name: c.name,
  expected: c.target,
  actual: c.collected,
  variance: Math.round(((c.target - c.collected) / c.target) * 100),
})).sort((a, b) => b.variance - a.variance)

export default function RevenueAnalytics() {
  const [period, setPeriod] = useState("monthly")

  const chartData = period === "daily" ? dailyRevenue.slice(-30).map((d) => ({ month: d.date, actual: d.value }))
    : period === "weekly" ? weeklyRevenue.map((w) => ({ month: w.week, actual: w.value }))
    : monthlyRevenue

  return (
    <div className="space-y-6">
      {/* Filters */}
      <section className="animate-in-section flex flex-wrap items-center gap-3">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* KPI row */}
      <section className="animate-in-section grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Year-to-Date" value={fmtMZN(kpis.revenueYTD)} delta={11.3} deltaLabel="vs prior year" icon={DollarSign} />
        <KpiCard label="Collection Efficiency" value={fmtPct(kpis.collectionEfficiency)} delta={1.4} deltaLabel="vs target" icon={TrendingUp} />
        <KpiCard label="Avg Transaction" value={`${kpis.avgTransactionValue} MZN`} delta={2.1} deltaLabel="vs last month" icon={Clock} />
        <KpiCard label="Leakage Risk" value="4.8%" delta={-1.2} deltaLabel="improving" icon={AlertTriangle} />
      </section>

      {/* Time-series + Actual vs Target */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-2" style={{ animationDelay: "0.1s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Collection Trend" description={`${period.charAt(0).toUpperCase() + period.slice(1)} revenue collections (MZN)`} />
          <AreaChart data={chartData}>
            {period === "monthly" && <Area type="monotone" dataKey="target" stroke={COLORS.muted} fill="transparent" strokeDasharray="4 4" name="Target" />}
            <Area type="monotone" dataKey="actual" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.1} name="Actual" />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </AreaChart>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Actual vs Target by Corridor" description="Collection performance against targets (MZN)" />
          <BarChart data={corridorPerformance.map((c) => ({ name: c.name, Target: c.target, Collected: c.collected }))} layout="vertical" height={260}>
            <Bar dataKey="Target" fill={COLORS.muted} radius={[0, 2, 2, 0]} barSize={8} />
            <Bar dataKey="Collected" fill={COLORS.primary} radius={[0, 2, 2, 0]} barSize={8} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </div>
      </section>

      {/* Revenue by Stream + Payment Channel */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-2" style={{ animationDelay: "0.15s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Revenue by Stream" description="Breakdown by revenue category over time" />
          <AreaChart data={revenueByStream} height={280}>
            <Area type="monotone" dataKey="Toll Charges" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
            <Area type="monotone" dataKey="MRUC Levy" stackId="1" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.3} />
            <Area type="monotone" dataKey="Congestion Surcharge" stackId="1" stroke={COLORS.gold} fill={COLORS.gold} fillOpacity={0.3} />
            <Area type="monotone" dataKey="Overweight Penalty" stackId="1" stroke={COLORS.slate} fill={COLORS.slate} fillOpacity={0.3} />
            <Area type="monotone" dataKey="Late Payment Fee" stackId="1" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.3} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </AreaChart>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Payment Channel Breakdown" description="Collections share by payment method" />
          <BarChart data={channelMix.map((c) => ({ name: c.channel, Amount: c.amount, Share: c.value }))} height={220}>
            <Bar dataKey="Amount" fill={COLORS.secondary} radius={[4, 4, 0, 0]} barSize={32} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
          <div className="mt-3 flex flex-wrap gap-3">
            {channelMix.map((c) => (
              <div key={c.channel} className="text-xs"><span className="font-medium">{c.channel}:</span> <span className="text-muted-foreground">{c.value}%</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* Throughput + Leakage + Forecast */}
      <section className="animate-in-section grid gap-4 lg:grid-cols-3" style={{ animationDelay: "0.2s" }}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Collection Throughput" description="Transactions by hour of day" />
          <BarChart data={hourlyThroughput.map((h) => ({ name: h.hour, Transactions: h.transactions }))} height={200}>
            <Bar dataKey="Transactions" fill={COLORS.primary} radius={[2, 2, 0, 0]} barSize={12} />
          </BarChart>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Leakage Risk" description="Unexplained variance between expected and actual" />
          <div className="space-y-2.5 mt-1">
            {leakageData.slice(0, 5).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="truncate font-medium">{c.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-14 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.variance}%`, backgroundColor: c.variance > 15 ? "#ef4444" : c.variance > 8 ? "#f59e0b" : "#22c55e" }} />
                  </div>
                  <span className={`text-xs font-medium w-8 text-right ${c.variance > 15 ? "text-destructive" : c.variance > 8 ? "text-warning" : "text-success"}`}>{c.variance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader title="Month-End Forecast" description="Projected vs target revenue" />
          <LineChart data={forecast} height={200}>
            <Line type="monotone" dataKey="actual" stroke={COLORS.primary} strokeWidth={2} dot={false} name="Actual" />
            <Line type="monotone" dataKey="projected" stroke={COLORS.primary} strokeWidth={2} strokeDasharray="6 3" dot={false} name="Projected" />
            <Line type="monotone" dataKey="target" stroke={COLORS.muted} strokeWidth={1} strokeDasharray="3 3" dot={false} name="Target" />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </LineChart>
        </div>
      </section>
    </div>
  )
}
