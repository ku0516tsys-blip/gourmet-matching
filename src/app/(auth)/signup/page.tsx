'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type DoneState = 'sent' | 'already_exists'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<DoneState | null>(null)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    const alreadyExists = data.user?.identities?.length === 0
    setDone(alreadyExists ? 'already_exists' : 'sent')
  }

  if (done === 'already_exists') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center gap-4">
      <div className="text-5xl">⚠️</div>
      <h2 className="text-xl font-bold">このメールアドレスはすでに登録済みです</h2>
      <p className="text-sm text-gray-500">ログインするか、パスワードをお忘れの場合はリセットしてください。</p>
      <Link href="/login"
        className="w-full max-w-xs block text-center bg-gradient-to-r from-[#e8510a] to-[#ff8c42] text-white font-bold py-4 rounded-xl">
        ログインへ
      </Link>
    </div>
  )

  if (done === 'sent') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center gap-4">
      <div className="text-5xl">📬</div>
      <h2 className="text-xl font-bold">確認メールを送りました</h2>
      <p className="text-sm text-gray-500">{email} に届いたリンクをクリックして登録を完了してください。</p>
      <Link href="/login" className="text-[#e8510a] text-sm font-semibold">ログインへ</Link>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽</div>
          <h1 className="text-3xl font-black"><span className="text-[#e8510a]">Gour</span>Meet</h1>
          <p className="text-sm text-gray-400 mt-1">食で、つながろう</p>
        </div>
        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
          )}
          <input type="text" placeholder="お名前" value={name} onChange={e => setName(e.target.value)} required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e8510a] transition-colors" />
          <input type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e8510a] transition-colors" />
          <input type="password" placeholder="パスワード（8文字以上）" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e8510a] transition-colors" />
          <button type="submit" disabled={loading}
            className="bg-gradient-to-r from-[#e8510a] to-[#ff8c42] text-white font-bold py-4 rounded-xl mt-2 disabled:opacity-50">
            {loading ? '登録中…' : '無料で始める 🎉'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" className="text-[#e8510a] font-semibold">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
