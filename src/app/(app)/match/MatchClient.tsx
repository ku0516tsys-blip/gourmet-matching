'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = { id: string; name: string; avatar_url?: string; bio?: string; area?: string }

export default function MatchClient({ profiles, currentUserId }: { profiles: Profile[]; currentUserId: string }) {
  const [index, setIndex] = useState(0)
  const [matched, setMatched] = useState(false)
  const supabase = createClient()
  const current = profiles[index]

  async function handleLike() {
    if (!current) return
    await supabase.from('matches').insert({
      user1_id: currentUserId,
      user2_id: current.id,
      compatibility_score: Math.floor(Math.random() * 30) + 70,
    })
    setMatched(true)
    setTimeout(() => { setMatched(false); setIndex(i => i + 1) }, 2000)
  }

  function handleSkip() { setIndex(i => i + 1) }

  if (!current) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🍽</div>
        <p className="text-gray-500">今日のおすすめは以上です</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-6">💘 グルメマッチ</h1>
      {matched && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-6xl mb-2">🎉</div>
            <p className="text-2xl font-bold text-pink-500">マッチしました！</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 flex items-center justify-center text-4xl mx-auto mb-4">
          {current.name[0]}
        </div>
        <h2 className="text-xl font-bold text-center">{current.name}</h2>
        <p className="text-gray-500 text-sm text-center mt-1">{current.area || '東京'}</p>
        <p className="text-gray-600 text-sm text-center mt-3">{current.bio || 'グルメ好き'}</p>
      </div>
      <div className="flex gap-6 mt-6">
        <button onClick={handleSkip}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl">
          ✕
        </button>
        <button onClick={handleLike}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 shadow-lg flex items-center justify-center text-2xl">
          💘
        </button>
      </div>
    </div>
  )
}
