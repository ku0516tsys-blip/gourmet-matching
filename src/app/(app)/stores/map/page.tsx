'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

interface Store {
  id: string; name: string; area: string; genre: string[]
  rating: number; budget_min: number; lat: number | null; lng: number | null
}

export default function StoresMapPage() {
  const supabase = createClient()
  const [stores, setStores] = useState<Store[]>([])
  const [selected, setSelected] = useState<Store | null>(null)

  useEffect(() => {
    supabase.from('stores').select('id, name, area, genre, rating, budget_min, lat, lng')
      .then(({ data }) => setStores((data ?? []).filter(s => s.lat && s.lng)))
  }, [supabase])

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white px-4 pt-12 pb-3 flex items-center gap-3 border-b border-gray-100 z-10">
        <Link href="/stores" className="text-gray-500 text-sm">← リスト</Link>
        <h1 className="font-bold text-gray-800">地図で探す</h1>
      </div>
      <div className="flex-1 relative">
        <MapView stores={stores} onSelect={setSelected} />
      </div>
      {selected && (
        <div className="absolute bottom-24 left-4 right-4 z-50 bg-white rounded-2xl shadow-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-800">{selected.name}</h2>
            <button onClick={() => setSelected(null)} className="text-gray-400 text-lg">✕</button>
          </div>
          <p className="text-xs text-gray-400 mb-3">📍 {selected.area} · ⭐ {selected.rating?.toFixed(1)} · ¥{selected.budget_min?.toLocaleString()}〜</p>
          <Link href={`/stores/${selected.id}`}
            className="block w-full text-center bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold py-2.5 rounded-xl text-sm">
            詳細・予約する
          </Link>
        </div>
      )}
    </div>
  )
}
