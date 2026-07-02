import Link from 'next/link'
import type { Store } from '@/lib/types'

const EMOJI: Record<string, string> = {
  ramen: '🍜', sushi: '🍣', french: '🥗', italian: '🍝',
  yakiniku: '🥩', cafe: '☕', izakaya: '🍺', asian: '🌏', wine: '🍷',
}

export default function StoreCard({ store }: { store: Store }) {
  const emoji = EMOJI[store.genre?.[0]] ?? '🍽'
  return (
    <Link href={`/stores/${store.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="h-40 bg-gradient-to-br from-orange-50 to-orange-200 flex items-center justify-center text-6xl relative">
        {emoji}
        <span className={`absolute top-2.5 left-2.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${store.is_new ? 'bg-[#e8510a] text-white' : 'bg-gray-800 text-white'}`}>
          {store.is_new ? 'NEW OPEN' : '穴場'}
        </span>
        <span className="absolute top-2.5 right-2.5 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">⭐ {store.rating?.toFixed(1) ?? '—'}</span>
      </div>
      <div className="p-4">
        <div className="font-bold text-base mb-1">{store.name}</div>
        <div className="text-xs text-gray-400 mb-2">📍 {store.area} · {store.nearest_station ?? ''}</div>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {(store.genre ?? []).map((g: string) => (
            <span key={g} className="bg-[#f5f0eb] text-gray-500 text-[11px] px-2 py-0.5 rounded-lg">{g}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">💴 ¥{store.budget_min?.toLocaleString()}〜 / 人</span>
          <span className="bg-[#e8510a] text-white text-xs font-semibold px-4 py-1.5 rounded-full">詳細を見る</span>
        </div>
      </div>
    </Link>
  )
}
