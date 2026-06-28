'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const genres = ['和食','イタリアン','フレンチ','焼肉','寿司','ラーメン','カフェ','居酒屋']

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [area, setArea] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      if (profile) { setName(profile.name || ''); setBio(profile.bio || ''); setArea(profile.area || '') }
      const { data: fp } = await supabase.from('food_preferences').select('*').eq('user_id', data.user.id).single()
      if (fp) setSelectedGenres(fp.genres || [])
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const { data } = await supabase.auth.getUser()
    if (!data.user) return
    await supabase.from('profiles').update({ name, bio, area }).eq('id', data.user.id)
    await supabase.from('food_preferences').upsert({ user_id: data.user.id, genres: selectedGenres })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggleGenre(g: string) {
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">👤 プロフィール設定</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">名前</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300" />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">エリア</label>
          <input value={area} onChange={e => setArea(e.target.value)} placeholder="例: 渋谷・恵比寿"
            className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300" />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">自己紹介</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300" />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-2 block">好きなジャンル</label>
          <div className="flex flex-wrap gap-2">
            {genres.map(g => (
              <button type="button" key={g} onClick={() => toggleGenre(g)}
                className={`px-3 py-1.5 rounded-full text-sm border ${selectedGenres.includes(g) ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-600 border-gray-300'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <button type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg py-3 font-semibold">
          {saved ? '✓ 保存しました' : '保存する'}
        </button>
      </form>
    </div>
  )
}
