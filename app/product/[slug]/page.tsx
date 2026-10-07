import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductInteractive from '@/components/ProductInteractive'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, product_sizes(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  return (
    <>
      <Navbar />
      <main className="pt-24 px-6 md:px-10 max-w-6xl mx-auto py-10">
        <ProductInteractive product={product} />
      </main>
      <Footer />
    </>
  )
}
