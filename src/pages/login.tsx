import { useState } from "react"
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react"

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) { setError("All fields are required"); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin() }, 1200)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[480px] flex-col justify-between p-10" style={{ background: "oklch(0.18 0.04 220)" }}>
        <div>
          <div className="mb-16">
              <div className="font-semibold text-[15px] text-white/90 leading-tight">RUC</div>
              <div className="text-[11px] text-white/50 leading-tight">Unified Road Revenue Platform</div>
          </div>
          <h1 className="text-[28px] font-bold text-white/95 leading-tight mb-4">
            Unified Road User Charge<br />& Toll Management System
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-[340px]">
            Centralised oversight of toll collections, compliance enforcement, and revenue reconciliation across Kampala Capital City corridors.
          </p>
          <img src="/Meeting.svg" alt="Team collaboration" className="mt-8 w-full max-w-[360px] opacity-80" />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Corridors", value: "7" },
              { label: "Toll Stations", value: "8" },
              { label: "Daily Revenue", value: "6.2M" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg p-3" style={{ background: "oklch(0.24 0.04 220)" }}>
                <div className="text-lg font-bold text-white/90">{s.value}</div>
                <div className="text-[11px] text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/30">
            <ShieldCheck className="size-3.5" />
            <span>Secured by BSMART Technology · Kampala Capital City Authority</span>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <div className="w-full max-w-[380px]">
          {/* Mobile branding */}
          <div className="mb-8 lg:hidden">
              <div className="font-semibold text-sm leading-tight">RUC</div>
              <div className="text-[11px] text-muted-foreground leading-tight">Unified Road Revenue Platform</div>
          </div>

          <h2 className="text-xl font-bold tracking-tight mb-1">Sign in to your account</h2>
          <p className="text-sm text-muted-foreground mb-8">Enter your credentials to access the admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="name@kcca.go.ug"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 pr-10 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors" aria-label="Toggle password visibility">
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-destructive font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? <><Loader2 className="size-4 animate-spin" />Signing in…</> : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground/60">
            Access restricted to authorised municipal personnel only
          </p>
        </div>
      </div>
    </div>
  )
}
