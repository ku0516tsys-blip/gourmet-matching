'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); return }
    router.push('/match')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">🍽 GourMeet</h1>
        <p className="text-gray-500 text-center text-sm mb-6">グルメ×マッチング</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="メールアドレス" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300" required />
          <input type="password" placeholder="パスワード" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-300" required />
          <button type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg py-3 font-semibold">
            ログイン
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          アカウントがない方は <Link href="/signup" className="text-pink-500 font-semibold">新規登録</Link>
        </p>
      </div>
    </div>
  )
}
