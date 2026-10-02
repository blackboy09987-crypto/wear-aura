'use client'
import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setDone(true)
  }

  if (done) {
    return <p className="text-sm text-dim tracking-widest uppercase">You&apos;re on the list.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm mx-auto border border-border">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-transparent px-4 py-3 text-sm text-fg placeholder:text-dim/50 focus:outline-none min-w-0"
      />
      <button
        type="submit"
        className="bg-accent text-fg px-5 py-3 text-[10px] font-medium tracking-[0.2em] uppercase hover:opacity-85 transition-opacity whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  )
}
