import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-fg font-sans">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-display text-[15px] tracking-[0.2em]">WEAR AURA</span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-dim">Admin</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/admin" className="text-[11px] tracking-[0.15em] uppercase text-dim hover:text-fg transition-colors">Dashboard</Link>
          <Link href="/admin/products" className="text-[11px] tracking-[0.15em] uppercase text-dim hover:text-fg transition-colors">Products</Link>
          <Link href="/admin/orders" className="text-[11px] tracking-[0.15em] uppercase text-dim hover:text-fg transition-colors">Orders</Link>
          <Link href="/" className="text-[11px] tracking-[0.15em] uppercase text-dim hover:text-fg transition-colors">← Store</Link>
        </nav>
      </header>
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  )
}
