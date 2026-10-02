import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminProducts() {
  const { data: products } = await supabase
    .from('products')
    .select('*, product_sizes(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[2.5rem] tracking-[0.05em]">PRODUCTS</h1>
        <Link href="/admin/products/new" className="bg-accent text-fg px-5 py-2.5 text-[11px] font-medium tracking-[0.2em] uppercase hover:opacity-85 transition-opacity">
          + Add Product
        </Link>
      </div>

      <div className="border border-border divide-y divide-border">
        {products?.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-dim text-sm">No products yet.</p>
            <Link href="/admin/products/new" className="mt-3 inline-block text-[11px] tracking-[0.2em] uppercase text-fg underline underline-offset-4">
              Add First Product
            </Link>
          </div>
        )}

        {products?.map((p) => (
          <div key={p.id} className="p-4 flex items-center gap-4">
            <div className="relative w-12 h-16 bg-surface shrink-0 overflow-hidden">
              {p.images?.[0] ? (
                <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium tracking-wide">{p.name}</p>
              <p className="text-[11px] text-dim mt-0.5">
                PKR {p.price.toLocaleString()} · {p.category ?? '—'} ·{' '}
                Sizes: {p.product_sizes?.map((s: { size: string; stock: number }) => `${s.size}(${s.stock})`).join(', ')}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[10px] tracking-[0.15em] uppercase ${p.is_active ? 'text-green-400' : 'text-dim'}`}>
                {p.is_active ? 'Active' : 'Hidden'}
              </span>
              <Link
                href={`/admin/products/${p.id}/edit`}
                className="text-[11px] tracking-[0.15em] uppercase text-dim hover:text-fg transition-colors border border-border px-3 py-1.5"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
