'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/store'
import { SHIPPING_FEE, FREE_SHIPPING_ABOVE } from '@/lib/config'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCart()
  const subtotal = total()
  const shipping = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE
  const grand = subtotal + shipping

  return (
    <>
      {/* overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-bg/70 backdrop-blur-sm z-50"
          onClick={closeCart}
        />
      )}

      {/* drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-surface z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="font-display text-[15px] tracking-[0.2em]">CART ({items.length})</span>
          <button
            onClick={closeCart}
            className="text-dim hover:text-fg transition-colors text-xl leading-none cursor-pointer"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <p className="text-dim text-sm tracking-widest uppercase">Your cart is empty</p>
              <button onClick={closeCart} className="text-[11px] tracking-[0.2em] uppercase text-fg underline underline-offset-4 cursor-pointer">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product_id}-${item.size}`} className="flex gap-4">
                <div className="w-16 h-20 bg-muted shrink-0 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dim text-[9px] tracking-widest">
                      IMG
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium tracking-wide truncate">{item.name}</p>
                  <p className="text-[11px] text-dim tracking-widest uppercase mt-0.5">Size: {item.size}</p>
                  <p className="text-sm mt-1">PKR {item.price.toLocaleString()}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 border border-border">
                      <button
                        onClick={() => updateQty(item.product_id, item.size, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-dim hover:text-fg transition-colors cursor-pointer"
                      >
                        −
                      </button>
                      <span className="text-xs w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product_id, item.size, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-dim hover:text-fg transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product_id, item.size)}
                      className="text-[10px] tracking-widest uppercase text-dim hover:text-fg transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-3">
            <div className="flex justify-between text-[12px] tracking-wide text-dim">
              <span>Subtotal</span>
              <span>PKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[12px] tracking-wide text-dim">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `PKR ${shipping}`}</span>
            </div>
            {subtotal < FREE_SHIPPING_ABOVE && (
              <p className="text-[10px] tracking-widest text-dim">
                PKR {(FREE_SHIPPING_ABOVE - subtotal).toLocaleString()} more for free shipping
              </p>
            )}
            <div className="flex justify-between text-sm font-medium tracking-wide pt-1 border-t border-border">
              <span>Total</span>
              <span>PKR {grand.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-accent text-fg text-center py-3.5 text-[11px] font-medium tracking-[0.22em] uppercase hover:opacity-85 transition-opacity mt-2"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
