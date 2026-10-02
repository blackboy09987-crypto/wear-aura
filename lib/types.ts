export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  images: string[]
  category: string | null
  tags: string[]
  is_active: boolean
  is_featured: boolean
  created_at: string
  product_sizes?: ProductSize[]
}

export type ProductSize = {
  id: string
  product_id: string
  size: string
  stock: number
}

export type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  address: string
  city: string
  province: string
  payment_method: 'cod' | 'easypaisa' | 'jazzcash' | 'bank_transfer'
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes: string | null
  created_at: string
  order_items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string | null
  size: string
  quantity: number
  price: number
}

export type CartItem = {
  product_id: string
  slug: string
  name: string
  image: string | null
  size: string
  price: number
  quantity: number
}
