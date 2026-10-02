import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'
import { PAYMENT_DETAILS, WHATSAPP_NUMBER } from '@/lib/config'

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ method?: string }>
}) {
  const { id } = await params
  const { method } = await searchParams

  const supabase = await createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-dim text-sm tracking-widest uppercase">Order not found.</p>
        </div>
      </>
    )
  }

  const pm = method ?? order.payment_method

  return (
    <>
      <Navbar />
      <main className="pt-24 px-6 md:px-10 max-w-2xl mx-auto py-10">
        {/* Confirmation header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-fg/20 rounded-full mb-5">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] tracking-[0.05em] mb-2">ORDER PLACED!</h1>
          <p className="text-dim text-sm tracking-widest uppercase">
            Order #{order.order_number}
          </p>
        </div>

        {/* Payment Instructions */}
        <div className="border border-border p-6 mb-6">
          <h2 className="text-[11px] tracking-[0.3em] uppercase text-dim mb-4">Payment Details</h2>

          {pm === 'cod' && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Cash on Delivery</p>
              <p className="text-sm text-dim">Pay <span className="text-fg font-medium">PKR {order.total.toLocaleString()}</span> when your order arrives.</p>
              <p className="text-[11px] text-dim tracking-wide mt-2">Delivery in 3–7 business days.</p>
            </div>
          )}

          {(pm === 'easypaisa' || pm === 'jazzcash') && (
            <div className="space-y-3">
              <p className="text-sm font-medium">{PAYMENT_DETAILS[pm as 'easypaisa' | 'jazzcash'].label}</p>
              <div className="bg-muted p-4 space-y-2">
                <Row label="Send to" value={PAYMENT_DETAILS[pm as 'easypaisa' | 'jazzcash'].number} />
                <Row label="Account Name" value={PAYMENT_DETAILS[pm as 'easypaisa' | 'jazzcash'].account_name} />
                <Row label="Amount" value={`PKR ${order.total.toLocaleString()}`} highlight />
              </div>
              <p className="text-[11px] text-dim tracking-wide">
                After payment, send screenshot on WhatsApp to confirm your order.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I placed order ${order.order_number} and sent payment via ${PAYMENT_DETAILS[pm as 'easypaisa' | 'jazzcash'].label}.`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase hover:border-dim transition-colors mt-1"
              >
                Send Screenshot on WhatsApp
              </a>
            </div>
          )}

          {pm === 'bank_transfer' && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Bank Transfer</p>
              <div className="bg-muted p-4 space-y-2">
                <Row label="Bank" value={PAYMENT_DETAILS.bank_transfer.bank_name} />
                <Row label="Account Title" value={PAYMENT_DETAILS.bank_transfer.account_title} />
                <Row label="Account No" value={PAYMENT_DETAILS.bank_transfer.account_number} />
                <Row label="IBAN" value={PAYMENT_DETAILS.bank_transfer.iban} />
                <Row label="Amount" value={`PKR ${order.total.toLocaleString()}`} highlight />
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I placed order ${order.order_number} and sent payment via bank transfer.`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase hover:border-dim transition-colors mt-1"
              >
                Send Receipt on WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Order items */}
        <div className="border border-border p-6 mb-6">
          <h2 className="text-[11px] tracking-[0.3em] uppercase text-dim mb-4">Your Items</h2>
          <div className="space-y-3">
            {order.order_items?.map((item: {
              id: string; product_name: string; size: string; quantity: number; price: number
            }) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium tracking-wide">{item.product_name}</p>
                  <p className="text-[11px] text-dim">Size: {item.size} · Qty: {item.quantity}</p>
                </div>
                <p>PKR {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 space-y-1">
            <div className="flex justify-between text-sm text-dim">
              <span>Subtotal</span><span>PKR {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-dim">
              <span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : `PKR ${order.shipping}`}</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-1">
              <span>Total</span><span>PKR {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="border border-border p-6 mb-8">
          <h2 className="text-[11px] tracking-[0.3em] uppercase text-dim mb-4">Delivery To</h2>
          <p className="text-sm font-medium">{order.customer_name}</p>
          <p className="text-sm text-dim mt-1">{order.address}</p>
          <p className="text-sm text-dim">{order.city}, {order.province}</p>
          <p className="text-sm text-dim">{order.customer_phone}</p>
        </div>

        <div className="text-center">
          <Link href="/shop" className="text-[11px] tracking-[0.2em] uppercase text-fg hover:opacity-70 transition-opacity underline underline-offset-4">
            Continue Shopping
          </Link>
        </div>
      </main>
    </>
  )
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-dim text-[11px] tracking-widest uppercase shrink-0">{label}</span>
      <span className={`text-right ${highlight ? 'font-medium text-fg' : 'text-dim'}`}>{value}</span>
    </div>
  )
}
