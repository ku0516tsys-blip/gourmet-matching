'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const NAV = [
  { href: '/match',     icon: '💘', label: 'マッチ' },
  { href: '/stores',    icon: '🍽',  label: 'お店' },
  { href: '/chat',      icon: '💬', label: 'トーク' },
  { href: '/dashboard', icon: '🏪', label: '店舗' },
  { href: '/mypage',    icon: '🗒',  label: 'マイページ' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 flex pb-5 pt-2 z-50">
      {NAV.map(({ href, icon, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link key={href} href={href}
            className={clsx('flex-1 flex flex-col items-center gap-0.5 cursor-pointer',
              active ? 'text-[#e8510a]' : 'text-gray-400'
            )}
          >
            <span className={clsx('text-[22px]', !active && 'opacity-40')}>{icon}</span>
            <span className={clsx('text-[10px]', active && 'font-semibold')}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
