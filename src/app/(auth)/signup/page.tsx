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
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      if (error.message.includes('password')) {
        setError('パスワードは6文字以上にしてください。')
      } else {
        setError('登録に失敗しました。もう一度お試しください。')
      }
      return
    }
    setDone(true)
  }

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold mb-2">メールを送信しました</h2>
        <p className="text-gray-500 text-sm mb-4">確認メールのリンクをクリックして登録完了です</p>
        <p className="text-gray-400 text-xs mb-6">※すでに登録済みの場合はログインしてください</p>
        <Link href="/login" className="block w-full text-center bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg py-3 font-semibold">
          ログインはこちら
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">🍽 GourMeet</h1>
        <p className="text-gray-500 text-center text-sm mb-6">新規登録</p>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
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
