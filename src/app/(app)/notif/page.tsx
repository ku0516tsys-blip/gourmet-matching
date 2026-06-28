import { createClient } from '@/lib/supabase/server'

export default async function NotifPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  const icons: Record<string, string> = { match: '💘', reserve: '📅', review: '⭐', coupon: '🎫', system: '📢' }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🔔 通知</h1>
      {(!notifications || notifications.length === 0) ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔔</div>
          <p>通知はありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className={`bg-white rounded-xl shadow p-4 flex gap-3 ${!n.is_read ? 'border-l-4 border-pink-400' : ''}`}>
              <span className="text-2xl">{icons[n.type] || '📢'}</span>
              <div>
                <p className="font-semibold text-sm">{n.title}</p>
                <p className="text-gray-500 text-sm">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
