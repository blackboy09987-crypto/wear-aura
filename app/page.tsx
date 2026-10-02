import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import NewsletterForm from '@/components/NewsletterForm'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES } from '@/lib/config'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: featured }, { data: onSale }] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_sizes(*)')
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(4)
      .order('created_at', { ascending: false }),
    supabase
      .from('products')
      .select('*, product_sizes(*)')
      .eq('is_active', true)
      .not('compare_at_price', 'is', null)
      .limit(4)
      .order('created_at', { ascending: false }),
  ])

  return (
    <>
      <Navbar />

      {/* pt accounts for announcement bar + header height */}
      <div className="pt-[88px]">

        {/* HERO */}
        <section className="relative min-h-[85vh] flex flex-col justify-end pb-12 px-6 md:px-10 overflow-hidden bg-bg">
          {/* Halo rings */}
          <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-[min(56vw,480px)] aspect-square rounded-full absolute -translate-x-1/2 -translate-y-1/2" style={{ border: '1px solid rgba(27,47,138,0.35)', animation: 'aura-a 4.5s ease-in-out infinite' }} />
            <div className="w-[min(38vw,320px)] aspect-square rounded-full absolute -translate-x-1/2 -translate-y-1/2" style={{ border: '1px solid rgba(200,28,28,0.25)', animation: 'aura-b 4.5s ease-in-out infinite 1s' }} />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-dim mb-4 relative z-10">A New Aura Is Loading</p>
          <h1 className="font-display text-[clamp(5rem,15vw,13rem)] leading-[0.86] tracking-[0.01em] relative z-10 mb-7">
            <span style={{ color: '#C81C1C' }}>WEAR</span><br />
            <span style={{ color: '#1B2F8A' }}>AURA.</span>
          </h1>
          <div className="flex items-center gap-5 relative z-10 flex-wrap">
            <Link href="/shop" className="bg-accent text-fg px-8 py-3.5 text-[11px] font-medium tracking-[0.22em] uppercase hover:opacity-85 transition-opacity">
              Shop Now
            </Link>
            <Link href="/shop?sale=1" style={{ borderColor: '#1B2F8A', color: '#1B2F8A' }} className="border px-8 py-3.5 text-[11px] font-medium tracking-[0.22em] uppercase hover:opacity-80 transition-opacity">
              Sale
            </Link>
          </div>
          <style>{`
            @keyframes aura-a { 0%,100%{opacity:.35;transform:translate(-50%,-50%) scale(.93)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.06)} }
            @keyframes aura-b { 0%,100%{opacity:.25;transform:translate(-50%,-50%) scale(.97)} 50%{opacity:.8;transform:translate(-50%,-50%) scale(1.03)} }
          `}</style>
        </section>

        {/* TICKER */}
        <div className="overflow-hidden border-y border-border py-3">
          <div className="flex gap-10 whitespace-nowrap" style={{ animation: 'marquee 22s linear infinite' }}>
            {['New Drop', 'Wear The Fit', 'Own The Aura', 'Pakistan', 'New Drop', 'Wear The Fit', 'Own The Aura', 'Pakistan'].map((t, i) => (
              <span key={i} className="font-display text-[13px] tracking-[0.25em] text-dim italic shrink-0">
                {t} <span className="text-border mx-2 not-italic">●</span>
              </span>
            ))}
          </div>
          <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
        </div>

        {/* COLLECTION BANNERS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {CATEGORIES.slice(0, 4).map((cat) => (
            <Link
              key={cat}
              href={`/shop?cat=${cat}`}
              className="relative aspect-[2/3] bg-surface flex flex-col items-center justify-end pb-6 overflow-hidden group"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-[clamp(3rem,8vw,5rem)] tracking-[0.05em] text-fg/10 group-hover:text-fg/20 transition-colors">
                  {cat.toUpperCase()}
                </span>
              </div>
              <div className="relative z-10 text-center">
                <p className="text-[10px] tracking-[0.3em] uppercase text-dim mb-2">{cat}</p>
                <span className="text-[11px] tracking-[0.2em] uppercase border border-border px-4 py-2 text-dim group-hover:text-fg group-hover:border-dim transition-colors">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* FEATURED PRODUCTS */}
        {featured && featured.length > 0 && (
          <section className="px-6 md:px-10 py-14 max-w-6xl mx-auto w-full">
            <div className="flex items-end justify-between mb-7">
              <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] tracking-[0.05em]">NEW DROPS</h2>
              <Link href="/shop" className="text-[11px] tracking-[0.2em] uppercase text-dim hover:text-fg transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* SALE BANNER */}
        <section className="mx-6 md:mx-10 my-2 border border-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-dim mb-2">Limited Time</p>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[0.04em]">SALE IS LIVE</h2>
            <p className="text-sm text-dim mt-2">Up to 50% off on selected items</p>
          </div>
          <Link
            href="/shop?sale=1"
            className="bg-accent text-fg px-10 py-4 text-[11px] font-medium tracking-[0.22em] uppercase hover:opacity-85 transition-opacity whitespace-nowrap"
          >
            Shop Sale
          </Link>
        </section>

        {/* SALE PRODUCTS */}
        {onSale && onSale.length > 0 && (
          <section className="px-6 md:px-10 py-14 max-w-6xl mx-auto w-full">
            <div className="flex items-end justify-between mb-7">
              <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] tracking-[0.05em]">
                ON SALE <span className="text-accent">NOW</span>
              </h2>
              <Link href="/shop?sale=1" className="text-[11px] tracking-[0.2em] uppercase text-dim hover:text-fg transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {onSale.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* BRAND STRIP */}
        <section className="border-t border-border px-6 md:px-10 py-14 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-dim mb-4">The Aura</p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9] tracking-[0.02em] mb-5">
              <span style={{ color: '#C81C1C' }}>NOT</span> ANOTHER<br />
              <span style={{ color: '#1B2F8A' }}>CLOTHING</span><br />
              BRAND.
            </h2>
            <p className="text-sm text-dim leading-relaxed max-w-sm">
              Wear the fit. Own the aura. Pieces built with intention, worn with attitude. Pakistan, 2026.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[['Quality First', 'Every piece checked before it ships'], ['Pakistan Made', 'Designed and sourced locally'], ['Limited Drops', 'Small batches, no restocks'], ['Real Fits', 'Worn by real people']].map(([title, desc]) => (
              <div key={title} className="border border-border p-5">
                <p className="font-display text-[13px] tracking-[0.12em] mb-1">{title!.toUpperCase()}</p>
                <p className="text-[11px] text-dim leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="bg-surface border-y border-border px-6 py-12 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-dim mb-3">Stay Updated</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] tracking-[0.05em] mb-6">JOIN THE AURA</h2>
          <NewsletterForm />
        </section>

        <Footer />
      </div>
    </>
  )
}
