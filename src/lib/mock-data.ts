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

// ── Extended Mock Data ──
const rand2 = seeded(99)

export const geofenceZones = [
  { id: 'gz-01', name: 'KaTembe Toll Zone', type: 'toll-zone' as const, coordinates: [[-26.04,32.44],[-26.04,32.47],[-26.07,32.47],[-26.07,32.44]], color: '#3b82f6' },
  { id: 'gz-02', name: 'Ressano Garcia Border', type: 'border-zone' as const, coordinates: [[-25.74,32.10],[-25.74,32.14],[-25.77,32.14],[-25.77,32.10]], color: '#ef4444' },
  { id: 'gz-03', name: 'Maputo Port Restricted', type: 'restricted' as const, coordinates: [[-25.96,32.58],[-25.96,32.61],[-25.98,32.61],[-25.98,32.58]], color: '#f59e0b' },
  { id: 'gz-04', name: 'Matola Industrial Zone', type: 'toll-zone' as const, coordinates: [[-25.94,32.44],[-25.94,32.48],[-25.97,32.48],[-25.97,32.44]], color: '#10b981' },
  { id: 'gz-05', name: 'Catembe Restricted Area', type: 'restricted' as const, coordinates: [[-26.08,32.40],[-26.08,32.43],[-26.11,32.43],[-26.11,32.40]], color: '#8b5cf6' },
]

export const borderEntryPoints = [
  { id: 'bp-01', name: 'Ressano Garcia', lat: -25.75, lng: 32.12, type: 'road' as const, dailyVolume: 1840, status: 'operational' as const },
  { id: 'bp-02', name: 'Namaacha', lat: -26.04, lng: 32.02, type: 'road' as const, dailyVolume: 620, status: 'operational' as const },
  { id: 'bp-03', name: 'KaTembe-Catembe Bridge', lat: -26.05, lng: 32.45, type: 'bridge' as const, dailyVolume: 2350, status: 'operational' as const },
  { id: 'bp-04', name: 'Goba', lat: -26.20, lng: 32.00, type: 'road' as const, dailyVolume: 410, status: 'degraded' as const },
]

export const corridorRoutes = [
  { corridorId: 'en1-sul', coordinates: [[-25.97,32.57],[-26.00,32.52],[-26.03,32.47],[-26.07,32.44]] },
  { corridorId: 'en1-norte', coordinates: [[-25.97,32.57],[-25.90,32.60],[-25.82,32.64],[-25.73,32.67]] },
  { corridorId: 'circular', coordinates: [[-25.93,32.55],[-25.95,32.53],[-25.97,32.55],[-25.95,32.57],[-25.93,32.55]] },
  { corridorId: 'julius-nyerere', coordinates: [[-25.96,32.56],[-25.97,32.58],[-25.98,32.60]] },
  { corridorId: 'en2-matola', coordinates: [[-25.97,32.55],[-25.96,32.51],[-25.96,32.48],[-25.96,32.46]] },
  { corridorId: 'marginal', coordinates: [[-25.96,32.58],[-25.97,32.59],[-25.98,32.60],[-25.99,32.61]] },
  { corridorId: 'en4-machava', coordinates: [[-25.97,32.55],[-25.95,32.52],[-25.94,32.50],[-25.93,32.48]] },
]

export const activeTrips = [
  { id: 'TR-001', vehiclePlate: 'M-AB-12-CD', origin: 'KaTembe Bridge Plaza', destination: 'Marracuene Gate', status: 'in-transit' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 06:42', duration: '2h 15m', vehicleClass: 'Class 3', transporterName: 'Transmaritima Lda' },
  { id: 'TR-002', vehiclePlate: 'M-FG-34-HJ', origin: 'Matola Industrial Gate', destination: 'Machava Junction', status: 'completed' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 05:18', duration: '1h 42m', vehicleClass: 'Class 2', transporterName: 'Mocargo SA' },
  { id: 'TR-003', vehiclePlate: 'M-KL-56-MN', origin: 'Circular West Toll', destination: 'Nyerere Central', status: 'in-transit' as const, qrStatus: 'expired' as const, entryTime: '18 Apr 2025, 07:10', duration: '1h 47m', vehicleClass: 'Class 4', transporterName: 'Maputo Freight Corp' },
  { id: 'TR-004', vehiclePlate: 'M-PQ-78-RS', origin: 'Marginal Coastal', destination: 'KaTembe Bridge Plaza', status: 'auto-terminated' as const, qrStatus: 'not-scanned' as const, entryTime: '18 Apr 2025, 04:55', duration: '3h 52m', vehicleClass: 'Class 1', transporterName: 'Individual' },
  { id: 'TR-005', vehiclePlate: 'M-TU-90-VW', origin: 'EN1 Sul Secondary', destination: 'Matola Industrial Gate', status: 'in-transit' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 08:03', duration: '0h 54m', vehicleClass: 'Class 3', transporterName: 'Cornelder Moçambique' },
  { id: 'TR-006', vehiclePlate: 'M-XY-11-ZA', origin: 'Marracuene Gate', destination: 'Circular West Toll', status: 'completed' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 06:15', duration: '2h 30m', vehicleClass: 'Class 2', transporterName: 'Lalgy Transportes' },
  { id: 'TR-007', vehiclePlate: 'M-BC-22-DE', origin: 'Machava Junction', destination: 'Marginal Coastal', status: 'in-transit' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 07:48', duration: '1h 09m', vehicleClass: 'Class 1', transporterName: 'Individual' },
  { id: 'TR-008', vehiclePlate: 'M-FH-33-GK', origin: 'Nyerere Central', destination: 'EN1 Sul Secondary', status: 'in-transit' as const, qrStatus: 'expired' as const, entryTime: '18 Apr 2025, 06:58', duration: '1h 59m', vehicleClass: 'Class 4', transporterName: 'Bolloré Logistics MZ' },
  { id: 'TR-009', vehiclePlate: 'M-LM-44-NP', origin: 'KaTembe Bridge Plaza', destination: 'Machava Junction', status: 'completed' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 05:30', duration: '3h 10m', vehicleClass: 'Class 3', transporterName: 'Transmaritima Lda' },
  { id: 'TR-010', vehiclePlate: 'M-QR-55-ST', origin: 'Matola Industrial Gate', destination: 'Marracuene Gate', status: 'auto-terminated' as const, qrStatus: 'not-scanned' as const, entryTime: '18 Apr 2025, 04:20', duration: '4h 37m', vehicleClass: 'Class 2', transporterName: 'Mocargo SA' },
  { id: 'TR-011', vehiclePlate: 'M-UV-66-WX', origin: 'Circular West Toll', destination: 'KaTembe Bridge Plaza', status: 'in-transit' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 08:22', duration: '0h 35m', vehicleClass: 'Class 1', transporterName: 'Individual' },
  { id: 'TR-012', vehiclePlate: 'M-YZ-77-AB', origin: 'Marginal Coastal', destination: 'Nyerere Central', status: 'completed' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 07:00', duration: '1h 57m', vehicleClass: 'Class 3', transporterName: 'Maputo Freight Corp' },
  { id: 'TR-013', vehiclePlate: 'M-CD-88-EF', origin: 'EN1 Sul Secondary', destination: 'Circular West Toll', status: 'in-transit' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 08:40', duration: '0h 17m', vehicleClass: 'Class 2', transporterName: 'Cornelder Moçambique' },
  { id: 'TR-014', vehiclePlate: 'M-GH-99-IJ', origin: 'Marracuene Gate', destination: 'Matola Industrial Gate', status: 'in-transit' as const, qrStatus: 'expired' as const, entryTime: '18 Apr 2025, 07:35', duration: '1h 22m', vehicleClass: 'Class 4', transporterName: 'Lalgy Transportes' },
  { id: 'TR-015', vehiclePlate: 'M-KL-00-MN', origin: 'Machava Junction', destination: 'EN1 Sul Secondary', status: 'completed' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 06:05', duration: '2h 52m', vehicleClass: 'Class 1', transporterName: 'Bolloré Logistics MZ' },
]

export const qrValidationLogs = [
  { id: 'QR-001', tripId: 'TR-001', checkpoint: 'KaTembe Bridge Plaza', timestamp: '18 Apr 2025, 06:42', result: 'valid' as const, vehiclePlate: 'M-AB-12-CD' },
  { id: 'QR-002', tripId: 'TR-003', checkpoint: 'Circular West Toll', timestamp: '18 Apr 2025, 07:10', result: 'expired' as const, vehiclePlate: 'M-KL-56-MN' },
  { id: 'QR-003', tripId: 'TR-005', checkpoint: 'EN1 Sul Secondary', timestamp: '18 Apr 2025, 08:03', result: 'valid' as const, vehiclePlate: 'M-TU-90-VW' },
  { id: 'QR-004', tripId: 'TR-008', checkpoint: 'Nyerere Central', timestamp: '18 Apr 2025, 06:58', result: 'expired' as const, vehiclePlate: 'M-FH-33-GK' },
  { id: 'QR-005', tripId: 'TR-002', checkpoint: 'Matola Industrial Gate', timestamp: '18 Apr 2025, 05:18', result: 'valid' as const, vehiclePlate: 'M-FG-34-HJ' },
  { id: 'QR-006', tripId: 'TR-006', checkpoint: 'Marracuene Gate', timestamp: '18 Apr 2025, 06:15', result: 'valid' as const, vehiclePlate: 'M-XY-11-ZA' },
  { id: 'QR-007', tripId: 'TR-010', checkpoint: 'Matola Industrial Gate', timestamp: '18 Apr 2025, 04:20', result: 'invalid' as const, vehiclePlate: 'M-QR-55-ST' },
  { id: 'QR-008', tripId: 'TR-012', checkpoint: 'Marginal Coastal', timestamp: '18 Apr 2025, 07:00', result: 'valid' as const, vehiclePlate: 'M-YZ-77-AB' },
  { id: 'QR-009', tripId: 'TR-014', checkpoint: 'Marracuene Gate', timestamp: '18 Apr 2025, 07:35', result: 'expired' as const, vehiclePlate: 'M-GH-99-IJ' },
  { id: 'QR-010', tripId: 'TR-011', checkpoint: 'Circular West Toll', timestamp: '18 Apr 2025, 08:22', result: 'valid' as const, vehiclePlate: 'M-UV-66-WX' },
]

export const geofenceEvents = [
  { id: 'GE-001', tripId: 'TR-001', zone: 'KaTembe Toll Zone', eventType: 'entry' as const, timestamp: '18 Apr 2025, 06:42', vehiclePlate: 'M-AB-12-CD' },
  { id: 'GE-002', tripId: 'TR-001', zone: 'KaTembe Toll Zone', eventType: 'exit' as const, timestamp: '18 Apr 2025, 06:58', vehiclePlate: 'M-AB-12-CD' },
  { id: 'GE-003', tripId: 'TR-003', zone: 'Matola Industrial Zone', eventType: 'entry' as const, timestamp: '18 Apr 2025, 07:25', vehiclePlate: 'M-KL-56-MN' },
  { id: 'GE-004', tripId: 'TR-005', zone: 'Maputo Port Restricted', eventType: 'entry' as const, timestamp: '18 Apr 2025, 08:15', vehiclePlate: 'M-TU-90-VW' },
  { id: 'GE-005', tripId: 'TR-005', zone: 'Maputo Port Restricted', eventType: 'exit' as const, timestamp: '18 Apr 2025, 08:32', vehiclePlate: 'M-TU-90-VW' },
  { id: 'GE-006', tripId: 'TR-008', zone: 'Catembe Restricted Area', eventType: 'entry' as const, timestamp: '18 Apr 2025, 07:40', vehiclePlate: 'M-FH-33-GK' },
  { id: 'GE-007', tripId: 'TR-010', zone: 'Ressano Garcia Border', eventType: 'entry' as const, timestamp: '18 Apr 2025, 05:10', vehiclePlate: 'M-QR-55-ST' },
  { id: 'GE-008', tripId: 'TR-014', zone: 'Matola Industrial Zone', eventType: 'exit' as const, timestamp: '18 Apr 2025, 08:12', vehiclePlate: 'M-GH-99-IJ' },
]

export const emptyTruckDetections = [
  { id: 'ET-001', vehiclePlate: 'M-KL-56-MN', detectedAt: 'Matola Industrial Gate', timestamp: '18 Apr 2025, 07:30', asycudaRef: 'ASY-4821', chargeStatus: 'charged' as const, amount: 1500 },
  { id: 'ET-002', vehiclePlate: 'M-PQ-78-RS', detectedAt: 'KaTembe Bridge Plaza', timestamp: '18 Apr 2025, 05:02', asycudaRef: 'ASY-4799', chargeStatus: 'pending' as const, amount: 2000 },
  { id: 'ET-003', vehiclePlate: 'M-QR-55-ST', detectedAt: 'Marracuene Gate', timestamp: '18 Apr 2025, 04:35', asycudaRef: 'ASY-4810', chargeStatus: 'waived' as const, amount: 0 },
  { id: 'ET-004', vehiclePlate: 'M-GH-99-IJ', detectedAt: 'Machava Junction', timestamp: '17 Apr 2025, 16:20', asycudaRef: 'ASY-4765', chargeStatus: 'charged' as const, amount: 2500 },
  { id: 'ET-005', vehiclePlate: 'M-CD-88-EF', detectedAt: 'Circular West Toll', timestamp: '17 Apr 2025, 14:50', asycudaRef: 'ASY-4752', chargeStatus: 'pending' as const, amount: 1800 },
]

export const sctCargoShipments = [
  { id: 'SCT-001', vehiclePlate: 'M-AB-12-CD', cargoDesc: 'Aluminium ingots', customsStatus: 'cleared' as const, origin: 'South Africa', destination: 'Maputo Port', entryPoint: 'Ressano Garcia', timestamp: '18 Apr 2025, 06:00' },
  { id: 'SCT-002', vehiclePlate: 'M-FG-34-HJ', cargoDesc: 'Maize grain (bulk)', customsStatus: 'pending' as const, origin: 'Zimbabwe', destination: 'Matola Warehouse', entryPoint: 'Namaacha', timestamp: '17 Apr 2025, 22:15' },
  { id: 'SCT-003', vehiclePlate: 'M-TU-90-VW', cargoDesc: 'Petroleum products', customsStatus: 'cleared' as const, origin: 'Mozambique', destination: 'Eswatini', entryPoint: 'Goba', timestamp: '18 Apr 2025, 07:45' },
  { id: 'SCT-004', vehiclePlate: 'M-GH-99-IJ', cargoDesc: 'Construction steel', customsStatus: 'flagged' as const, origin: 'Tanzania', destination: 'Maputo Central', entryPoint: 'Ressano Garcia', timestamp: '17 Apr 2025, 18:30' },
  { id: 'SCT-005', vehiclePlate: 'M-YZ-77-AB', cargoDesc: 'Textile goods', customsStatus: 'cleared' as const, origin: 'South Africa', destination: 'Maputo Market', entryPoint: 'Ressano Garcia', timestamp: '18 Apr 2025, 05:50' },
]

export const registeredVehicles = [
  { id: 'RV-001', plate: 'M-AB-12-CD', ownerName: 'Carlos Machel', transporterName: 'Transmaritima Lda', vehicleClass: 'Class 3' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Mozambique' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-002', plate: 'M-FG-34-HJ', ownerName: 'Ana Sitoe', transporterName: 'Mocargo SA', vehicleClass: 'Class 2' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Mozambique' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-003', plate: 'M-KL-56-MN', ownerName: 'Jorge Tembe', transporterName: 'Maputo Freight Corp', vehicleClass: 'Class 4' as const, registrationStatus: 'active' as const, compliance: 'non-compliant' as const, countryOfOrigin: 'Mozambique' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-004', plate: 'ZA-GP-1234', ownerName: 'Pieter van Wyk', transporterName: 'SA Haulage Ltd', vehicleClass: 'Class 3' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'South Africa' as const, lastTripDate: '17 Apr 2025', isForeign: true },
  { id: 'RV-005', plate: 'M-PQ-78-RS', ownerName: 'Fatima Nhaca', transporterName: 'Individual', vehicleClass: 'Class 1' as const, registrationStatus: 'expired' as const, compliance: 'pending' as const, countryOfOrigin: 'Mozambique' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-006', plate: 'ZW-HRE-567', ownerName: 'Tendai Moyo', transporterName: 'Zim Trans Co', vehicleClass: 'Class 3' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Zimbabwe' as const, lastTripDate: '16 Apr 2025', isForeign: true },
  { id: 'RV-007', plate: 'M-TU-90-VW', ownerName: 'Roberto Cossa', transporterName: 'Cornelder Moçambique', vehicleClass: 'Class 3' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Mozambique' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-008', plate: 'TZ-DSM-890', ownerName: 'Amina Juma', transporterName: 'Dar Logistics', vehicleClass: 'Class 4' as const, registrationStatus: 'active' as const, compliance: 'non-compliant' as const, countryOfOrigin: 'Tanzania' as const, lastTripDate: '15 Apr 2025', isForeign: true },
  { id: 'RV-009', plate: 'M-XY-11-ZA', ownerName: 'Luisa Mondlane', transporterName: 'Lalgy Transportes', vehicleClass: 'Class 2' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Mozambique' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-010', plate: 'SD-MZ-234', ownerName: 'Sipho Dlamini', transporterName: 'Swazi Freight', vehicleClass: 'Class 2' as const, registrationStatus: 'suspended' as const, compliance: 'non-compliant' as const, countryOfOrigin: 'Eswatini' as const, lastTripDate: '10 Apr 2025', isForeign: true },
  { id: 'RV-011', plate: 'M-BC-22-DE', ownerName: 'Manuel Guambe', transporterName: 'Individual', vehicleClass: 'Class 1' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Mozambique' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-012', plate: 'M-FH-33-GK', ownerName: 'Helena Bila', transporterName: 'Bolloré Logistics MZ', vehicleClass: 'Class 4' as const, registrationStatus: 'active' as const, compliance: 'pending' as const, countryOfOrigin: 'Mozambique' as const, lastTripDate: '18 Apr 2025', isForeign: false },
]

export const transporters = [
  { id: 'TP-001', name: 'Transmaritima Lda', fleetSize: 48, activeVehicles: 41, complianceRate: 96, country: 'Mozambique', registeredSince: 'Mar 2018' },
  { id: 'TP-002', name: 'Mocargo SA', fleetSize: 35, activeVehicles: 30, complianceRate: 92, country: 'Mozambique', registeredSince: 'Jan 2019' },
  { id: 'TP-003', name: 'Maputo Freight Corp', fleetSize: 62, activeVehicles: 55, complianceRate: 88, country: 'Mozambique', registeredSince: 'Jun 2017' },
  { id: 'TP-004', name: 'Cornelder Moçambique', fleetSize: 80, activeVehicles: 72, complianceRate: 97, country: 'Mozambique', registeredSince: 'Feb 2016' },
  { id: 'TP-005', name: 'Lalgy Transportes', fleetSize: 28, activeVehicles: 24, complianceRate: 91, country: 'Mozambique', registeredSince: 'Sep 2020' },
  { id: 'TP-006', name: 'Bolloré Logistics MZ', fleetSize: 55, activeVehicles: 49, complianceRate: 94, country: 'France', registeredSince: 'Nov 2015' },
]

export const foreignVehiclesInMaputo = [
  { id: 'FV-001', plate: 'ZA-GP-1234', country: 'South Africa', vehicleClass: 'Class 3', entryPoint: 'Ressano Garcia', entryDate: '15 Apr 2025', expectedExit: '20 Apr 2025', status: 'in-transit' as const },
  { id: 'FV-002', plate: 'ZW-HRE-567', country: 'Zimbabwe', vehicleClass: 'Class 3', entryPoint: 'Namaacha', entryDate: '12 Apr 2025', expectedExit: '18 Apr 2025', status: 'overstay' as const },
  { id: 'FV-003', plate: 'TZ-DSM-890', country: 'Tanzania', vehicleClass: 'Class 4', entryPoint: 'Ressano Garcia', entryDate: '16 Apr 2025', expectedExit: '22 Apr 2025', status: 'in-transit' as const },
  { id: 'FV-004', plate: 'SD-MZ-234', country: 'Eswatini', vehicleClass: 'Class 2', entryPoint: 'Goba', entryDate: '08 Apr 2025', expectedExit: '14 Apr 2025', status: 'overstay' as const },
  { id: 'FV-005', plate: 'ZA-NW-5678', country: 'South Africa', vehicleClass: 'Class 4', entryPoint: 'Ressano Garcia', entryDate: '17 Apr 2025', expectedExit: '19 Apr 2025', status: 'in-transit' as const },
  { id: 'FV-006', plate: 'ZW-BYO-321', country: 'Zimbabwe', vehicleClass: 'Class 2', entryPoint: 'Namaacha', entryDate: '14 Apr 2025', expectedExit: '17 Apr 2025', status: 'cleared' as const },
  { id: 'FV-007', plate: 'ZA-LP-9012', country: 'South Africa', vehicleClass: 'Class 3', entryPoint: 'Ressano Garcia', entryDate: '16 Apr 2025', expectedExit: '21 Apr 2025', status: 'in-transit' as const },
  { id: 'FV-008', plate: 'TZ-ARU-456', country: 'Tanzania', vehicleClass: 'Class 3', entryPoint: 'Ressano Garcia', entryDate: '13 Apr 2025', expectedExit: '18 Apr 2025', status: 'cleared' as const },
]

export const registrationTrend = [
  { month: 'Jan', newRegistrations: 142, renewals: 89 },
  { month: 'Feb', newRegistrations: 118, renewals: 95 },
  { month: 'Mar', newRegistrations: 165, renewals: 102 },
  { month: 'Apr', newRegistrations: 153, renewals: 110 },
  { month: 'May', newRegistrations: 138, renewals: 98 },
  { month: 'Jun', newRegistrations: 127, renewals: 105 },
  { month: 'Jul', newRegistrations: 159, renewals: 112 },
  { month: 'Aug', newRegistrations: 171, renewals: 120 },
  { month: 'Sep', newRegistrations: 148, renewals: 108 },
  { month: 'Oct', newRegistrations: 162, renewals: 115 },
  { month: 'Nov', newRegistrations: 135, renewals: 99 },
  { month: 'Dec', newRegistrations: 110, renewals: 87 },
]

export const reconciliationRecords = [
  { id: 'REC-001', date: '18 Apr 2025', expected: 6_300_000, actual: 6_247_000, variance: -53_000, status: 'matched' as const, channel: 'M-Pesa' },
  { id: 'REC-002', date: '17 Apr 2025', expected: 5_900_000, actual: 5_920_000, variance: 20_000, status: 'matched' as const, channel: 'e-Mola' },
  { id: 'REC-003', date: '16 Apr 2025', expected: 4_200_000, actual: 3_850_000, variance: -350_000, status: 'unmatched' as const, channel: 'Cash' },
  { id: 'REC-004', date: '15 Apr 2025', expected: 3_100_000, actual: 3_100_000, variance: 0, status: 'matched' as const, channel: 'Visa / Mastercard' },
  { id: 'REC-005', date: '14 Apr 2025', expected: 2_800_000, actual: 2_650_000, variance: -150_000, status: 'under-review' as const, channel: 'Bank Transfer' },
  { id: 'REC-006', date: '13 Apr 2025', expected: 5_500_000, actual: 5_480_000, variance: -20_000, status: 'matched' as const, channel: 'M-Pesa' },
  { id: 'REC-007', date: '12 Apr 2025', expected: 4_800_000, actual: 4_200_000, variance: -600_000, status: 'unmatched' as const, channel: 'Cash' },
  { id: 'REC-008', date: '11 Apr 2025', expected: 3_600_000, actual: 3_590_000, variance: -10_000, status: 'matched' as const, channel: 'e-Mola' },
  { id: 'REC-009', date: '10 Apr 2025', expected: 2_900_000, actual: 2_750_000, variance: -150_000, status: 'under-review' as const, channel: 'Visa / Mastercard' },
  { id: 'REC-010', date: '09 Apr 2025', expected: 1_800_000, actual: 1_800_000, variance: 0, status: 'matched' as const, channel: 'Bank Transfer' },
]

export const remittanceLog = [
  { id: 'RM-001', timestamp: '18 Apr 2025, 10:00', amount: 4_500_000, channel: 'M-Pesa', status: 'completed' as const, reference: 'REM-8841' },
  { id: 'RM-002', timestamp: '17 Apr 2025, 10:00', amount: 3_200_000, channel: 'e-Mola', status: 'completed' as const, reference: 'REM-8832' },
  { id: 'RM-003', timestamp: '16 Apr 2025, 10:00', amount: 2_100_000, channel: 'Bank Transfer', status: 'completed' as const, reference: 'REM-8820' },
  { id: 'RM-004', timestamp: '15 Apr 2025, 10:00', amount: 5_800_000, channel: 'M-Pesa', status: 'completed' as const, reference: 'REM-8815' },
  { id: 'RM-005', timestamp: '14 Apr 2025, 10:00', amount: 1_900_000, channel: 'Visa / Mastercard', status: 'pending' as const, reference: 'REM-8807' },
  { id: 'RM-006', timestamp: '13 Apr 2025, 10:00', amount: 3_700_000, channel: 'e-Mola', status: 'completed' as const, reference: 'REM-8798' },
  { id: 'RM-007', timestamp: '12 Apr 2025, 10:00', amount: 2_400_000, channel: 'Cash', status: 'failed' as const, reference: 'REM-8790' },
  { id: 'RM-008', timestamp: '11 Apr 2025, 10:00', amount: 4_100_000, channel: 'Bank Transfer', status: 'completed' as const, reference: 'REM-8781' },
]

export const bankGuarantee = {
  amount: 500_000_000,
  utilized: 42_000_000,
  available: 458_000_000,
  expiryDate: '31 Dec 2025',
  status: 'active' as const,
  provider: 'Standard Bank Mozambique',
}

export const pppRevenueShare = Array.from({ length: 12 }, (_, i) => {
  const total = Math.round(160_000_000 + rand2() * 40_000_000)
  return {
    month: new Date(2025, i, 1).toLocaleString('en', { month: 'short' }),
    totalRevenue: total,
    municipalityShare: Math.round(total * 0.75),
    bsmartShare: Math.round(total * 0.25),
  }
})

export const asycudaIntegrationStatus = {
  status: 'connected' as const,
  lastSync: '18 Apr 2025, 09:30',
  recordsProcessed: 14_832,
  pendingRecords: 47,
  uptime: 99.4,
}

export const tenYearProjection = Array.from({ length: 10 }, (_, i) => {
  const projected = Math.round(1_260_000_000 * Math.pow(1.04, i))
  return {
    year: 2025 + i,
    projected,
    municipalityShare: Math.round(projected * 0.75),
    bsmartShare: Math.round(projected * 0.25),
  }
})