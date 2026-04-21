import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/layout/app-shell"
import { TooltipProvider } from "@/components/ui/tooltip"
import Login from "@/pages/login"
import Overview from "@/pages/overview"
import RevenueAnalytics from "@/pages/revenue-analytics"
import Compliance from "@/pages/compliance"
import Configuration from "@/pages/configuration"
import Alerts from "@/pages/alerts"
import GeoMap from "@/pages/geo-map"
import Transit from "@/pages/transit"
import Vehicles from "@/pages/vehicles"
import Reconciliation from "@/pages/reconciliation"

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)

  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />

  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Overview />} />
            <Route path="revenue" element={<RevenueAnalytics />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="geo-map" element={<GeoMap />} />
            <Route path="transit" element={<Transit />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="reconciliation" element={<Reconciliation />} />
            <Route path="configuration" element={<Configuration />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  )
}
