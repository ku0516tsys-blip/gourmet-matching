import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function MyPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single()
  const { data: reservations } = await supabase.from('reservations').select('*, store:stores(name)').eq('user_id', user?.id).order('created_at', { ascending: false })
  const { data: coupons } = await supabase.from('coupons').select('*, store:stores(name)').eq('user_id', user?.id).eq('is_used', false)

  async function signOut() {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow p-4 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 flex items-center justify-center text-2xl font-bold">
          {profile?.name?.[0]}
        </div>
        <div>
          <p className="font-bold text-lg">{profile?.name}</p>
          <p className="text-sm text-gray-500">{profile?.area}</p>
        </div>
      </div>

      <h2 className="font-bold mb-2">🎫 クーポン ({coupons?.length || 0}枚)</h2>
      <div className="space-y-2 mb-4">
        {(coupons || []).map(c => (
          <div key={c.id} className="bg-pink-50 border border-pink-200 rounded-xl p-3">
            <p className="font-semibold text-pink-600">{c.discount_percent}% OFF</p>
            <p className="text-sm text-gray-500">{c.store?.name} · {c.code}</p>
          </div>
        ))}
        {(!coupons || coupons.length === 0) && <p className="text-gray-400 text-sm">クーポンなし</p>}
      </div>

      <h2 className="font-bold mb-2">📅 予約履歴</h2>
      <div className="space-y-2 mb-6">
        {(reservations || []).map(r => (
          <div key={r.id} className="bg-white rounded-xl shadow p-3">
            <p className="font-semibold">{r.store?.name}</p>
            <p className="text-sm text-gray-500">{r.date} {r.time} · {r.party_size}名</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
          </div>
        ))}
        {(!reservations || reservations.length === 0) && <p className="text-gray-400 text-sm">予約履歴なし</p>}
      </div>

      <form action={signOut}>
        <button type="submit" className="w-full border border-gray-300 rounded-xl py-3 text-gray-500 text-sm">ログアウト</button>
      </form>
    </div>
  )
}
