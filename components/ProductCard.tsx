import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0]
  const sizes = product.product_sizes ?? []
  const hasStock = sizes.some((s) => s.stock > 0)
  const isOnSale = product.compare_at_price && product.compare_at_price > product.price
  const discount = isOnSale
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : null

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-surface overflow-hidden mb-3">
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-[28px] tracking-[0.3em] text-muted">AURA</span>
          </div>
        )}

        {/* Sale badge */}
        {discount && (
          <div className="absolute top-2 left-2 bg-accent text-fg text-[9px] font-medium tracking-[0.12em] px-2 py-1">
            -{discount}%
          </div>
        )}

        {/* Sold out overlay */}
        {!hasStock && (
          <div className="absolute inset-0 bg-bg/55 flex items-center justify-center">
            <span className="text-[10px] tracking-[0.25em] uppercase text-dim border border-border px-3 py-1 bg-bg/80">
              Sold Out
            </span>
          </div>
        )}

        {/* Size chips on hover */}
        {sizes.length > 0 && hasStock && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {sizes.map(({ size, stock }) => (
              <span
                key={size}
                className={`text-[9px] tracking-wider px-1.5 py-0.5 font-medium ${
                  stock > 0
                    ? 'bg-bg text-fg'
                    : 'bg-bg/50 text-dim line-through'
                }`}
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-[12px] tracking-wide leading-snug">{product.name}</p>
        <div className="flex items-center gap-2">
          <p className="text-[12px]">PKR {product.price.toLocaleString()}</p>
          {isOnSale && (
            <p className="text-[11px] text-dim line-through">
              PKR {product.compare_at_price!.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
