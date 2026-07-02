'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const customIcon = (label: string) => L.divIcon({
  className: '',
  html: `<div style="background:linear-gradient(135deg,#ec4899,#f97316);color:white;font-size:11px;font-weight:bold;padding:4px 8px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white">${label}</div>`,
  iconAnchor: [0, 0],
})

interface Store {
  id: string; name: string; area: string; genre: string[]
  rating: number; budget_min: number; lat: number | null; lng: number | null
}

function FitBounds({ stores }: { stores: Store[] }) {
  const map = useMap()
  useEffect(() => {
    const bounds = stores.filter(s => s.lat && s.lng).map(s => [s.lat!, s.lng!] as [number, number])
    if (bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40] })
  }, [stores, map])
  return null
}

export default function MapView({ stores, onSelect }: { stores: Store[]; onSelect: (s: Store) => void }) {
  return (
    <MapContainer center={[35.658, 139.701]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds stores={stores} />
      {stores.filter(s => s.lat && s.lng).map(store => (
        <Marker key={store.id} position={[store.lat!, store.lng!]} icon={customIcon(store.name)}
          eventHandlers={{ click: () => onSelect(store) }} />
      ))}
    </MapContainer>
  )
}
