import {
  ResponsiveContainer,
  AreaChart as RArea,
  Area,
  BarChart as RBar,
  Bar,
  LineChart as RLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const COLORS = {
  primary: "oklch(0.35 0.08 195)",
  secondary: "oklch(0.55 0.12 195)",
  gold: "oklch(0.70 0.15 75)",
  slate: "oklch(0.50 0.02 255)",
  success: "oklch(0.55 0.16 155)",
  muted: "oklch(0.80 0.01 90)",
}

const axisProps = { tick: { fontSize: 11, fill: "#78716c" }, axisLine: false, tickLine: false }
const gridProps = { strokeDasharray: "3 3", stroke: "#e7e5e4" }

export { COLORS, ResponsiveContainer, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend }

export function AreaChart({ data, children, height = 260 }: { data: unknown[]; children: React.ReactNode; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RArea data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : v.toLocaleString()} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7e5e4" }} />
        {children}
      </RArea>
    </ResponsiveContainer>
  )
}

export function BarChart({ data, children, height = 260, layout }: { data: unknown[]; children: React.ReactNode; height?: number; layout?: "vertical" }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBar data={data} layout={layout} margin={{ top: 5, right: 5, bottom: 0, left: layout === "vertical" ? 80 : -20 }}>
        <CartesianGrid {...gridProps} />
        {layout === "vertical" ? (
          <>
            <XAxis type="number" {...axisProps} tickFormatter={(v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : String(v)} />
            <YAxis type="category" dataKey="name" {...axisProps} width={80} />
          </>
        ) : (
          <>
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : String(v)} />
          </>
        )}
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7e5e4" }} />
        {children}
      </RBar>
    </ResponsiveContainer>
  )
}

export function LineChart({ data, children, height = 260 }: { data: unknown[]; children: React.ReactNode; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLine data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7e5e4" }} />
        {children}
      </RLine>
    </ResponsiveContainer>
  )
}
