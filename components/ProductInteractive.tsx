'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/lib/store'
import type { Product } from '@/lib/types'

export default function ProductInteractive({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const sizes = product.product_sizes ?? []
  const selectedSizeData = sizes.find((s) => s.size === selectedSize)
  const inStock = selectedSizeData ? selectedSizeData.stock > 0 : false
  const images = product.images ?? []
  const isOnSale = product.compare_at_price && product.compare_at_price > product.price

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      image: images[0] ?? null,
      size: selectedSize,
      price: product.price,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
      {/* Images */}
      <div className="space-y-3">
        <div className="relative aspect-[3/4] bg-surface overflow-hidden">
          {images[activeImg] ? (
            <Image src={images[activeImg]} alt={product.name} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-[4rem] tracking-[0.3em] text-muted">AURA</span>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative w-16 h-20 shrink-0 bg-surface overflow-hidden border transition-colors cursor-pointer ${
                  activeImg === i ? 'border-fg' : 'border-transparent'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6">
        {product.category && (
          <p className="text-[10px] tracking-[0.3em] uppercase text-dim">{product.category}</p>
        )}
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-[0.05em]">
          {product.name.toUpperCase()}
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-lg tracking-wide">PKR {product.price.toLocaleString()}</p>
          {isOnSale && (
            <p className="text-sm text-dim line-through">PKR {product.compare_at_price!.toLocaleString()}</p>
          )}
        </div>

        {product.description && (
          <p className="text-sm text-dim leading-relaxed border-t border-border pt-4">
            {product.description}
          </p>
        )}

        {/* Size selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] tracking-[0.2em] uppercase">Select Size</p>
            {selectedSizeData && (
              <p className="text-[10px] text-dim tracking-widest">
                {selectedSizeData.stock > 0 ? `${selectedSizeData.stock} left` : 'Sold out'}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map(({ size, stock }) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={stock === 0}
                className={`w-12 h-12 text-[11px] font-medium tracking-widest uppercase border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  selectedSize === size ? 'border-accent bg-accent text-fg' : 'border-border hover:border-dim'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || !inStock}
          className="w-full py-4 text-[12px] font-medium tracking-[0.22em] uppercase transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-accent text-fg hover:opacity-85"
        >
          {!selectedSize ? 'Select a Size' : !inStock ? 'Sold Out' : added ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>

        {/* Details */}
        <div className="border-t border-border pt-4 space-y-3">
          {[
            ['Delivery', 'Pakistan-wide · 3–7 days'],
            ['Payment', 'COD · Easypaisa · JazzCash · Bank Transfer'],
            ['Returns', 'Exchange within 7 days of delivery'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-4">
              <p className="text-[11px] tracking-widest uppercase text-dim w-20 shrink-0">{k}</p>
              <p className="text-[12px] text-dim">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
