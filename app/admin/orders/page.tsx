'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Order } from '@/lib/types'

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 border-yellow-400/30',
  confirmed: 'text-blue-400 border-blue-400/30',
  processing: 'text-blue-400 border-blue-400/30',
  shipped: 'text-purple-400 border-purple-400/30',
  delivered: 'text-green-400 border-green-400/30',
  cancelled: 'text-red-400 border-red-400/30',
}

const PM_LABELS: Record<string, string> = {
  cod: 'COD', easypaisa: 'Easypaisa', jazzcash: 'JazzCash', bank_transfer: 'Bank'
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = async () => {
    const supabase = createClient()
    let q = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setOrders(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: status as Order['status'] } : o))
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-[2.5rem] tracking-[0.05em]">ORDERS</h1>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-colors cursor-pointer ${
              filter === s ? 'border-fg bg-accent text-fg' : 'border-border text-dim hover:text-fg'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border border-dim border-t-fg rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-border p-8 text-center">
          <p className="text-sm text-dim">No orders found.</p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {orders.map((order) => (
            <div key={order.id}>
              <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-surface/50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-sm font-medium tracking-wide">{order.order_number}</p>
                    <span className={`text-[9px] tracking-[0.2em] uppercase border px-2 py-0.5 ${STATUS_COLORS[order.status] ?? 'text-dim border-border'}`}>
                      {order.status}
                    </span>
                    <span className="text-[10px] text-dim tracking-widest uppercase">{PM_LABELS[order.payment_method]}</span>
                  </div>
                  <p className="text-[11px] text-dim mt-1">{order.customer_name} · {order.customer_phone} · {order.city}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">PKR {order.total.toLocaleString()}</p>
                  <p className="text-[10px] text-dim mt-0.5">{new Date(order.created_at).toLocaleDateString('en-PK')}</p>
                </div>
              </div>

              {expanded === order.id && (
                <div className="px-4 pb-4 bg-surface/30 border-t border-border space-y-4">
                  {/* Items */}
                  <div className="pt-3">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-dim mb-2">Items</p>
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span className="text-dim">{item.product_name} · {item.size} × {item.quantity}</span>
                        <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery */}
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-dim mb-2">Delivery</p>
                    <p className="text-sm text-dim">{order.address}, {order.city}, {order.province}</p>
                    {order.notes && <p className="text-sm text-dim mt-1">Note: {order.notes}</p>}
                  </div>

                  {/* Update status */}
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-dim mb-2">Update Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order.id, s)}
                          className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors cursor-pointer ${
                            order.status === s ? 'border-fg bg-accent text-fg' : 'border-border text-dim hover:text-fg'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
