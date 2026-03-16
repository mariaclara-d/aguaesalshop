export const dynamic = 'force-dynamic'

import { getSupabaseServer } from '@/lib/supabase-server'
import ProductForm from '@/components/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServer()
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
  if (!product) notFound()
  return <ProductForm product={product} />
}
