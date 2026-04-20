import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Polygon, Tooltip } from 'react-leaflet'
import { Calendar, Filter, Sliders } from 'lucide-react'
import { tollStations, corridors, geofenceZones, borderEntryPoints } from '@/lib/mock-data'
import { StatusBadge } from '@/components/shared/status-badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type RoutePoint = [number, number]

const ROAD_ALIGNED_CORRIDOR_ROUTES: { corridorId: string; coordinates: RoutePoint[] }[] = [
  {
    corridorId: 'jinja-road',
    coordinates: [
      [0.317917, 32.580898],
      [0.316168, 32.580474],
      [0.315283, 32.581389],
      [0.314392, 32.581563],
      [0.312597, 32.584476],
      [0.312764, 32.587046],
      [0.314585, 32.590254],
      [0.316532, 32.593017],
      [0.318535, 32.595387],
      [0.323324, 32.601862],
      [0.326191, 32.608874],
      [0.328776, 32.612456],
      [0.333698, 32.617915],
      [0.337046, 32.622098],
      [0.338912, 32.626982],
      [0.340878, 32.632142],
      [0.343059, 32.637797],
      [0.344855, 32.643009],
      [0.348033, 32.653109],
      [0.351037, 32.656336],
      [0.352582, 32.659765],
      [0.35285, 32.666326],
      [0.353683, 32.671592],
      [0.355538, 32.681773],
      [0.356061, 32.686603],
      [0.355005, 32.687007],
    ],
  },
  {
    corridorId: 'entebbe-road',
    coordinates: [
      [0.317917, 32.580898],
      [0.316033, 32.580614],
      [0.314916, 32.581612],
      [0.311498, 32.581548],
      [0.308676, 32.578177],
      [0.298883, 32.577041],
      [0.293424, 32.573088],
      [0.289639, 32.570323],
      [0.280789, 32.566384],
      [0.273998, 32.565113],
      [0.265425, 32.566658],
      [0.259023, 32.565579],
      [0.253203, 32.562792],
      [0.249621, 32.560346],
      [0.239734, 32.555568],
      [0.232463, 32.552106],
      [0.225927, 32.548802],
      [0.222689, 32.550557],
      [0.21765, 32.550019],
      [0.212798, 32.549578],
      [0.21187, 32.551962],
    ],
  },
  {
    corridorId: 'northern-bypass',
    coordinates: [
      [0.307943, 32.503193],
      [0.312474, 32.503767],
      [0.315785, 32.508443],
      [0.312072, 32.513954],
      [0.316098, 32.519435],
      [0.329113, 32.525161],
      [0.342959, 32.536402],
      [0.347482, 32.555297],
      [0.349591, 32.56269],
      [0.352684, 32.569143],
      [0.352851, 32.572444],
      [0.349466, 32.58196],
      [0.351653, 32.58859],
      [0.358853, 32.598482],
      [0.360691, 32.602154],
      [0.365983, 32.606123],
      [0.366134, 32.61138],
      [0.369552, 32.626995],
      [0.366153, 32.633084],
      [0.363572, 32.634425],
      [0.366347, 32.638832],
      [0.372567, 32.642429],
      [0.376156, 32.645127],
    ],
  },
  {
    corridorId: 'bombo-road',
    coordinates: [
      [0.317917, 32.580898],
      [0.315827, 32.580531],
      [0.31669, 32.576047],
      [0.321396, 32.573858],
      [0.329582, 32.57412],
      [0.336489, 32.572473],
      [0.340829, 32.571321],
      [0.345973, 32.567949],
      [0.348456, 32.563724],
      [0.353685, 32.562748],
      [0.362889, 32.561],
      [0.372287, 32.557582],
      [0.379017, 32.557455],
      [0.386512, 32.553566],
      [0.39225, 32.554416],
      [0.397739, 32.555608],
      [0.400451, 32.557405],
      [0.404411, 32.559313],
      [0.408001, 32.560566],
      [0.4101, 32.560894],
      [0.410258, 32.560228],
    ],
  },
  {
    corridorId: 'masaka-road',
    coordinates: [
      [0.317917, 32.580898],
      [0.315713, 32.580278],
      [0.318619, 32.574379],
      [0.324097, 32.574077],
      [0.332866, 32.573542],
      [0.340473, 32.571522],
      [0.34545, 32.568399],
      [0.348595, 32.563518],
      [0.347999, 32.557898],
      [0.342959, 32.536641],
      [0.318302, 32.521546],
      [0.307548, 32.516187],
      [0.303427, 32.512791],
      [0.295333, 32.503864],
      [0.291122, 32.49876],
      [0.285161, 32.49187],
      [0.281371, 32.483752],
      [0.278554, 32.478133],
      [0.279544, 32.46974],
      [0.28651, 32.471302],
      [0.292006, 32.470023],
    ],
  },
  {
    corridorId: 'mityana-road',
    coordinates: [
      [0.317917, 32.580898],
      [0.315799, 32.580432],
      [0.318103, 32.57471],
      [0.32268, 32.573972],
      [0.330437, 32.573979],
      [0.339205, 32.571902],
      [0.34376, 32.569798],
      [0.347764, 32.565717],
      [0.349207, 32.562015],
      [0.346771, 32.551096],
      [0.337069, 32.530856],
      [0.316149, 32.519699],
      [0.30971, 32.514783],
      [0.315519, 32.512272],
      [0.321582, 32.504436],
      [0.327397, 32.497369],
      [0.333316, 32.487728],
      [0.326736, 32.472926],
      [0.32581, 32.460476],
      [0.319833, 32.453613],
      [0.316057, 32.454929],
    ],
  },
  {
    corridorId: 'gayaza-road',
    coordinates: [
      [0.362991, 32.57405],
      [0.363009, 32.575024],
      [0.36926, 32.576606],
      [0.37264, 32.576511],
      [0.375434, 32.576399],
      [0.380785, 32.576899],
      [0.388573, 32.578869],
      [0.397559, 32.581872],
      [0.402528, 32.584376],
      [0.408197, 32.593166],
      [0.410237, 32.594794],
      [0.412207, 32.595547],
      [0.412904, 32.596972],
      [0.412916, 32.599154],
      [0.411689, 32.602916],
      [0.40917, 32.603974],
      [0.408757, 32.60543],
      [0.40718, 32.605849],
      [0.405994, 32.606787],
      [0.406002, 32.608561],
      [0.405557, 32.609913],
      [0.405552, 32.6106],
    ],
  },
]

function HeaderButton({ children, icon: Icon }: { children: React.ReactNode; icon?: typeof Filter }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm transition-colors hover:bg-muted/50">
      {Icon && <Icon className="size-3.5" />}
      {children}
    </button>
  )
}

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
    <div className="space-y-8">
      {/* Page header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Geo Map & Toll Config</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Interactive map of Kampala toll infrastructure, corridors, geofences, and border points
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HeaderButton icon={Calendar}>18 Apr 2025</HeaderButton>
            <HeaderButton icon={Filter}>Layers</HeaderButton>
            <HeaderButton icon={Sliders}>Tweaks</HeaderButton>
          </div>
        </div>
      </header>

      <div className="relative h-[calc(100vh-16rem)] rounded-lg border border-border overflow-hidden">
        <MapContainer center={[0.3476, 32.5825]} zoom={12} className="h-full w-full z-0" scrollWheelZoom>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' />

          {ROAD_ALIGNED_CORRIDOR_ROUTES.map(r => (
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
