import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/layout/app-shell"
import { TooltipProvider } from "@/components/ui/tooltip"
import Overview from "@/pages/overview"
import RevenueAnalytics from "@/pages/revenue-analytics"
import Compliance from "@/pages/compliance"
import Operations from "@/pages/operations"
import Configuration from "@/pages/configuration"
import Alerts from "@/pages/alerts"

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Overview />} />
            <Route path="revenue" element={<RevenueAnalytics />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="operations" element={<Operations />} />
            <Route path="configuration" element={<Configuration />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  )
}
