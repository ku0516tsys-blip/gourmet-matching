'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'

const timeSlots = ['11:30', '12:00', '12:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']

export default function ReservePage() {
  const { storeId } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [store, setStore] = useState<any>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [partySize, setPartySize] = useState(2)
  const [requests, setRequests] = useState('')
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || ''))
    supabase.from('stores').select('*').eq('id', storeId).single().then(({ data }) => setStore(data))
    const today = new Date()
    setDate(today.toISOString().split('T')[0])
  }, [storeId])

  async function handleSubmit() {
    const { error } = await supabase.from('reservations').insert({
      store_id: storeId,
      user_id: userId,
      date,
      time,
      party_size: partySize,
      requests,
      status: 'confirmed',
    })
    if (!error) setDone(true)
  }

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full max-w-sm">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold mb-2">予約完了！</h2>
        <p className="text-gray-500 text-sm mb-1">{store?.name}</p>
        <p className="text-gray-500 text-sm mb-6">{date} {time} · {partySize}名</p>
        <button onClick={() => router.push('/mypage')}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg py-3 font-semibold">
          マイページで確認
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 border-b flex items-center gap-3">
        <button onClick={() => step > 1 ? setStep(s => s - 1) : router.back()} className="text-gray-500">←</button>
        <h1 className="font-bold">{store?.name} を予約</h1>
      </div>

      <div className="flex p-4 gap-2 mb-2">
        {[1,2,3].map(s => (
          <div key={s} className={`flex-1 h-1 rounded-full ${step >= s ? 'bg-pink-500' : 'bg-gray-200'}`} />
        ))}
      </div>

      <div className="p-4 space-y-4">
        {step === 1 && <>
          <h2 className="font-bold text-lg">📅 日付を選択</h2>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300" />
          <h2 className="font-bold text-lg mt-4">🕐 時間を選択</h2>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(t => (
              <button key={t} onClick={() => setTime(t)}
                className={`py-2 rounded-lg border text-sm font-medium ${time === t ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700'}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={!date || !time}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg py-3 font-semibold disabled:opacity-40 mt-4">
            次へ
          </button>
        </>}

        {step === 2 && <>
          <h2 className="font-bold text-lg">👥 人数を選択</h2>
          <div className="flex items-center justify-center gap-6 py-4">
            <button onClick={() => setPartySize(p => Math.max(1, p - 1))}
              className="w-12 h-12 rounded-full bg-gray-100 text-2xl flex items-center justify-center">−</button>
            <span className="text-4xl font-bold">{partySize}</span>
            <button onClick={() => setPartySize(p => Math.min(10, p + 1))}
              className="w-12 h-12 rounded-full bg-gray-100 text-2xl flex items-center justify-center">＋</button>
          </div>
          <p className="text-center text-gray-500 text-sm">{partySize}名</p>
          <h2 className="font-bold text-lg mt-4">📝 リクエスト（任意）</h2>
          <textarea value={requests} onChange={e => setRequests(e.target.value)}
            placeholder="アレルギー・記念日・席の希望など"
            rows={3} className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300" />
          <button onClick={() => setStep(3)}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg py-3 font-semibold mt-2">
            次へ
          </button>
        </>}

        {step === 3 && <>
          <h2 className="font-bold text-lg">✅ 予約内容を確認</h2>
          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            <div className="flex justify-between"><span className="text-gray-500">お店</span><span className="font-semibold">{store?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">日付</span><span className="font-semibold">{date}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">時間</span><span className="font-semibold">{time}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">人数</span><span className="font-semibold">{partySize}名</span></div>
            {requests && <div className="flex justify-between"><span className="text-gray-500">リクエスト</span><span className="font-semibold text-right max-w-48">{requests}</span></div>}
          </div>
          <button onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg py-3 font-semibold mt-4">
            予約を確定する
          </button>
        </>}
      </div>
    </div>
  )
}
