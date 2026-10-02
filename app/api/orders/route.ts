import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, phone, email, address, city, province,
      payment_method, subtotal, shipping, total, notes, items
    } = body

    if (!name || !phone || !address || !city || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate order number WA-XXXXX
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    const orderNum = `WA-${String((count ?? 0) + 1).padStart(4, '0')}`

    // Create order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNum,
        customer_name: name,
        customer_phone: phone,
        customer_email: email || null,
        address,
        city,
        province,
        payment_method,
        subtotal,
        shipping,
        total,
        notes: notes || null,
        status: 'pending',
      })
      .select()
      .single()

    if (orderErr) throw orderErr

    // Create order items
    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(
        items.map((i: {
          product_id: string; product_name: string; product_image?: string
          size: string; quantity: number; price: number
        }) => ({
          order_id: order.id,
          product_id: i.product_id,
          product_name: i.product_name,
          product_image: i.product_image ?? null,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
        }))
      )

    if (itemsErr) throw itemsErr

    // Decrement stock
    for (const item of items) {
      await supabase.rpc('decrement_stock', {
        p_product_id: item.product_id,
        p_size: item.size,
        p_qty: item.quantity,
      })
    }

    return NextResponse.json({ order_id: order.id, order_number: orderNum })
  } catch (err: unknown) {
    console.error('Order error:', err)
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
