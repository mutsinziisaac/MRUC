import { useState } from "react"
import { SectionHeader } from "@/components/shared/section-header"
import { AlertCard } from "@/components/shared/alert-card"
import { AuditTimeline } from "@/components/shared/audit-timeline"
import { StatusBadge } from "@/components/shared/status-badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, User, Clock, Lightbulb } from "lucide-react"
import { alerts, auditTrail } from "@/lib/mock-data"
import type { Alert, AlertSeverity } from "@/lib/mock-data"

const categories = ["All", "Revenue Anomaly", "System Outage", "Compliance Drop", "Policy Breach", "Device Failure"]

export default function Alerts() {
  const [severity, setSeverity] = useState<"all" | AlertSeverity>("all")
  const [category, setCategory] = useState("All")
  const [selected, setSelected] = useState<Alert | null>(null)

  const filtered = alerts.filter((a) => {
    if (severity !== "all" && a.severity !== severity) return false
    if (category !== "All" && a.category !== category) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <section className="animate-in-section space-y-3">
        <Tabs value={severity} onValueChange={(v) => setSeverity(v as "all" | AlertSeverity)}>
          <TabsList>
            <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="high">High</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="low">Low</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                category === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Alert Inbox */}
        <section className="animate-in-section lg:col-span-3 space-y-2" style={{ animationDelay: "0.1s" }}>
          <SectionHeader title={`Alert Inbox (${filtered.length})`} description="Click an alert to view full details" />
          <div className="space-y-2">
            {filtered.map((a) => (
              <AlertCard key={a.id} alert={a} onClick={() => setSelected(a)} />
            ))}
            {filtered.length === 0 && (
              <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No alerts match the current filters.
              </div>
            )}
          </div>
        </section>

        {/* Right column: Config Changes + Audit */}
        <section className="animate-in-section lg:col-span-2 space-y-4" style={{ animationDelay: "0.15s" }}>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <SectionHeader title="Recent Configuration Changes" description="Last 5 config-related actions" />
            <div className="space-y-2.5">
              {auditTrail.filter((e) => e.category === "config").slice(0, 5).map((e) => (
                <div key={e.id} className="text-sm">
                  <div className="font-medium">{e.action}</div>
                  <div className="text-xs text-muted-foreground">{e.detail}</div>
                  <div className="text-[11px] text-muted-foreground/70 mt-0.5">{e.actor} · {e.timestamp}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <SectionHeader title="Audit Timeline" description="All system events grouped by day" />
            <AuditTimeline entries={auditTrail} />
          </div>
        </section>
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={selected.severity} />
                  <StatusBadge status={selected.status} />
                  <Badge variant="outline" className="text-[11px]">{selected.category}</Badge>
                </div>
                <SheetTitle className="text-base">{selected.title}</SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                <p className="text-sm leading-relaxed">{selected.description}</p>

                <Separator />

                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>Corridor: <span className="font-medium text-foreground">{selected.corridor}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="size-4" />
                    <span>Assigned to: <span className="font-medium text-foreground">{selected.assignedTo}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4" />
                    <span>Reported: <span className="font-medium text-foreground">{selected.timestamp}</span></span>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="size-4 text-warning" />
                    <span className="text-sm font-semibold">Recommended Action</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.recommended}</p>
                </div>

                <Separator />

                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Status History</div>
                  <div className="space-y-2 border-l-2 border-border pl-3">
                    <div className="text-xs">
                      <div className="font-medium">Alert Created</div>
                      <div className="text-muted-foreground">System · {selected.timestamp}</div>
                    </div>
                    {selected.status !== "unresolved" && (
                      <div className="text-xs">
                        <div className="font-medium">Acknowledged</div>
                        <div className="text-muted-foreground">{selected.assignedTo} · {selected.timestamp}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
