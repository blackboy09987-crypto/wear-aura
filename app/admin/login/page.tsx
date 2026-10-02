'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Wrong password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-display text-[2rem] tracking-[0.2em] mb-8">ADMIN</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="w-full bg-surface border border-border px-4 py-3 text-sm text-fg placeholder:text-dim/50 focus:border-dim focus:outline-none"
          />
          {error && <p className="text-[11px] text-red-400 tracking-wide">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-fg py-3 text-[11px] font-medium tracking-[0.22em] uppercase hover:opacity-85 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
