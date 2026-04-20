// ── Kampala MRUC Mock Data ──

export const corridors = [
  { id: "jinja-road", name: "Jinja Road", district: "Nakawa" },
  { id: "entebbe-road", name: "Entebbe Road", district: "Makindye" },
  { id: "northern-bypass", name: "Northern Bypass", district: "Kawempe" },
  { id: "bombo-road", name: "Bombo Road", district: "Central" },
  { id: "masaka-road", name: "Masaka Road", district: "Rubaga" },
  { id: "mityana-road", name: "Mityana Road", district: "Nansana" },
  { id: "gayaza-road", name: "Gayaza Road", district: "Kira" },
]

export const tollStations = [
  { id: "ts-01", name: "Nakawa Gate", corridor: "jinja-road", devices: 12, lat: 0.3310, lng: 32.6160 },
  { id: "ts-02", name: "Kajjansi Checkpoint", corridor: "entebbe-road", devices: 8, lat: 0.2120, lng: 32.5520 },
  { id: "ts-03", name: "Busega Plaza", corridor: "masaka-road", devices: 10, lat: 0.3070, lng: 32.5030 },
  { id: "ts-04", name: "Kalerwe Junction", corridor: "bombo-road", devices: 6, lat: 0.3630, lng: 32.5740 },
  { id: "ts-05", name: "Namanve Industrial Gate", corridor: "jinja-road", devices: 9, lat: 0.3550, lng: 32.6870 },
  { id: "ts-06", name: "Bombo Road Checkpoint", corridor: "bombo-road", devices: 5, lat: 0.3820, lng: 32.5680 },
  { id: "ts-07", name: "Gayaza Road Gate", corridor: "gayaza-road", devices: 7, lat: 0.4050, lng: 32.6110 },
  { id: "ts-08", name: "Kampala CBD Secondary", corridor: "northern-bypass", devices: 4, lat: 0.3476, lng: 32.5825 },
]

export const districts = ["Central", "Nakawa", "Makindye", "Kawempe", "Rubaga", "Nansana", "Kira"]

export const paymentChannels = [
  { id: "mtn-momo", name: "MTN MoMo", color: "#facc15" },
  { id: "airtel-money", name: "Airtel Money", color: "#e11d48" },
  { id: "card", name: "Visa / Mastercard", color: "#3b82f6" },
  { id: "bank", name: "Bank Transfer", color: "#6366f1" },
  { id: "cash", name: "Cash", color: "#78716c" },
]

export const revenueCategories = ["Toll Charges", "MRUC Levy", "Congestion Surcharge", "Overweight Penalty", "Late Payment Fee"]

export const enforcementTeams = [
  { id: "et-1", name: "Alpha Unit", zone: "Nakawa", members: 12 },
  { id: "et-2", name: "Bravo Unit", zone: "Makindye", members: 10 },
  { id: "et-3", name: "Charlie Unit", zone: "Central", members: 8 },
  { id: "et-4", name: "Delta Unit", zone: "Kawempe", members: 9 },
  { id: "et-5", name: "Echo Unit", zone: "Rubaga", members: 7 },
]

export const incidentTypes = ["System Outage", "Revenue Anomaly", "Compliance Drop", "Policy Breach", "Device Failure", "Security Alert"]

export const tariffBands = [
  { vehicleClass: "Light Vehicle (Class 1)", rate: 2000, currency: "UGX" },
  { vehicleClass: "Medium Vehicle (Class 2)", rate: 5000, currency: "UGX" },
  { vehicleClass: "Heavy Vehicle (Class 3)", rate: 10000, currency: "UGX" },
  { vehicleClass: "Extra-Heavy (Class 4)", rate: 15000, currency: "UGX" },
  { vehicleClass: "Bus / Public Transport", rate: 3000, currency: "UGX" },
]

export const exemptionCategories = [
  { name: "Government Vehicles", count: 342, approvedBy: "Ministry of Transport" },
  { name: "Emergency Services", count: 128, approvedBy: "Ministry of Interior" },
  { name: "Diplomatic Corps", count: 67, approvedBy: "Ministry of Foreign Affairs" },
  { name: "Disabled Persons", count: 215, approvedBy: "Social Welfare Office" },
  { name: "Military / Defence", count: 89, approvedBy: "Ministry of Defence" },
]

export const userRoles = [
  { role: "Executive Director", permissions: "Full read access, executive reports, policy approval", users: 2 },
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
  { channel: "MTN MoMo", value: 42, amount: 78_540_000 },
  { channel: "Airtel Money", value: 24, amount: 44_880_000 },
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
  { id: "ALT-001", title: "Revenue drop >15% at Jinja Road", description: "Daily collections at Nakawa Gate fell 17.3% below the 7-day moving average. Possible device malfunction or evasion spike.", severity: "critical", status: "unresolved", category: "Revenue Anomaly", corridor: "Jinja Road", assignedTo: "Finance Office", timestamp: "18 Apr 2025, 09:14", recommended: "Dispatch field inspection team. Cross-reference ANPR logs with payment records." },
  { id: "ALT-002", title: "ANPR camera offline at Namanve Industrial Gate", description: "Camera unit CAM-NMV-03 has been unresponsive for 4 hours. Backup unit active but coverage reduced.", severity: "high", status: "acknowledged", category: "Device Failure", corridor: "Jinja Road", assignedTo: "IT Operations", timestamp: "18 Apr 2025, 07:42", recommended: "Schedule emergency maintenance. Verify backup camera feed quality." },
  { id: "ALT-003", title: "Compliance rate below threshold on Bombo Road", description: "Bombo Road compliance dropped to 82.1%, below the 85% policy floor for 3 consecutive days.", severity: "high", status: "unresolved", category: "Compliance Drop", corridor: "Bombo Road", assignedTo: "Enforcement Lead", timestamp: "17 Apr 2025, 16:30", recommended: "Increase enforcement presence. Review exemption claims for anomalies." },
  { id: "ALT-004", title: "Unusual exemption spike at Busega Plaza", description: "Exemption claims increased 340% over baseline at Busega Plaza in the past 48 hours.", severity: "critical", status: "unresolved", category: "Policy Breach", corridor: "Masaka Road", assignedTo: "Compliance Office", timestamp: "17 Apr 2025, 14:15", recommended: "Freeze new exemption processing. Audit recent claims against registry." },
  { id: "ALT-005", title: "Payment gateway latency elevated", description: "Average transaction processing time increased to 2.8s (threshold: 2.0s). Affecting MTN MoMo and Airtel Money channels.", severity: "medium", status: "acknowledged", category: "System Outage", corridor: "All corridors", assignedTo: "IT Operations", timestamp: "17 Apr 2025, 11:20", recommended: "Monitor gateway provider SLA. Prepare fallback to offline collection mode." },
  { id: "ALT-006", title: "Overweight violations trending up on Entebbe Road", description: "Overweight vehicle detections increased 23% month-over-month at Kajjansi Checkpoint.", severity: "medium", status: "unresolved", category: "Compliance Drop", corridor: "Entebbe Road", assignedTo: "Transport Admin", timestamp: "16 Apr 2025, 09:45", recommended: "Coordinate with highway patrol. Consider temporary weigh station deployment." },
  { id: "ALT-007", title: "Scheduled maintenance — Toll Barrier firmware", description: "Firmware update v3.2.1 scheduled for all toll barrier controllers. Expected 15-minute downtime per station.", severity: "low", status: "acknowledged", category: "Device Failure", corridor: "All corridors", assignedTo: "IT Operations", timestamp: "16 Apr 2025, 08:00", recommended: "Proceed as scheduled during low-traffic window (02:00-04:00)." },
  { id: "ALT-008", title: "Cash collection variance at Gayaza Road Gate", description: "Cash receipts 8.2% below expected based on vehicle count. Possible reconciliation issue.", severity: "medium", status: "resolved", category: "Revenue Anomaly", corridor: "Gayaza Road", assignedTo: "Finance Office", timestamp: "15 Apr 2025, 17:30", recommended: "Completed: Manual reconciliation confirmed counting error. Corrected." },
  { id: "ALT-009", title: "New tariff policy pending activation", description: "Updated Class 4 tariff rates approved by KCCA leadership. Awaiting system activation.", severity: "low", status: "unresolved", category: "Policy Breach", corridor: "All corridors", assignedTo: "System Admin", timestamp: "15 Apr 2025, 10:00", recommended: "Schedule activation for next billing cycle start." },
  { id: "ALT-010", title: "Enforcement team understaffed in Nakawa", description: "Alpha Unit operating at 67% capacity due to leave schedule. Coverage gap at Nakawa Gate.", severity: "medium", status: "unresolved", category: "Compliance Drop", corridor: "Jinja Road", assignedTo: "Enforcement Lead", timestamp: "14 Apr 2025, 14:20", recommended: "Reassign personnel from Echo Unit temporarily." },
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
  { id: "AUD-001", action: "Alert Acknowledged", actor: "D. Ssekitoleko", detail: "Acknowledged ALT-002: ANPR camera offline at Namanve", timestamp: "18 Apr 2025, 08:15", category: "alert" },
  { id: "AUD-002", action: "Threshold Updated", actor: "S. Nakato", detail: "Revenue drop alert threshold changed from 12% to 15%", timestamp: "18 Apr 2025, 07:30", category: "config" },
  { id: "AUD-003", action: "Report Generated", actor: "System", detail: "Weekly executive digest sent to KCCA leadership", timestamp: "17 Apr 2025, 18:00", category: "system" },
  { id: "AUD-004", action: "Policy Approved", actor: "Dir. G. Akello", detail: "Approved updated Class 4 tariff rates (UGX 15,000)", timestamp: "17 Apr 2025, 15:45", category: "policy" },
  { id: "AUD-005", action: "Alert Resolved", actor: "P. Kato", detail: "Resolved ALT-008: Cash collection variance at Gayaza Road Gate", timestamp: "17 Apr 2025, 14:00", category: "alert" },
  { id: "AUD-006", action: "User Access Granted", actor: "S. Nakato", detail: "Added R. Nansubuga as Finance Officer with revenue read access", timestamp: "17 Apr 2025, 10:30", category: "user" },
  { id: "AUD-007", action: "Exemption Reviewed", actor: "M. Okello", detail: "Bulk review of 23 expired diplomatic exemptions — 18 renewed, 5 revoked", timestamp: "16 Apr 2025, 16:00", category: "policy" },
  { id: "AUD-008", action: "Channel Toggled", actor: "S. Nakato", detail: "Temporarily disabled cash payments at Kalerwe Junction for reconciliation", timestamp: "16 Apr 2025, 11:00", category: "config" },
  { id: "AUD-009", action: "Maintenance Scheduled", actor: "IT Operations", detail: "Toll barrier firmware update v3.2.1 scheduled for 19 Apr 02:00-04:00", timestamp: "16 Apr 2025, 09:00", category: "system" },
  { id: "AUD-010", action: "Alert Created", actor: "System", detail: "Auto-generated ALT-004: Unusual exemption spike at Busega Plaza", timestamp: "15 Apr 2025, 14:15", category: "alert" },
  { id: "AUD-011", action: "Enforcement Deployed", actor: "Capt. A. Namusoke", detail: "Deployed Delta Unit to Bombo Road for compliance enforcement", timestamp: "15 Apr 2025, 08:00", category: "policy" },
  { id: "AUD-012", action: "Report Configuration", actor: "D. Ssekitoleko", detail: "Changed monthly report delivery from email to portal + email", timestamp: "14 Apr 2025, 16:30", category: "config" },
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
  avgTransactionValue: 5_200,
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
  { zone: "Nakawa", status: "operational" as const, load: "Normal" },
  { zone: "Central Kampala", status: "operational" as const, load: "High" },
  { zone: "Makindye", status: "degraded" as const, load: "Normal" },
  { zone: "Kawempe", status: "operational" as const, load: "Low" },
  { zone: "Rubaga", status: "operational" as const, load: "Normal" },
  { zone: "Kira", status: "operational" as const, load: "Normal" },
]

export const maintenanceHistory = [
  { date: "16 Apr 2025", event: "ANPR firmware update at Namanve Industrial Gate", duration: "45 min", type: "maintenance" as const },
  { date: "12 Apr 2025", event: "Payment gateway failover test", duration: "10 min", type: "maintenance" as const },
  { date: "08 Apr 2025", event: "Unplanned outage at Nakawa Gate toll barrier controller", duration: "2h 15min", type: "outage" as const },
  { date: "01 Apr 2025", event: "Scheduled database maintenance window", duration: "30 min", type: "maintenance" as const },
  { date: "22 Mar 2025", event: "Network switch replacement at Busega Plaza", duration: "1h 20min", type: "maintenance" as const },
]

// ── Formatting helpers ──
export function fmtUGX(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B UGX`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M UGX`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K UGX`
  return `${value.toLocaleString()} UGX`
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
  { id: 'gz-01', name: 'Nakawa Toll Zone', type: 'toll-zone' as const, coordinates: [[0.325,32.608],[0.325,32.625],[0.338,32.625],[0.338,32.608]], color: '#3b82f6' },
  { id: 'gz-02', name: 'Malaba Border Corridor', type: 'border-zone' as const, coordinates: [[0.625,34.245],[0.625,34.285],[0.655,34.285],[0.655,34.245]], color: '#ef4444' },
  { id: 'gz-03', name: 'Kampala ICD Restricted', type: 'restricted' as const, coordinates: [[0.335,32.595],[0.335,32.612],[0.348,32.612],[0.348,32.595]], color: '#f59e0b' },
  { id: 'gz-04', name: 'Namanve Industrial Zone', type: 'toll-zone' as const, coordinates: [[0.348,32.675],[0.348,32.700],[0.366,32.700],[0.366,32.675]], color: '#10b981' },
  { id: 'gz-05', name: 'Kampala CBD Restricted Area', type: 'restricted' as const, coordinates: [[0.312,32.570],[0.312,32.590],[0.325,32.590],[0.325,32.570]], color: '#8b5cf6' },
]

export const borderEntryPoints = [
  { id: 'bp-01', name: 'Malaba', lat: 0.635, lng: 34.276, type: 'road' as const, dailyVolume: 1840, status: 'operational' as const },
  { id: 'bp-02', name: 'Busia', lat: 0.465, lng: 34.092, type: 'road' as const, dailyVolume: 620, status: 'operational' as const },
  { id: 'bp-03', name: 'Mutukula', lat: -1.003, lng: 31.420, type: 'road' as const, dailyVolume: 2350, status: 'operational' as const },
  { id: 'bp-04', name: 'Katuna', lat: -1.421, lng: 29.993, type: 'road' as const, dailyVolume: 410, status: 'degraded' as const },
]

export const corridorRoutes = [
  { corridorId: 'jinja-road', coordinates: [[0.3476,32.5825],[0.3310,32.6160],[0.3480,32.6500],[0.3550,32.6870]] },
  { corridorId: 'entebbe-road', coordinates: [[0.3476,32.5825],[0.3050,32.5700],[0.2600,32.5600],[0.2120,32.5520]] },
  { corridorId: 'northern-bypass', coordinates: [[0.3830,32.5200],[0.3950,32.5600],[0.3880,32.6000],[0.3760,32.6450]] },
  { corridorId: 'bombo-road', coordinates: [[0.3476,32.5825],[0.3630,32.5740],[0.3820,32.5680],[0.4100,32.5600]] },
  { corridorId: 'masaka-road', coordinates: [[0.3476,32.5825],[0.3250,32.5450],[0.3070,32.5030],[0.2920,32.4700]] },
  { corridorId: 'mityana-road', coordinates: [[0.3476,32.5825],[0.3350,32.5350],[0.3250,32.4980],[0.3160,32.4550]] },
  { corridorId: 'gayaza-road', coordinates: [[0.3476,32.5825],[0.3700,32.5950],[0.3900,32.6040],[0.4050,32.6110]] },
]

export const activeTrips = [
  { id: 'TR-001', vehiclePlate: 'UAX 123B', origin: 'Nakawa Gate', destination: 'Kajjansi Checkpoint', status: 'in-transit' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 06:42', duration: '2h 15m', vehicleClass: 'Class 3', transporterName: 'Kampala Freight Ltd' },
  { id: 'TR-002', vehiclePlate: 'UBG 456C', origin: 'Namanve Industrial Gate', destination: 'Kalerwe Junction', status: 'completed' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 05:18', duration: '1h 42m', vehicleClass: 'Class 2', transporterName: 'Nile Cargo Logistics' },
  { id: 'TR-003', vehiclePlate: 'UAZ 789D', origin: 'Busega Plaza', destination: 'Kampala CBD Secondary', status: 'in-transit' as const, qrStatus: 'expired' as const, entryTime: '18 Apr 2025, 07:10', duration: '1h 47m', vehicleClass: 'Class 4', transporterName: 'Uganda Hauliers' },
  { id: 'TR-004', vehiclePlate: 'UAY 234E', origin: 'Gayaza Road Gate', destination: 'Nakawa Gate', status: 'auto-terminated' as const, qrStatus: 'not-scanned' as const, entryTime: '18 Apr 2025, 04:55', duration: '3h 52m', vehicleClass: 'Class 1', transporterName: 'Individual' },
  { id: 'TR-005', vehiclePlate: 'UBJ 901F', origin: 'Kampala CBD Secondary', destination: 'Namanve Industrial Gate', status: 'in-transit' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 08:03', duration: '0h 54m', vehicleClass: 'Class 3', transporterName: 'Namanve Logistics' },
  { id: 'TR-006', vehiclePlate: 'UBD 345G', origin: 'Kajjansi Checkpoint', destination: 'Busega Plaza', status: 'completed' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 06:15', duration: '2h 30m', vehicleClass: 'Class 2', transporterName: 'Pearl Transporters' },
  { id: 'TR-007', vehiclePlate: 'UAW 678H', origin: 'Kalerwe Junction', destination: 'Gayaza Road Gate', status: 'in-transit' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 07:48', duration: '1h 09m', vehicleClass: 'Class 1', transporterName: 'Individual' },
  { id: 'TR-008', vehiclePlate: 'UBK 112J', origin: 'Kampala CBD Secondary', destination: 'Nakawa Gate', status: 'in-transit' as const, qrStatus: 'expired' as const, entryTime: '18 Apr 2025, 06:58', duration: '1h 59m', vehicleClass: 'Class 4', transporterName: 'Bollore Logistics Uganda' },
  { id: 'TR-009', vehiclePlate: 'UAQ 334K', origin: 'Nakawa Gate', destination: 'Kalerwe Junction', status: 'completed' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 05:30', duration: '3h 10m', vehicleClass: 'Class 3', transporterName: 'Kampala Freight Ltd' },
  { id: 'TR-010', vehiclePlate: 'UBM 556L', origin: 'Namanve Industrial Gate', destination: 'Kajjansi Checkpoint', status: 'auto-terminated' as const, qrStatus: 'not-scanned' as const, entryTime: '18 Apr 2025, 04:20', duration: '4h 37m', vehicleClass: 'Class 2', transporterName: 'Nile Cargo Logistics' },
  { id: 'TR-011', vehiclePlate: 'UAS 778M', origin: 'Busega Plaza', destination: 'Nakawa Gate', status: 'in-transit' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 08:22', duration: '0h 35m', vehicleClass: 'Class 1', transporterName: 'Individual' },
  { id: 'TR-012', vehiclePlate: 'UBN 990N', origin: 'Gayaza Road Gate', destination: 'Kampala CBD Secondary', status: 'completed' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 07:00', duration: '1h 57m', vehicleClass: 'Class 3', transporterName: 'Uganda Hauliers' },
  { id: 'TR-013', vehiclePlate: 'UAT 221P', origin: 'Kampala CBD Secondary', destination: 'Busega Plaza', status: 'in-transit' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 08:40', duration: '0h 17m', vehicleClass: 'Class 2', transporterName: 'Namanve Logistics' },
  { id: 'TR-014', vehiclePlate: 'UBP 443Q', origin: 'Kajjansi Checkpoint', destination: 'Namanve Industrial Gate', status: 'in-transit' as const, qrStatus: 'expired' as const, entryTime: '18 Apr 2025, 07:35', duration: '1h 22m', vehicleClass: 'Class 4', transporterName: 'Pearl Transporters' },
  { id: 'TR-015', vehiclePlate: 'UAV 665R', origin: 'Kalerwe Junction', destination: 'Kampala CBD Secondary', status: 'completed' as const, qrStatus: 'valid' as const, entryTime: '18 Apr 2025, 06:05', duration: '2h 52m', vehicleClass: 'Class 1', transporterName: 'Bollore Logistics Uganda' },
]

export const qrValidationLogs = [
  { id: 'QR-001', tripId: 'TR-001', checkpoint: 'Nakawa Gate', timestamp: '18 Apr 2025, 06:42', result: 'valid' as const, vehiclePlate: 'UAX 123B' },
  { id: 'QR-002', tripId: 'TR-003', checkpoint: 'Busega Plaza', timestamp: '18 Apr 2025, 07:10', result: 'expired' as const, vehiclePlate: 'UAZ 789D' },
  { id: 'QR-003', tripId: 'TR-005', checkpoint: 'Kampala CBD Secondary', timestamp: '18 Apr 2025, 08:03', result: 'valid' as const, vehiclePlate: 'UBJ 901F' },
  { id: 'QR-004', tripId: 'TR-008', checkpoint: 'Kampala CBD Secondary', timestamp: '18 Apr 2025, 06:58', result: 'expired' as const, vehiclePlate: 'UBK 112J' },
  { id: 'QR-005', tripId: 'TR-002', checkpoint: 'Namanve Industrial Gate', timestamp: '18 Apr 2025, 05:18', result: 'valid' as const, vehiclePlate: 'UBG 456C' },
  { id: 'QR-006', tripId: 'TR-006', checkpoint: 'Kajjansi Checkpoint', timestamp: '18 Apr 2025, 06:15', result: 'valid' as const, vehiclePlate: 'UBD 345G' },
  { id: 'QR-007', tripId: 'TR-010', checkpoint: 'Namanve Industrial Gate', timestamp: '18 Apr 2025, 04:20', result: 'invalid' as const, vehiclePlate: 'UBM 556L' },
  { id: 'QR-008', tripId: 'TR-012', checkpoint: 'Gayaza Road Gate', timestamp: '18 Apr 2025, 07:00', result: 'valid' as const, vehiclePlate: 'UBN 990N' },
  { id: 'QR-009', tripId: 'TR-014', checkpoint: 'Kajjansi Checkpoint', timestamp: '18 Apr 2025, 07:35', result: 'expired' as const, vehiclePlate: 'UBP 443Q' },
  { id: 'QR-010', tripId: 'TR-011', checkpoint: 'Busega Plaza', timestamp: '18 Apr 2025, 08:22', result: 'valid' as const, vehiclePlate: 'UAS 778M' },
]

export const geofenceEvents = [
  { id: 'GE-001', tripId: 'TR-001', zone: 'Nakawa Toll Zone', eventType: 'entry' as const, timestamp: '18 Apr 2025, 06:42', vehiclePlate: 'UAX 123B' },
  { id: 'GE-002', tripId: 'TR-001', zone: 'Nakawa Toll Zone', eventType: 'exit' as const, timestamp: '18 Apr 2025, 06:58', vehiclePlate: 'UAX 123B' },
  { id: 'GE-003', tripId: 'TR-003', zone: 'Namanve Industrial Zone', eventType: 'entry' as const, timestamp: '18 Apr 2025, 07:25', vehiclePlate: 'UAZ 789D' },
  { id: 'GE-004', tripId: 'TR-005', zone: 'Kampala ICD Restricted', eventType: 'entry' as const, timestamp: '18 Apr 2025, 08:15', vehiclePlate: 'UBJ 901F' },
  { id: 'GE-005', tripId: 'TR-005', zone: 'Kampala ICD Restricted', eventType: 'exit' as const, timestamp: '18 Apr 2025, 08:32', vehiclePlate: 'UBJ 901F' },
  { id: 'GE-006', tripId: 'TR-008', zone: 'Kampala CBD Restricted Area', eventType: 'entry' as const, timestamp: '18 Apr 2025, 07:40', vehiclePlate: 'UBK 112J' },
  { id: 'GE-007', tripId: 'TR-010', zone: 'Malaba Border Corridor', eventType: 'entry' as const, timestamp: '18 Apr 2025, 05:10', vehiclePlate: 'UBM 556L' },
  { id: 'GE-008', tripId: 'TR-014', zone: 'Namanve Industrial Zone', eventType: 'exit' as const, timestamp: '18 Apr 2025, 08:12', vehiclePlate: 'UBP 443Q' },
]

export const emptyTruckDetections = [
  { id: 'ET-001', vehiclePlate: 'UAZ 789D', detectedAt: 'Namanve Industrial Gate', timestamp: '18 Apr 2025, 07:30', asycudaRef: 'UGA-4821', chargeStatus: 'charged' as const, amount: 15000 },
  { id: 'ET-002', vehiclePlate: 'UAY 234E', detectedAt: 'Nakawa Gate', timestamp: '18 Apr 2025, 05:02', asycudaRef: 'UGA-4799', chargeStatus: 'pending' as const, amount: 20000 },
  { id: 'ET-003', vehiclePlate: 'UBM 556L', detectedAt: 'Kajjansi Checkpoint', timestamp: '18 Apr 2025, 04:35', asycudaRef: 'UGA-4810', chargeStatus: 'waived' as const, amount: 0 },
  { id: 'ET-004', vehiclePlate: 'UBP 443Q', detectedAt: 'Kalerwe Junction', timestamp: '17 Apr 2025, 16:20', asycudaRef: 'UGA-4765', chargeStatus: 'charged' as const, amount: 25000 },
  { id: 'ET-005', vehiclePlate: 'UAT 221P', detectedAt: 'Busega Plaza', timestamp: '17 Apr 2025, 14:50', asycudaRef: 'UGA-4752', chargeStatus: 'pending' as const, amount: 18000 },
]

export const sctCargoShipments = [
  { id: 'SCT-001', vehiclePlate: 'UAX 123B', cargoDesc: 'Aluminium ingots', customsStatus: 'cleared' as const, origin: 'Kenya', destination: 'Kampala ICD', entryPoint: 'Malaba', timestamp: '18 Apr 2025, 06:00' },
  { id: 'SCT-002', vehiclePlate: 'UBG 456C', cargoDesc: 'Maize grain (bulk)', customsStatus: 'pending' as const, origin: 'Tanzania', destination: 'Namanve Warehouse', entryPoint: 'Mutukula', timestamp: '17 Apr 2025, 22:15' },
  { id: 'SCT-003', vehiclePlate: 'UBJ 901F', cargoDesc: 'Petroleum products', customsStatus: 'cleared' as const, origin: 'Uganda', destination: 'Rwanda', entryPoint: 'Katuna', timestamp: '18 Apr 2025, 07:45' },
  { id: 'SCT-004', vehiclePlate: 'UBP 443Q', cargoDesc: 'Construction steel', customsStatus: 'flagged' as const, origin: 'Kenya', destination: 'Kampala Central', entryPoint: 'Busia', timestamp: '17 Apr 2025, 18:30' },
  { id: 'SCT-005', vehiclePlate: 'UBN 990N', cargoDesc: 'Textile goods', customsStatus: 'cleared' as const, origin: 'Tanzania', destination: 'Busega Market', entryPoint: 'Mutukula', timestamp: '18 Apr 2025, 05:50' },
]

export const registeredVehicles = [
  { id: 'RV-001', plate: 'UAX 123B', ownerName: 'David Ssekitoleko', transporterName: 'Kampala Freight Ltd', vehicleClass: 'Class 3' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Uganda' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-002', plate: 'UBG 456C', ownerName: 'Sarah Nakato', transporterName: 'Nile Cargo Logistics', vehicleClass: 'Class 2' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Uganda' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-003', plate: 'UAZ 789D', ownerName: 'Grace Akello', transporterName: 'Uganda Hauliers', vehicleClass: 'Class 4' as const, registrationStatus: 'active' as const, compliance: 'non-compliant' as const, countryOfOrigin: 'Uganda' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-004', plate: 'KDA 123P', ownerName: 'Peter Mwangi', transporterName: 'Kenya Haulage Ltd', vehicleClass: 'Class 3' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Kenya' as const, lastTripDate: '17 Apr 2025', isForeign: true },
  { id: 'RV-005', plate: 'UAY 234E', ownerName: 'Peter Kato', transporterName: 'Individual', vehicleClass: 'Class 1' as const, registrationStatus: 'expired' as const, compliance: 'pending' as const, countryOfOrigin: 'Uganda' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-006', plate: 'SSD 567A', ownerName: 'Deng Garang', transporterName: 'Juba Transit Co', vehicleClass: 'Class 3' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'South Sudan' as const, lastTripDate: '16 Apr 2025', isForeign: true },
  { id: 'RV-007', plate: 'UBJ 901F', ownerName: 'Amina Namusoke', transporterName: 'Namanve Logistics', vehicleClass: 'Class 3' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Uganda' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-008', plate: 'T 890 DDD', ownerName: 'Amina Juma', transporterName: 'Dar Logistics', vehicleClass: 'Class 4' as const, registrationStatus: 'active' as const, compliance: 'non-compliant' as const, countryOfOrigin: 'Tanzania' as const, lastTripDate: '15 Apr 2025', isForeign: true },
  { id: 'RV-009', plate: 'UBD 345G', ownerName: 'Moses Okello', transporterName: 'Pearl Transporters', vehicleClass: 'Class 2' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Uganda' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-010', plate: 'RAB 234K', ownerName: 'Jean Niyonzima', transporterName: 'Kigali Freight', vehicleClass: 'Class 2' as const, registrationStatus: 'suspended' as const, compliance: 'non-compliant' as const, countryOfOrigin: 'Rwanda' as const, lastTripDate: '10 Apr 2025', isForeign: true },
  { id: 'RV-011', plate: 'UAW 678H', ownerName: 'Ruth Nansubuga', transporterName: 'Individual', vehicleClass: 'Class 1' as const, registrationStatus: 'active' as const, compliance: 'compliant' as const, countryOfOrigin: 'Uganda' as const, lastTripDate: '18 Apr 2025', isForeign: false },
  { id: 'RV-012', plate: 'UBK 112J', ownerName: 'Joseph Muwanga', transporterName: 'Bollore Logistics Uganda', vehicleClass: 'Class 4' as const, registrationStatus: 'active' as const, compliance: 'pending' as const, countryOfOrigin: 'Uganda' as const, lastTripDate: '18 Apr 2025', isForeign: false },
]

export const transporters = [
  { id: 'TP-001', name: 'Kampala Freight Ltd', fleetSize: 48, activeVehicles: 41, complianceRate: 96, country: 'Uganda', registeredSince: 'Mar 2018' },
  { id: 'TP-002', name: 'Nile Cargo Logistics', fleetSize: 35, activeVehicles: 30, complianceRate: 92, country: 'Uganda', registeredSince: 'Jan 2019' },
  { id: 'TP-003', name: 'Uganda Hauliers', fleetSize: 62, activeVehicles: 55, complianceRate: 88, country: 'Uganda', registeredSince: 'Jun 2017' },
  { id: 'TP-004', name: 'Namanve Logistics', fleetSize: 80, activeVehicles: 72, complianceRate: 97, country: 'Uganda', registeredSince: 'Feb 2016' },
  { id: 'TP-005', name: 'Pearl Transporters', fleetSize: 28, activeVehicles: 24, complianceRate: 91, country: 'Uganda', registeredSince: 'Sep 2020' },
  { id: 'TP-006', name: 'Bollore Logistics Uganda', fleetSize: 55, activeVehicles: 49, complianceRate: 94, country: 'France', registeredSince: 'Nov 2015' },
]

export const foreignVehiclesInUganda = [
  { id: 'FV-001', plate: 'KDA 123P', country: 'Kenya', vehicleClass: 'Class 3', entryPoint: 'Malaba', entryDate: '15 Apr 2025', expectedExit: '20 Apr 2025', status: 'in-transit' as const },
  { id: 'FV-002', plate: 'SSD 567A', country: 'South Sudan', vehicleClass: 'Class 3', entryPoint: 'Busia', entryDate: '12 Apr 2025', expectedExit: '18 Apr 2025', status: 'overstay' as const },
  { id: 'FV-003', plate: 'T 890 DDD', country: 'Tanzania', vehicleClass: 'Class 4', entryPoint: 'Mutukula', entryDate: '16 Apr 2025', expectedExit: '22 Apr 2025', status: 'in-transit' as const },
  { id: 'FV-004', plate: 'RAB 234K', country: 'Rwanda', vehicleClass: 'Class 2', entryPoint: 'Katuna', entryDate: '08 Apr 2025', expectedExit: '14 Apr 2025', status: 'overstay' as const },
  { id: 'FV-005', plate: 'KCB 567T', country: 'Kenya', vehicleClass: 'Class 4', entryPoint: 'Malaba', entryDate: '17 Apr 2025', expectedExit: '19 Apr 2025', status: 'in-transit' as const },
  { id: 'FV-006', plate: 'CGO 321B', country: 'DR Congo', vehicleClass: 'Class 2', entryPoint: 'Mpondwe', entryDate: '14 Apr 2025', expectedExit: '17 Apr 2025', status: 'cleared' as const },
  { id: 'FV-007', plate: 'KDE 901S', country: 'Kenya', vehicleClass: 'Class 3', entryPoint: 'Busia', entryDate: '16 Apr 2025', expectedExit: '21 Apr 2025', status: 'in-transit' as const },
  { id: 'FV-008', plate: 'T 456 ABC', country: 'Tanzania', vehicleClass: 'Class 3', entryPoint: 'Mutukula', entryDate: '13 Apr 2025', expectedExit: '18 Apr 2025', status: 'cleared' as const },
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
  { id: 'REC-001', date: '18 Apr 2025', expected: 6_300_000, actual: 6_247_000, variance: -53_000, status: 'matched' as const, channel: 'MTN MoMo' },
  { id: 'REC-002', date: '17 Apr 2025', expected: 5_900_000, actual: 5_920_000, variance: 20_000, status: 'matched' as const, channel: 'Airtel Money' },
  { id: 'REC-003', date: '16 Apr 2025', expected: 4_200_000, actual: 3_850_000, variance: -350_000, status: 'unmatched' as const, channel: 'Cash' },
  { id: 'REC-004', date: '15 Apr 2025', expected: 3_100_000, actual: 3_100_000, variance: 0, status: 'matched' as const, channel: 'Visa / Mastercard' },
  { id: 'REC-005', date: '14 Apr 2025', expected: 2_800_000, actual: 2_650_000, variance: -150_000, status: 'under-review' as const, channel: 'Bank Transfer' },
  { id: 'REC-006', date: '13 Apr 2025', expected: 5_500_000, actual: 5_480_000, variance: -20_000, status: 'matched' as const, channel: 'MTN MoMo' },
  { id: 'REC-007', date: '12 Apr 2025', expected: 4_800_000, actual: 4_200_000, variance: -600_000, status: 'unmatched' as const, channel: 'Cash' },
  { id: 'REC-008', date: '11 Apr 2025', expected: 3_600_000, actual: 3_590_000, variance: -10_000, status: 'matched' as const, channel: 'Airtel Money' },
  { id: 'REC-009', date: '10 Apr 2025', expected: 2_900_000, actual: 2_750_000, variance: -150_000, status: 'under-review' as const, channel: 'Visa / Mastercard' },
  { id: 'REC-010', date: '09 Apr 2025', expected: 1_800_000, actual: 1_800_000, variance: 0, status: 'matched' as const, channel: 'Bank Transfer' },
]

export const remittanceLog = [
  { id: 'RM-001', timestamp: '18 Apr 2025, 10:00', amount: 4_500_000, channel: 'MTN MoMo', status: 'completed' as const, reference: 'REM-8841' },
  { id: 'RM-002', timestamp: '17 Apr 2025, 10:00', amount: 3_200_000, channel: 'Airtel Money', status: 'completed' as const, reference: 'REM-8832' },
  { id: 'RM-003', timestamp: '16 Apr 2025, 10:00', amount: 2_100_000, channel: 'Bank Transfer', status: 'completed' as const, reference: 'REM-8820' },
  { id: 'RM-004', timestamp: '15 Apr 2025, 10:00', amount: 5_800_000, channel: 'MTN MoMo', status: 'completed' as const, reference: 'REM-8815' },
  { id: 'RM-005', timestamp: '14 Apr 2025, 10:00', amount: 1_900_000, channel: 'Visa / Mastercard', status: 'pending' as const, reference: 'REM-8807' },
  { id: 'RM-006', timestamp: '13 Apr 2025, 10:00', amount: 3_700_000, channel: 'Airtel Money', status: 'completed' as const, reference: 'REM-8798' },
  { id: 'RM-007', timestamp: '12 Apr 2025, 10:00', amount: 2_400_000, channel: 'Cash', status: 'failed' as const, reference: 'REM-8790' },
  { id: 'RM-008', timestamp: '11 Apr 2025, 10:00', amount: 4_100_000, channel: 'Bank Transfer', status: 'completed' as const, reference: 'REM-8781' },
]

export const bankGuarantee = {
  amount: 500_000_000,
  utilized: 42_000_000,
  available: 458_000_000,
  expiryDate: '31 Dec 2025',
  status: 'active' as const,
  provider: 'Stanbic Bank Uganda',
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
