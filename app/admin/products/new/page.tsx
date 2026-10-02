'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, SIZES } from '@/lib/config'

type SizeEntry = { size: string; stock: number }

export default function NewProduct() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', compare_at_price: '',
    category: CATEGORIES[0], is_active: true, is_featured: false,
  })
  const [sizes, setSizes] = useState<SizeEntry[]>(SIZES.map((s) => ({ size: s, stock: 0 })))
  const [images, setImages] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string | boolean) => {
    setForm((f) => {
      const next = { ...f, [k]: v }
      if (k === 'name') next.slug = (v as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return next
    })
  }

  const setStock = (size: string, val: string) =>
    setSizes((prev) => prev.map((s) => s.size === size ? { ...s, stock: parseInt(val) || 0 } : s))

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setImages((prev) => [...prev, ...files].slice(0, 5))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) { setError('Name and price are required.'); return }
    const compareAt = form.compare_at_price ? parseFloat(form.compare_at_price) : null
    if (compareAt !== null && compareAt <= parseFloat(form.price)) {
      setError('Original price must be higher than sale price.')
      return
    }
    setError('')
    setUploading(true)

    const supabase = createClient()

    const imageUrls: string[] = []
    for (const file of images) {
      const ext = file.name.split('.').pop()
      const path = `products/${form.slug}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('product-images').upload(path, file)
      if (uploadErr) { setError('Image upload failed: ' + uploadErr.message); setUploading(false); return }
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      imageUrls.push(data.publicUrl)
    }

    const { data: product, error: pErr } = await supabase
      .from('products')
      .insert({
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        price: parseFloat(form.price),
        compare_at_price: compareAt,
        category: form.category,
        images: imageUrls,
        is_active: form.is_active,
        is_featured: form.is_featured,
      })
      .select()
      .single()

    if (pErr) { setError(pErr.message); setUploading(false); return }

    const activeSizes = sizes.filter((s) => s.stock > 0)
    if (activeSizes.length > 0) {
      await supabase.from('product_sizes').insert(
        activeSizes.map((s) => ({ product_id: product.id, size: s.size, stock: s.stock }))
      )
    }

    router.push('/admin/products')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-[2.5rem] tracking-[0.05em]">NEW PRODUCT</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <AField label="Product Name *" value={form.name} onChange={(v) => set('name', v)} placeholder="Aura Tee" />
          <AField label="Slug" value={form.slug} onChange={(v) => set('slug', v)} placeholder="aura-tee" />
          <AField label="Sale Price (PKR) *" value={form.price} onChange={(v) => set('price', v)} placeholder="1999" type="number" />
          <div className="flex flex-col gap-1.5">
            <AField label="Original Price (PKR)" value={form.compare_at_price} onChange={(v) => set('compare_at_price', v)} placeholder="2999 (leave blank if no sale)" type="number" />
            {form.compare_at_price && parseFloat(form.compare_at_price) > parseFloat(form.price || '0') && (
              <p className="text-[10px] text-green-400 tracking-wide">
                {Math.round((1 - parseFloat(form.price || '0') / parseFloat(form.compare_at_price)) * 100)}% off badge will show
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.2em] uppercase text-dim">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="bg-surface border border-border px-3 py-2.5 text-sm text-fg focus:border-dim focus:outline-none appearance-none"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <AField label="Description" value={form.description} onChange={(v) => set('description', v)} placeholder="Brief product description..." />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={form.is_active}
              onChange={(e) => set('is_active', e.target.checked)}
              className="w-4 h-4 accent-fg cursor-pointer"
            />
            <label htmlFor="active" className="text-[11px] tracking-[0.15em] uppercase text-dim cursor-pointer">Active (visible in store)</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={form.is_featured}
              onChange={(e) => set('is_featured', e.target.checked)}
              className="w-4 h-4 accent-fg cursor-pointer"
            />
            <label htmlFor="featured" className="text-[11px] tracking-[0.15em] uppercase text-dim cursor-pointer">Featured (show on homepage)</label>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-dim mb-3">Stock per Size</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {sizes.map(({ size, stock }) => (
              <div key={size} className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-widest uppercase text-center text-dim">{size}</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(size, e.target.value)}
                  className="bg-surface border border-border px-2 py-2 text-sm text-center text-fg focus:border-dim focus:outline-none w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-dim mb-3">Product Images (max 5)</p>
          <label className="flex flex-col items-center justify-center border border-dashed border-border p-6 cursor-pointer hover:border-dim transition-colors">
            <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
            <p className="text-sm text-dim">Click to upload images</p>
            {images.length > 0 && (
              <p className="text-[11px] text-fg mt-2">{images.length} file(s) selected</p>
            )}
          </label>
        </div>

        {error && <p className="text-[11px] text-red-400 tracking-wide">{error}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="bg-accent text-fg px-8 py-3.5 text-[11px] font-medium tracking-[0.22em] uppercase hover:opacity-85 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-wait"
        >
          {uploading ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  )
}

function AField({
  label, value, onChange, placeholder, type = 'text'
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
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
