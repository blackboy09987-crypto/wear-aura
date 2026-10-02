'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/store'
import CartDrawer from './CartDrawer'
import AnnouncementBar from './AnnouncementBar'
import { CATEGORIES } from '@/lib/config'

export default function Navbar() {
  const { count, openCart } = useCart()
  const c = count()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
        <header className="bg-bg/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-5 md:px-10 py-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-dim hover:text-fg transition-colors cursor-pointer w-8"
            aria-label="Menu"
          >
            <span className="block w-5 h-px bg-current mb-1.5" />
            <span className="block w-5 h-px bg-current" />
          </button>

          <Link href="/" className="font-display text-[17px] tracking-[0.22em] hover:opacity-70 transition-opacity absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <span style={{ color: '#C81C1C' }}>WEAR</span>{' '}
            <span style={{ color: '#1B2F8A' }}>AURA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link href="/shop" className="text-[11px] tracking-[0.18em] uppercase text-dim hover:text-fg transition-colors">
              All
            </Link>
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link
                key={cat}
                href={`/shop?cat=${cat}`}
                className="text-[11px] tracking-[0.18em] uppercase text-dim hover:text-fg transition-colors"
              >
                {cat}
              </Link>
            ))}
            <Link href="/shop?sale=1" className="text-[11px] tracking-[0.18em] uppercase text-accent hover:opacity-80 transition-opacity font-medium">
              Sale
            </Link>
          </nav>

          <button
            onClick={openCart}
            className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-dim hover:text-fg transition-colors cursor-pointer"
            aria-label="Cart"
          >
            <span className="hidden sm:inline">Cart</span>
            {c > 0 && (
              <span className="bg-accent text-fg text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                {c}
              </span>
            )}
          </button>
        </header>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-bg border-b border-border px-5 py-4 space-y-3">
            {['All Drops', ...CATEGORIES].map((cat, i) => (
              <Link
                key={cat}
                href={i === 0 ? '/shop' : `/shop?cat=${cat}`}
                onClick={() => setMenuOpen(false)}
                className="block text-[12px] tracking-[0.2em] uppercase text-dim hover:text-fg transition-colors py-1"
              >
                {cat}
              </Link>
            ))}
            <Link
              href="/shop?sale=1"
              onClick={() => setMenuOpen(false)}
              className="block text-[12px] tracking-[0.2em] uppercase text-accent py-1"
            >
              Sale
            </Link>
          </div>
        )}
      </div>

      <CartDrawer />
    </>
  )
}
