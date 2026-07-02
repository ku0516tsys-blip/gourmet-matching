import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import StoreCard from '@/components/StoreCard'

export default async function StoresPage() {
  const supabase = createClient()
  const { data: newStores } = await supabase
    .from('stores')
    .select('*')
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: hiddenStores } = await supabase
    .from('stores')
    .select('*')
    .eq('is_hidden_gem', true)
    .limit(5)

  return (
    <div className="pb-4">
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="text-xl font-black text-[#e8510a]">Gour<span className="text-gray-800">Meet</span></div>
        <Link href="/stores/map" className="w-9 h-9 rounded-full bg-[#f5f0eb] flex items-center justify-center text-lg">🗺</Link>
      </div>

      <div className="bg-white px-5 py-3">
        <div className="flex items-center gap-2 bg-[#f5f0eb] rounded-xl px-3 py-2.5">
          <span>🔍</span>
          <input className="bg-transparent flex-1 text-sm outline-none" placeholder="エリア・料理ジャンルで検索" />
        </div>
      </div>

      <div className="flex gap-2 px-5 py-3 overflow-x-auto hide-scroll">
        {['すべて', '🆕 新店舗', '🕵️ 穴場', '🍣 和食', '🍷 ワイン', '🍜 ラーメン'].map((t, i) => (
          <button key={t} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs border transition-colors ${i === 0 ? 'bg-[#e8510a] border-[#e8510a] text-white' : 'border-gray-200 bg-white text-gray-600'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-5 pt-2 pb-1 text-sm font-bold">🆕 今週オープンの新店舗</div>
      <div className="flex flex-col gap-4 px-5">
        {(newStores ?? []).map(store => <StoreCard key={store.id} store={store} />)}
        {(!newStores || newStores.length === 0) && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm">新店舗を準備中です</div>
        )}
      </div>

      <div className="px-5 pt-4 pb-1 text-sm font-bold">🕵️ 知る人ぞ知る穴場</div>
      <div className="flex flex-col gap-4 px-5">
        {(hiddenStores ?? []).map(store => <StoreCard key={store.id} store={store} />)}
        {(!hiddenStores || hiddenStores.length === 0) && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm">穴場店舗を準備中です</div>
        )}
      </div>
    </div>
  )
}
