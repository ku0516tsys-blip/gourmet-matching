import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function StoresPage() {
  const supabase = createClient()
  const { data: stores } = await supabase.from('stores').select('*').order('rating', { ascending: false })

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🍽 おすすめのお店</h1>
      <div className="space-y-4">
        {(stores || []).map(store => (
          <div key={store.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex gap-2 mb-1">
                  {store.is_new && <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">NEW</span>}
                  {store.is_hidden_gem && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">穴場</span>}
                </div>
                <h2 className="font-bold">{store.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{store.area} · {store.nearest_station}</p>
                <p className="text-sm text-gray-600 mt-2">{store.description}</p>
              </div>
              <div className="text-right ml-4">
                <div className="text-yellow-500 font-bold">★ {store.rating}</div>
                <div className="text-xs text-gray-500 mt-1">¥{store.budget_min?.toLocaleString()}〜</div>
              </div>
            </div>
            <Link href={`/stores/${store.id}/reserve`}
              className="mt-3 block w-full text-center bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg py-2 text-sm font-semibold">
              予約する
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
