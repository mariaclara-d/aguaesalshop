export const dynamic = 'force-dynamic'

import { getSupabaseServer } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

async function getProducts(categoria?: string): Promise<Product[]> {
  const supabase = await getSupabaseServer()
  let query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (categoria) query = query.ilike('category', categoria)
  const { data } = await query
  return data || []
}

export default async function ProdutosPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams
  const products = await getProducts(categoria)

  const categorias = ['Todos', 'Anéis', 'Colares', 'Pulseiras', 'Brincos']

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl text-[#1e3a5f] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
        Nossas Joias
      </h1>
      <p className="text-gray-500 mb-8">Prata 925 artesanal com alma praiana</p>

      <div className="flex gap-3 flex-wrap mb-10">
        {categorias.map(cat => {
          const val = cat === 'Todos' ? undefined : cat.toLowerCase()
          const active = (!categoria && cat === 'Todos') || categoria === val
          return (
            <a
              key={cat}
              href={val ? `/produtos?categoria=${val}` : '/produtos'}
              className={`px-5 py-2 text-sm tracking-widest uppercase border transition-colors ${active ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'}`}
            >
              {cat}
            </a>
          )
        })}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="font-playfair text-2xl" style={{ fontFamily: 'var(--font-playfair)' }}>Nenhuma peça encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
