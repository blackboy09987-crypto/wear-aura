import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES } from '@/lib/config'

export const revalidate = 60

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sale?: string }>
}) {
  const { cat, sale } = await searchParams
  const isSale = sale === '1'
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*, product_sizes(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (cat) query = query.eq('category', cat)
  if (isSale) query = query.not('compare_at_price', 'is', null)

  const { data: products } = await query

  const saleProducts = isSale
    ? products?.filter((p) => p.compare_at_price && p.compare_at_price > p.price)
    : products

  const title = isSale ? 'SALE' : cat ? cat.toUpperCase() : 'ALL DROPS'

  return (
    <>
      <Navbar />
      <main className="pt-24 px-6 md:px-10 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8 pt-6">
          <h1 className={`font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[0.03em] ${isSale ? 'text-accent' : ''}`}>
            {title}
          </h1>
          {saleProducts && (
            <p className="text-[11px] text-dim tracking-widest uppercase">{saleProducts.length} pieces</p>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-10">
          <a
            href="/shop"
            className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-colors ${
              !cat && !isSale ? 'border-accent bg-accent text-fg' : 'border-border text-dim hover:text-fg hover:border-dim'
            }`}
          >
            All
          </a>
          {CATEGORIES.map((c) => (
            <a
              key={c}
              href={`/shop?cat=${c}`}
              className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-colors ${
                cat === c ? 'border-accent bg-accent text-fg' : 'border-border text-dim hover:text-fg hover:border-dim'
              }`}
            >
              {c}
            </a>
          ))}
          <a
            href="/shop?sale=1"
            className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-colors font-medium ${
              isSale ? 'border-accent bg-accent text-fg' : 'border-accent/40 text-accent hover:border-accent'
            }`}
          >
            Sale
          </a>
        </div>

        {/* Grid */}
        {saleProducts && saleProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {saleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-[3rem] tracking-widest text-muted mb-3">
              {isSale ? 'NO SALE' : 'EMPTY'}
            </p>
            <p className="text-sm text-dim tracking-widest uppercase">
              {isSale ? 'No sale items right now — check back soon.' : 'No products yet — drop coming soon.'}
            </p>
          </div>
        )}

        <div className="pb-16" />
      </main>
      <Footer />
    </>
  )
}
