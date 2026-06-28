'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/match', icon: '💘', label: 'マッチ' },
  { href: '/stores', icon: '🍽', label: 'お店' },
  { href: '/chat', icon: '💬', label: 'チャット' },
  { href: '/notif', icon: '🔔', label: '通知' },
  { href: '/mypage', icon: '👤', label: 'マイページ' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex">
      {items.map(item => (
        <Link key={item.href} href={item.href}
          className={`flex-1 flex flex-col items-center py-2 text-xs gap-1 ${pathname.startsWith(item.href) ? 'text-pink-500' : 'text-gray-400'}`}>
          <span className="text-xl">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
