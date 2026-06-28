'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); return }
    setDone(true)
  }

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold mb-2">確認メールを送信しました</h2>
        <p className="text-gray-500 text-sm">メールのリンクをクリックして登録完了です</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">🍽 GourMeet</h1>
        <p className="text-gray-500 text-center text-sm mb-6">新規登録</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="email" placeholder="メールアドレス" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300" required />
          <input type="password" placeholder="パスワード（6文字以上）" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300" required />
          <button type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg py-3 font-semibold">
            登録する
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          すでにアカウントがある方は <Link href="/login" className="text-pink-500 font-semibold">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
