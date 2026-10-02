import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminDashboard() {
  const [
    { count: totalOrders },
    { count: pendingOrders },
    { data: recentOrders },
    { count: totalProducts },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('order_number, customer_name, total, status, created_at, payment_method').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])

  const stats = [
    { label: 'Total Orders', value: totalOrders ?? 0 },
    { label: 'Pending', value: pendingOrders ?? 0 },
    { label: 'Active Products', value: totalProducts ?? 0 },
  ]

  const STATUS_COLORS: Record<string, string> = {
    pending: 'text-yellow-400',
    confirmed: 'text-blue-400',
    processing: 'text-blue-400',
    shipped: 'text-purple-400',
    delivered: 'text-green-400',
    cancelled: 'text-red-400',
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-[2.5rem] tracking-[0.05em]">DASHBOARD</h1>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-border p-6">
            <p className="text-[10px] tracking-[0.25em] uppercase text-dim mb-2">{s.label}</p>
            <p className="font-display text-[2.5rem] tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link href="/admin/products/new" className="bg-accent text-fg px-5 py-2.5 text-[11px] font-medium tracking-[0.2em] uppercase hover:opacity-85 transition-opacity">
          + New Product
        </Link>
        <Link href="/admin/orders" className="border border-border px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-dim hover:text-fg transition-colors">
          View All Orders
        </Link>
      </div>

      <div>
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-dim mb-4">Recent Orders</h2>
        <div className="border border-border divide-y divide-border">
          {recentOrders?.length === 0 && (
            <p className="p-4 text-sm text-dim">No orders yet.</p>
          )}
          {recentOrders?.map((o) => (
            <div key={o.order_number} className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-medium tracking-wide">{o.order_number}</p>
                <p className="text-[11px] text-dim mt-0.5">{o.customer_name} · {o.payment_method}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm">PKR {o.total.toLocaleString()}</p>
                <span className={`text-[10px] tracking-[0.2em] uppercase ${STATUS_COLORS[o.status] ?? 'text-dim'}`}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
