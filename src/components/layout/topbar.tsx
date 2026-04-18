import { useLocation } from "react-router-dom"
import { Menu, Search, CircleDot } from "lucide-react"
import { Button } from "@/components/ui/button"

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/revenue": "Revenue Analytics",
  "/compliance": "Compliance & Enforcement",
  "/operations": "Operations Health",
  "/configuration": "Government Configuration",
  "/alerts": "Alerts & Audit Trail",
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? "Dashboard"
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
        <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground md:flex">
          <Search className="size-3.5" />
          <span>Search…</span>
          <kbd className="ml-4 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CircleDot className="size-3 text-success" />
          <span className="hidden sm:inline">All Systems Operational</span>
        </div>
        <div className="hidden text-xs text-muted-foreground sm:block">{today}</div>
      </div>
    </header>
  )
}
