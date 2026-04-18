import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  Activity,
  Settings,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/revenue", label: "Revenue Analytics", icon: TrendingUp },
  { to: "/compliance", label: "Compliance & Enforcement", icon: ShieldCheck },
  { to: "/operations", label: "Operations Health", icon: Activity },
  { to: "/configuration", label: "Government Configuration", icon: Settings },
  { to: "/alerts", label: "Alerts & Audit Trail", icon: Bell },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()

  return (
    <div className="flex h-full flex-col">
      {/* Branding */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary font-bold text-sidebar-primary-foreground text-sm">
          MR
        </div>
        <div>
          <div className="font-semibold text-sm text-sidebar-foreground leading-tight">
            Maputo MRUC
          </div>
          <div className="text-[11px] text-sidebar-foreground/60 leading-tight">
            Road Revenue Admin
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="text-[11px] text-sidebar-foreground/40">
          Município de Maputo
        </div>
        <div className="text-[11px] text-sidebar-foreground/40">
          MRUC Platform v2.1
        </div>
      </div>
    </div>
  )
}
