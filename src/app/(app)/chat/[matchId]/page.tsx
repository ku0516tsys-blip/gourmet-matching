'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'

export default function ChatRoomPage() {
  const { matchId } = useParams()
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [userId, setUserId] = useState<string>('')
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || ''))
    supabase.from('messages').select('*').eq('match_id', matchId).order('created_at')
      .then(({ data }) => setMessages(data || []))

    const channel = supabase.channel(`chat-${matchId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
        payload => setMessages(m => [...m, payload.new]))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [matchId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    await supabase.from('messages').insert({ match_id: matchId, sender_id: userId, content: input })
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b bg-white font-bold">💬 チャット</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.sender_id === userId ? 'bg-pink-500 text-white' : 'bg-white shadow'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300" />
        <button type="submit" className="bg-pink-500 text-white rounded-full px-4 py-2 text-sm font-semibold">送信</button>
      </form>
    </div>
  )
}
