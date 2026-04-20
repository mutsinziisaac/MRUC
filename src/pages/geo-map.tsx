import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Polygon, Tooltip } from 'react-leaflet'
import { tollStations, corridors, corridorRoutes, geofenceZones, borderEntryPoints } from '@/lib/mock-data'
import { SectionHeader } from '@/components/shared/section-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type Station = { id: string; name: string; corridor: string; devices: number; lat: number; lng: number }

const CORRIDOR_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

const emptyStation: Station = { id: '', name: '', corridor: '', devices: 0, lat: 0.3476, lng: 32.5825 }

export default function GeoMap() {
  const [stations, setStations] = useState<Station[]>(tollStations)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Station | null>(null)
  const [form, setForm] = useState<Station>(emptyStation)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const openAdd = () => { setEditing(null); setForm({ ...emptyStation, id: `ts-${Date.now()}` }); setDialogOpen(true) }
  const openEdit = (s: Station) => { setEditing(s); setForm({ ...s }); setDialogOpen(true) }

  const save = () => {
    if (editing) {
      setStations(prev => prev.map(s => s.id === editing.id ? { ...form } : s))
      setToast('Station updated')
    } else {
      setStations(prev => [...prev, form])
      setToast('Station added')
    }
    setDialogOpen(false)
  }

  const corridorColor = (corridorId: string) => {
    const idx = corridors.findIndex(c => c.id === corridorId)
    return CORRIDOR_COLORS[idx % CORRIDOR_COLORS.length]
  }

  return (
    <div className="relative">
      <SectionHeader title="Geo Map & Toll Config" description="Interactive map of Kampala toll infrastructure" />

      <div className="relative h-[calc(100vh-8rem)] rounded-lg border border-border overflow-hidden">
        <MapContainer center={[0.3476, 32.5825]} zoom={12} className="h-full w-full z-0" scrollWheelZoom>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' />

          {corridorRoutes.map(r => (
            <Polyline key={r.corridorId} positions={r.coordinates as [number, number][]} pathOptions={{ color: corridorColor(r.corridorId), weight: 3, opacity: 0.8 }}>
              <Tooltip sticky>{corridors.find(c => c.id === r.corridorId)?.name}</Tooltip>
            </Polyline>
          ))}

          {geofenceZones.map(z => (
            <Polygon key={z.id} positions={z.coordinates as [number, number][]} pathOptions={{ color: z.color, fillColor: z.color, fillOpacity: 0.2, weight: 2 }}>
              <Tooltip sticky>{z.name} ({z.type})</Tooltip>
            </Polygon>
          ))}

          {stations.map(s => (
            <CircleMarker key={s.id} center={[s.lat, s.lng]} radius={8} pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.9, weight: 2 }}>
              <Popup>
                <div className="text-xs space-y-1 min-w-[160px]">
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p>Corridor: {corridors.find(c => c.id === s.corridor)?.name}</p>
                  <p>Devices: {s.devices}</p>
                  <button className="mt-1 px-2 py-0.5 bg-blue-600 text-white rounded text-xs" onClick={() => openEdit(s)}>Edit</button>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {borderEntryPoints.map(bp => (
            <CircleMarker key={bp.id} center={[bp.lat, bp.lng]} radius={12} pathOptions={{ color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.9, weight: 2 }}>
              <Popup>
                <div className="text-xs space-y-1 min-w-[160px]">
                  <p className="font-semibold text-sm">{bp.name}</p>
                  <p>Type: {bp.type}</p>
                  <p>Daily Volume: {bp.dailyVolume.toLocaleString()}</p>
                  <p>Status: {bp.status}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Overlay Panel */}
        <div className="absolute top-3 right-3 z-[1000] w-64 max-h-[calc(100%-1.5rem)] overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Infrastructure</h3>
            <Button size="sm" variant="default" className="h-7 text-xs" onClick={openAdd}>+ Add Station</Button>
          </div>
          <Separator className="mb-2" />
          <div className="space-y-1 mb-3">
            <p className="text-xs text-muted-foreground font-medium">Toll Stations ({stations.length})</p>
            {stations.map(s => (
              <div key={s.id} className="flex items-center justify-between text-xs py-0.5">
                <span className="truncate mr-1">{s.name}</span>
                <Badge variant="outline" className="text-[10px] shrink-0">{s.devices} dev</Badge>
              </div>
            ))}
          </div>
          <Separator className="mb-2" />
          <div className="space-y-1 mb-3">
            <p className="text-xs text-muted-foreground font-medium">Geofence Zones ({geofenceZones.length})</p>
            {geofenceZones.map(z => (
              <div key={z.id} className="flex items-center gap-1.5 text-xs py-0.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: z.color }} />
                <span className="truncate">{z.name}</span>
              </div>
            ))}
          </div>
          <Separator className="mb-2" />
          <p className="text-xs text-muted-foreground font-medium">Border Points ({borderEntryPoints.length})</p>
          {borderEntryPoints.map(bp => (
            <div key={bp.id} className="flex items-center justify-between text-xs py-0.5">
              <span className="truncate mr-1">{bp.name}</span>
              <StatusBadge status={bp.status} />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-border bg-card p-3 shadow-sm">
          <p className="text-xs font-semibold mb-1.5">Legend</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-500" />Toll Station</div>
            <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-red-500" />Border Entry Point</div>
            <div className="flex items-center gap-2"><span className="h-0.5 w-4 bg-emerald-500 rounded" />Corridor Route</div>
            <div className="flex items-center gap-2"><span className="h-3 w-4 bg-amber-400/30 border border-amber-400 rounded-sm" />Geofence Zone</div>
          </div>
        </div>
      </div>

      {/* Station Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Station' : 'Add Station'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <label className="block text-xs">
              <span className="text-muted-foreground">Name</span>
              <input className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </label>
            <label className="block text-xs">
              <span className="text-muted-foreground">Corridor</span>
              <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm" value={form.corridor} onChange={e => setForm(f => ({ ...f, corridor: e.target.value }))}>
                <option value="">Select corridor</option>
                {corridors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs">
                <span className="text-muted-foreground">Latitude</span>
                <input type="number" step="0.01" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: +e.target.value }))} />
              </label>
              <label className="block text-xs">
                <span className="text-muted-foreground">Longitude</span>
                <input type="number" step="0.01" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: +e.target.value }))} />
              </label>
            </div>
            <label className="block text-xs">
              <span className="text-muted-foreground">Devices</span>
              <input type="number" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm" value={form.devices} onChange={e => setForm(f => ({ ...f, devices: +e.target.value }))} />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2000] rounded-lg border border-border bg-card px-4 py-2 shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  )
}
