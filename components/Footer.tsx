import Link from 'next/link'
import { INSTAGRAM, TIKTOK, STORE_EMAIL } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20 px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="font-display text-[14px] tracking-[0.25em] mb-2">WEAR AURA</p>
          <p className="text-[11px] text-dim tracking-widest uppercase">Pakistan · 2026</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[10px] tracking-[0.2em] uppercase text-dim mb-1">Shop</p>
          <Link href="/shop" className="text-[12px] text-dim hover:text-fg transition-colors tracking-wide">All Products</Link>
          <Link href="/shop?cat=Tees" className="text-[12px] text-dim hover:text-fg transition-colors tracking-wide">Tees</Link>
          <Link href="/shop?cat=Hoodies" className="text-[12px] text-dim hover:text-fg transition-colors tracking-wide">Hoodies</Link>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[10px] tracking-[0.2em] uppercase text-dim mb-1">Connect</p>
          <a href={INSTAGRAM} target="_blank" rel="noopener" className="text-[12px] text-dim hover:text-fg transition-colors tracking-wide">Instagram</a>
          <a href={TIKTOK} target="_blank" rel="noopener" className="text-[12px] text-dim hover:text-fg transition-colors tracking-wide">TikTok</a>
          <a href={`mailto:${STORE_EMAIL}`} className="text-[12px] text-dim hover:text-fg transition-colors tracking-wide">{STORE_EMAIL}</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-2">
        <p className="text-[10px] tracking-widest text-dim opacity-40 uppercase">© 2026 Wear Aura. All rights reserved.</p>
        <p className="text-[10px] tracking-widest text-dim opacity-40 uppercase">WEARAURA.SPACE</p>
      </div>
    </footer>
  )
}
