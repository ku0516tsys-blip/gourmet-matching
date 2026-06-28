import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ChatPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: matches } = await supabase
    .from('matches')
    .select('*, user1:profiles!matches_user1_id_fkey(id,name), user2:profiles!matches_user2_id_fkey(id,name)')
    .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
    .eq('status', 'matched')

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">💬 チャット</h1>
      {(!matches || matches.length === 0) ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">💘</div>
          <p>まだマッチングがありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map(match => {
            const other = match.user1_id === user?.id ? match.user2 : match.user1
            return (
              <Link key={match.id} href={`/chat/${match.id}`}
                className="flex items-center gap-3 bg-white rounded-xl shadow p-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 flex items-center justify-center text-xl font-bold">
                  {other?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold">{other?.name}</p>
                  <p className="text-sm text-gray-400">タップしてトークを始める</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
