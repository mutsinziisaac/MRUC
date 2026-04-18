// ── Maputo MRUC Mock Data ──

export const corridors = [
  { id: "en1-sul", name: "EN1 Sul", district: "KaTembe" },
  { id: "en1-norte", name: "EN1 Norte", district: "Marracuene" },
  { id: "circular", name: "Circular de Maputo", district: "KaMpfumo" },
  { id: "julius-nyerere", name: "Av. Julius Nyerere", district: "KaMpfumo" },
  { id: "en2-matola", name: "EN2 Matola", district: "Matola" },
  { id: "marginal", name: "Av. Marginal", district: "KaMpfumo" },
  { id: "en4-machava", name: "EN4 Machava", district: "Machava" },
]

export const tollStations = [
  { id: "ts-01", name: "KaTembe Bridge Plaza", corridor: "en1-sul", devices: 12, lat: -26.05, lng: 32.45 },
  { id: "ts-02", name: "Marracuene Gate", corridor: "en1-norte", devices: 8, lat: -25.73, lng: 32.67 },
  { id: "ts-03", name: "Circular West Toll", corridor: "circular", devices: 10, lat: -25.95, lng: 32.55 },
  { id: "ts-04", name: "Nyerere Central", corridor: "julius-nyerere", devices: 6, lat: -25.97, lng: 32.58 },
  { id: "ts-05", name: "Matola Industrial Gate", corridor: "en2-matola", devices: 9, lat: -25.96, lng: 32.46 },
  { id: "ts-06", name: "Marginal Coastal", corridor: "marginal", devices: 5, lat: -25.98, lng: 32.60 },
  { id: "ts-07", name: "Machava Junction", corridor: "en4-machava", devices: 7, lat: -25.93, lng: 32.48 },
  { id: "ts-08", name: "EN1 Sul Secondary", corridor: "en1-sul", devices: 4, lat: -26.10, lng: 32.42 },
]

export const districts = ["KaTembe", "KaMpfumo", "Matola", "Machava", "Marracuene", "KaMavota", "KaMaxaqueni"]

export const paymentChannels = [
  { id: "mpesa", name: "M-Pesa", color: "#e11d48" },
  { id: "emola", name: "e-Mola", color: "#f59e0b" },
  { id: "card", name: "Visa / Mastercard", color: "#3b82f6" },
  { id: "bank", name: "Bank Transfer", color: "#6366f1" },
  { id: "cash", name: "Cash", color: "#78716c" },
]

export const revenueCategories = ["Toll Charges", "MRUC Levy", "Congestion Surcharge", "Overweight Penalty", "Late Payment Fee"]

export const enforcementTeams = [
  { id: "et-1", name: "Alpha Unit", zone: "KaTembe", members: 12 },
  { id: "et-2", name: "Bravo Unit", zone: "Matola", members: 10 },
  { id: "et-3", name: "Charlie Unit", zone: "KaMpfumo", members: 8 },
  { id: "et-4", name: "Delta Unit", zone: "Machava", members: 9 },
  { id: "et-5", name: "Echo Unit", zone: "Marracuene", members: 7 },
]

export const incidentTypes = ["System Outage", "Revenue Anomaly", "Compliance Drop", "Policy Breach", "Device Failure", "Security Alert"]

export const tariffBands = [
  { vehicleClass: "Light Vehicle (Class 1)", rate: 50, currency: "MZN" },
  { vehicleClass: "Medium Vehicle (Class 2)", rate: 100, currency: "MZN" },
  { vehicleClass: "Heavy Vehicle (Class 3)", rate: 200, currency: "MZN" },
  { vehicleClass: "Extra-Heavy (Class 4)", rate: 350, currency: "MZN" },
  { vehicleClass: "Bus / Public Transport", rate: 75, currency: "MZN" },
]

export const exemptionCategories = [
  { name: "Government Vehicles", count: 342, approvedBy: "Ministry of Transport" },
  { name: "Emergency Services", count: 128, approvedBy: "Ministry of Interior" },
  { name: "Diplomatic Corps", count: 67, approvedBy: "Ministry of Foreign Affairs" },
  { name: "Disabled Persons", count: 215, approvedBy: "Social Welfare Office" },
  { name: "Military / Defence", count: 89, approvedBy: "Ministry of Defence" },
]

export const userRoles = [
  { role: "Governor", permissions: "Full read access, executive reports, policy approval", users: 2 },
  { role: "Finance Officer", permissions: "Revenue data, collection reports, audit trail", users: 5 },
  { role: "Transport Admin", permissions: "Operations, compliance, enforcement oversight", users: 8 },
  { role: "Enforcement Lead", permissions: "Compliance data, team management, field reports", users: 4 },
  { role: "System Admin", permissions: "Configuration, alert thresholds, system health", users: 3 },
]

// ── Helper: seeded pseudo-random ──
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647
    return (seed - 1) / 2147483646
  }
}

// ── Time-series generators ──
const rand = seeded(42)

function genMonthly(base: number, variance: number, months: number) {
  return Array.from({ length: months }, (_, i) => {
    const month = new Date(2025, i, 1)
    const actual = Math.round(base + (rand() - 0.4) * variance)
    const target = Math.round(base * (1 + i * 0.01))
    return { month: month.toLocaleString("en", { month: "short" }), actual, target }
  })
}

export const monthlyRevenue = genMonthly(185_000_000, 40_000_000, 12)

export const dailyRevenue = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(2025, 0, 18 + i)
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    value: Math.round(5_800_000 + (rand() - 0.35) * 2_000_000),
  }
})

export const hourlyThroughput = Array.from({ length: 24 }, (_, h) => {
  const peak = h >= 6 && h <= 9 ? 1.8 : h >= 16 && h <= 19 ? 1.6 : 1
  return {
    hour: `${String(h).padStart(2, "0")}:00`,
    transactions: Math.round(420 * peak * (0.7 + rand() * 0.6)),
  }
})

export const complianceTrend = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2025, i, 1).toLocaleString("en", { month: "short" }),
  rate: Math.min(99, Math.round((88 + i * 0.6 + (rand() - 0.5) * 3) * 10) / 10),
  target: 95,
}))

export const corridorPerformance = corridors.map((c) => ({
  ...c,
  collected: Math.round(22_000_000 + rand() * 18_000_000),
  target: Math.round(28_000_000 + rand() * 8_000_000),
  compliance: Math.round(85 + rand() * 14),
  violations: Math.round(20 + rand() * 180),
}))

export const channelMix = [
  { channel: "M-Pesa", value: 42, amount: 78_540_000 },
  { channel: "e-Mola", value: 24, amount: 44_880_000 },
  { channel: "Visa / MC", value: 18, amount: 33_660_000 },
  { channel: "Bank Transfer", value: 11, amount: 20_570_000 },
  { channel: "Cash", value: 5, amount: 9_350_000 },
]

export const revenueByStream = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2025, i, 1).toLocaleString("en", { month: "short" }),
  "Toll Charges": Math.round(120_000_000 + rand() * 20_000_000),
  "MRUC Levy": Math.round(35_000_000 + rand() * 8_000_000),
  "Congestion Surcharge": Math.round(15_000_000 + rand() * 5_000_000),
  "Overweight Penalty": Math.round(8_000_000 + rand() * 4_000_000),
  "Late Payment Fee": Math.round(4_000_000 + rand() * 2_000_000),
}))

export const violationsByType = [
  { type: "Toll Evasion", count: 1243, trend: -5.2 },
  { type: "Expired Exemption", count: 387, trend: 12.1 },
  { type: "Overweight", count: 562, trend: -2.8 },
  { type: "Fraudulent Pass", count: 89, trend: -18.4 },
  { type: "Unpaid Surcharge", count: 234, trend: 3.7 },
]

export const enforcementPerformance = enforcementTeams.map((t) => ({
  ...t,
  inspections: Math.round(300 + rand() * 500),
  violations: Math.round(40 + rand() * 120),
  resolutionRate: Math.round(78 + rand() * 20),
}))

export const checkpointHealth = tollStations.map((ts) => ({
  ...ts,
  online: Math.round(ts.devices * (0.8 + rand() * 0.2)),
  offline: 0,
  lastHeartbeat: `${Math.round(1 + rand() * 15)} min ago`,
  status: rand() > 0.15 ? ("operational" as const) : ("degraded" as const),
}))
// fix offline count
checkpointHealth.forEach((c) => { c.offline = c.devices - c.online })

export const services = [
  { name: "Payment Gateway", uptime: 99.97, status: "operational" as const, lastIncident: "12 Mar 2025" },
  { name: "ANPR Cameras", uptime: 98.4, status: "degraded" as const, lastIncident: "16 Apr 2025" },
  { name: "Toll Barriers", uptime: 99.8, status: "operational" as const, lastIncident: "28 Feb 2025" },
  { name: "Mobile App", uptime: 99.95, status: "operational" as const, lastIncident: "05 Jan 2025" },
  { name: "Admin Portal", uptime: 99.99, status: "operational" as const, lastIncident: "10 Nov 2024" },
]

export const uptimeTrend = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2025, i, 1).toLocaleString("en", { month: "short" }),
  uptime: Math.min(100, Math.round((99.2 + rand() * 0.8) * 100) / 100),
}))

export const incidentsBySeverity = Array.from({ length: 6 }, (_, i) => ({
  week: `W${i + 12}`,
  Critical: Math.round(rand() * 3),
  High: Math.round(1 + rand() * 5),
  Medium: Math.round(3 + rand() * 8),
  Low: Math.round(5 + rand() * 12),
}))

export type AlertSeverity = "critical" | "high" | "medium" | "low"
export type AlertStatus = "unresolved" | "acknowledged" | "resolved"

export interface Alert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  status: AlertStatus
  category: string
  corridor: string
  assignedTo: string
  timestamp: string
  recommended: string
}

export const alerts: Alert[] = [
  { id: "ALT-001", title: "Revenue drop >15% at EN1 Sul", description: "Daily collections at KaTembe Bridge Plaza fell 17.3% below the 7-day moving average. Possible device malfunction or evasion spike.", severity: "critical", status: "unresolved", category: "Revenue Anomaly", corridor: "EN1 Sul", assignedTo: "Finance Office", timestamp: "18 Apr 2025, 09:14", recommended: "Dispatch field inspection team. Cross-reference ANPR logs with payment records." },
  { id: "ALT-002", title: "ANPR camera offline — Matola Industrial Gate", description: "Camera unit CAM-MTL-03 has been unresponsive for 4 hours. Backup unit active but coverage reduced.", severity: "high", status: "acknowledged", category: "Device Failure", corridor: "EN2 Matola", assignedTo: "IT Operations", timestamp: "18 Apr 2025, 07:42", recommended: "Schedule emergency maintenance. Verify backup camera feed quality." },
  { id: "ALT-003", title: "Compliance rate below threshold — Machava", description: "EN4 Machava corridor compliance dropped to 82.1%, below the 85% policy floor for 3 consecutive days.", severity: "high", status: "unresolved", category: "Compliance Drop", corridor: "EN4 Machava", assignedTo: "Enforcement Lead", timestamp: "17 Apr 2025, 16:30", recommended: "Increase enforcement presence. Review exemption claims for anomalies." },
  { id: "ALT-004", title: "Unusual exemption spike at Circular West", description: "Exemption claims increased 340% over baseline at Circular West Toll in the past 48 hours.", severity: "critical", status: "unresolved", category: "Policy Breach", corridor: "Circular de Maputo", assignedTo: "Compliance Office", timestamp: "17 Apr 2025, 14:15", recommended: "Freeze new exemption processing. Audit recent claims against registry." },
  { id: "ALT-005", title: "Payment gateway latency elevated", description: "Average transaction processing time increased to 2.8s (threshold: 2.0s). Affecting M-Pesa and e-Mola channels.", severity: "medium", status: "acknowledged", category: "System Outage", corridor: "All corridors", assignedTo: "IT Operations", timestamp: "17 Apr 2025, 11:20", recommended: "Monitor gateway provider SLA. Prepare fallback to offline collection mode." },
  { id: "ALT-006", title: "Overweight violations trending up — EN1 Norte", description: "Overweight vehicle detections increased 23% month-over-month at Marracuene Gate.", severity: "medium", status: "unresolved", category: "Compliance Drop", corridor: "EN1 Norte", assignedTo: "Transport Admin", timestamp: "16 Apr 2025, 09:45", recommended: "Coordinate with highway patrol. Consider temporary weigh station deployment." },
  { id: "ALT-007", title: "Scheduled maintenance — Toll Barrier firmware", description: "Firmware update v3.2.1 scheduled for all toll barrier controllers. Expected 15-minute downtime per station.", severity: "low", status: "acknowledged", category: "Device Failure", corridor: "All corridors", assignedTo: "IT Operations", timestamp: "16 Apr 2025, 08:00", recommended: "Proceed as scheduled during low-traffic window (02:00-04:00)." },
  { id: "ALT-008", title: "Cash collection variance at Marginal Coastal", description: "Cash receipts 8.2% below expected based on vehicle count. Possible reconciliation issue.", severity: "medium", status: "resolved", category: "Revenue Anomaly", corridor: "Av. Marginal", assignedTo: "Finance Office", timestamp: "15 Apr 2025, 17:30", recommended: "Completed: Manual reconciliation confirmed counting error. Corrected." },
  { id: "ALT-009", title: "New tariff policy pending activation", description: "Updated Class 4 tariff rates approved by Governor's office. Awaiting system activation.", severity: "low", status: "unresolved", category: "Policy Breach", corridor: "All corridors", assignedTo: "System Admin", timestamp: "15 Apr 2025, 10:00", recommended: "Schedule activation for next billing cycle start." },
  { id: "ALT-010", title: "Enforcement team understaffed — KaTembe", description: "Alpha Unit operating at 67% capacity due to leave schedule. Coverage gap on EN1 Sul secondary checkpoint.", severity: "medium", status: "unresolved", category: "Compliance Drop", corridor: "EN1 Sul", assignedTo: "Enforcement Lead", timestamp: "14 Apr 2025, 14:20", recommended: "Reassign personnel from Echo Unit temporarily." },
]

export interface AuditEntry {
  id: string
  action: string
  actor: string
  detail: string
  timestamp: string
  category: "config" | "alert" | "policy" | "user" | "system"
}

export const auditTrail: AuditEntry[] = [
  { id: "AUD-001", action: "Alert Acknowledged", actor: "J. Macamo", detail: "Acknowledged ALT-002: ANPR camera offline at Matola", timestamp: "18 Apr 2025, 08:15", category: "alert" },
  { id: "AUD-002", action: "Threshold Updated", actor: "S. Nhaca", detail: "Revenue drop alert threshold changed from 12% to 15%", timestamp: "18 Apr 2025, 07:30", category: "config" },
  { id: "AUD-003", action: "Report Generated", actor: "System", detail: "Weekly executive digest sent to Governor's office", timestamp: "17 Apr 2025, 18:00", category: "system" },
  { id: "AUD-004", action: "Policy Approved", actor: "Gov. A. Mondlane", detail: "Approved updated Class 4 tariff rates (MZN 350)", timestamp: "17 Apr 2025, 15:45", category: "policy" },
  { id: "AUD-005", action: "Alert Resolved", actor: "M. Tembe", detail: "Resolved ALT-008: Cash collection variance at Marginal Coastal", timestamp: "17 Apr 2025, 14:00", category: "alert" },
  { id: "AUD-006", action: "User Access Granted", actor: "S. Nhaca", detail: "Added F. Sitoe as Finance Officer with revenue read access", timestamp: "17 Apr 2025, 10:30", category: "user" },
  { id: "AUD-007", action: "Exemption Reviewed", actor: "L. Cossa", detail: "Bulk review of 23 expired diplomatic exemptions — 18 renewed, 5 revoked", timestamp: "16 Apr 2025, 16:00", category: "policy" },
  { id: "AUD-008", action: "Channel Toggled", actor: "S. Nhaca", detail: "Temporarily disabled cash payments at Machava Junction for reconciliation", timestamp: "16 Apr 2025, 11:00", category: "config" },
  { id: "AUD-009", action: "Maintenance Scheduled", actor: "IT Operations", detail: "Toll barrier firmware update v3.2.1 scheduled for 19 Apr 02:00-04:00", timestamp: "16 Apr 2025, 09:00", category: "system" },
  { id: "AUD-010", action: "Alert Created", actor: "System", detail: "Auto-generated ALT-004: Unusual exemption spike at Circular West", timestamp: "15 Apr 2025, 14:15", category: "alert" },
  { id: "AUD-011", action: "Enforcement Deployed", actor: "Capt. R. Bila", detail: "Deployed Delta Unit to EN4 Machava for compliance enforcement", timestamp: "15 Apr 2025, 08:00", category: "policy" },
  { id: "AUD-012", action: "Report Configuration", actor: "J. Macamo", detail: "Changed monthly report delivery from email to portal + email", timestamp: "14 Apr 2025, 16:30", category: "config" },
]

// ── Summary KPIs ──
export const kpis = {
  revenueToday: 6_247_000,
  revenueMTD: 187_000_000,
  revenueYTD: 2_180_000_000,
  collectionEfficiency: 94.2,
  complianceRate: 91.7,
  systemUptime: 99.87,
  openAlerts: alerts.filter((a) => a.status === "unresolved").length,
  avgTransactionValue: 82,
  avgLatency: 1.4,
  txSuccessRate: 99.6,
  avgResponseTime: 12,
  avgResolutionTime: 4.2,
}

// ── Forecast ──
export const forecast = Array.from({ length: 12 }, (_, i) => {
  const isProjected = i >= 8
  return {
    month: new Date(2025, i, 1).toLocaleString("en", { month: "short" }),
    actual: isProjected ? null : monthlyRevenue[i].actual,
    projected: isProjected ? Math.round(190_000_000 + rand() * 15_000_000) : null,
    target: monthlyRevenue[i].target,
  }
})

export const zoneStatus = [
  { zone: "KaTembe", status: "operational" as const, load: "Normal" },
  { zone: "Central Maputo", status: "operational" as const, load: "High" },
  { zone: "Matola", status: "degraded" as const, load: "Normal" },
  { zone: "Machava", status: "operational" as const, load: "Low" },
  { zone: "Marracuene", status: "operational" as const, load: "Normal" },
  { zone: "KaMavota", status: "operational" as const, load: "Normal" },
]

export const maintenanceHistory = [
  { date: "16 Apr 2025", event: "ANPR firmware update — EN2 Matola", duration: "45 min", type: "maintenance" as const },
  { date: "12 Apr 2025", event: "Payment gateway failover test", duration: "10 min", type: "maintenance" as const },
  { date: "08 Apr 2025", event: "Unplanned outage — Toll barrier controller EN1 Sul", duration: "2h 15min", type: "outage" as const },
  { date: "01 Apr 2025", event: "Scheduled database maintenance window", duration: "30 min", type: "maintenance" as const },
  { date: "22 Mar 2025", event: "Network switch replacement — Circular West", duration: "1h 20min", type: "maintenance" as const },
]

// ── Formatting helpers ──
export function fmtMZN(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B MZN`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M MZN`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K MZN`
  return `${value.toLocaleString()} MZN`
}

export function fmtNum(value: number): string {
  return value.toLocaleString("en")
}

export function fmtPct(value: number): string {
  return `${value.toFixed(1)}%`
}
