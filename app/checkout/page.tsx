'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { useCart } from '@/lib/store'
import { SHIPPING_FEE, FREE_SHIPPING_ABOVE, PROVINCES, PAYMENT_DETAILS } from '@/lib/config'

type PaymentMethod = 'cod' | 'easypaisa' | 'jazzcash' | 'bank_transfer'

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; desc: string }[] = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
  { id: 'easypaisa', label: 'Easypaisa', desc: 'Mobile wallet transfer' },
  { id: 'jazzcash', label: 'JazzCash', desc: 'Mobile wallet transfer' },
  { id: 'bank_transfer', label: 'Bank Transfer', desc: 'Direct bank deposit' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const subtotal = total()
  const shipping = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE
  const grand = subtotal + shipping

  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', city: '', province: 'Punjab', notes: ''
  })
  const [payment, setPayment] = useState<PaymentMethod>('cod')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
          <p className="font-display text-[3rem] tracking-widest text-muted">EMPTY</p>
          <p className="text-sm text-dim">Your cart is empty.</p>
          <Link href="/shop" className="text-[11px] tracking-[0.2em] uppercase text-fg underline underline-offset-4">
            Shop Now
          </Link>
        </div>
      </>
    )
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address || !form.city) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          payment_method: payment,
          subtotal,
          shipping,
          total: grand,
          items: items.map((i) => ({
            product_id: i.product_id,
            product_name: i.name,
            product_image: i.image,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')

      clearCart()
      router.push(`/order/${data.order_id}?method=${payment}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 px-6 md:px-10 max-w-5xl mx-auto py-10">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] tracking-[0.05em] mb-10">CHECKOUT</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-10">
          {/* Left */}
          <div className="space-y-8">
            {/* Contact */}
            <section>
              <h2 className="text-[11px] tracking-[0.3em] uppercase text-dim mb-4 pb-2 border-b border-border">
                Contact Info
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name *" value={form.name} onChange={(v) => set('name', v)} placeholder="Ahmed Khan" />
                <Field label="Phone Number *" value={form.phone} onChange={(v) => set('phone', v)} placeholder="0300-0000000" type="tel" />
                <Field label="Email (optional)" value={form.email} onChange={(v) => set('email', v)} placeholder="ahmed@email.com" type="email" className="sm:col-span-2" />
              </div>
            </section>

            {/* Address */}
            <section>
              <h2 className="text-[11px] tracking-[0.3em] uppercase text-dim mb-4 pb-2 border-b border-border">
                Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Street Address *" value={form.address} onChange={(v) => set('address', v)} placeholder="House #, Street, Area" className="sm:col-span-2" />
                <Field label="City *" value={form.city} onChange={(v) => set('city', v)} placeholder="Lahore" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-dim">Province *</label>
                  <select
                    value={form.province}
                    onChange={(e) => set('province', e.target.value)}
                    className="bg-surface border border-border px-3 py-2.5 text-sm text-fg focus:border-dim focus:outline-none appearance-none"
                  >
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <Field label="Order Notes (optional)" value={form.notes} onChange={(v) => set('notes', v)} placeholder="Any special instructions..." className="sm:col-span-2" />
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-[11px] tracking-[0.3em] uppercase text-dim mb-4 pb-2 border-b border-border">
                Payment Method
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPayment(opt.id)}
                    className={`p-4 border text-left transition-colors cursor-pointer ${
                      payment === opt.id ? 'border-fg' : 'border-border hover:border-dim'
                    }`}
                  >
                    <p className="text-sm font-medium tracking-wide">{opt.label}</p>
                    <p className="text-[11px] text-dim mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right — Order summary */}
          <div className="space-y-0">
            <div className="border border-border p-6 sticky top-24">
              <h2 className="text-[11px] tracking-[0.3em] uppercase text-dim mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={`${item.product_id}-${item.size}`} className="flex gap-3 items-start">
                    <div className="relative w-12 h-16 bg-surface shrink-0 overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <p className="text-[10px] text-dim">Size: {item.size} · Qty: {item.quantity}</p>
                      <p className="text-xs mt-0.5">PKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-[12px] text-dim">
                  <span>Subtotal</span><span>PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[12px] text-dim">
                  <span>Shipping</span><span>{shipping === 0 ? 'FREE' : `PKR ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-border">
                  <span>Total</span><span>PKR {grand.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <p className="text-[11px] text-red-400 mt-3 tracking-wide">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-5 bg-accent text-fg py-4 text-[11px] font-medium tracking-[0.22em] uppercase hover:opacity-85 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-wait"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-[10px] text-dim text-center mt-3 tracking-wide">
                Pakistan-wide delivery · 3–7 days
              </p>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text', className = ''
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] tracking-[0.2em] uppercase text-dim">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-surface border border-border px-3 py-2.5 text-sm text-fg placeholder:text-dim/50 focus:border-dim focus:outline-none"
      />
    </div>
  )
}
