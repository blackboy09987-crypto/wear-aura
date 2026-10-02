'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from './types'

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (product_id: string, size: string) => void
  updateQty: (product_id: string, size: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  count: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.product_id === item.product_id && i.size === item.size
        )
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.product_id === item.product_id && i.size === item.size
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            isOpen: true,
          }))
        } else {
          set((s) => ({ items: [...s.items, item], isOpen: true }))
        }
      },

      removeItem: (product_id, size) =>
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.product_id === product_id && i.size === size)
          ),
        })),

      updateQty: (product_id, size, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter(
                  (i) => !(i.product_id === product_id && i.size === size)
                )
              : s.items.map((i) =>
                  i.product_id === product_id && i.size === size
                    ? { ...i, quantity: qty }
                    : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'wear-aura-cart' }
  )
)
