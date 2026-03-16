export const dynamic = 'force-dynamic'

import { getSupabaseServer } from '@/lib/supabase-server'
import ProductDetail from '@/components/ProductDetail'
import { notFound } from 'next/navigation'

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServer()
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
  if (!product) notFound()
  return <ProductDetail product={product} />
}
