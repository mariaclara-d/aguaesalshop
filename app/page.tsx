export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { getSupabaseServer } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)
  return data || []
}

export default async function Home() {
  const products = await getFeaturedProducts()

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1e3a5f] text-white min-h-[85vh] flex items-center">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center py-20">
          <div>
            <p className="text-[#c9a96e] tracking-widest uppercase text-sm mb-4">Joias em Prata 925</p>
            <h1 className="font-playfair text-5xl md:text-6xl leading-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Beleza que vem<br />do mar
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-md">
              Peças artesanais em prata 925 inspiradas na leveza e liberdade do oceano. Cada joia carrega a essência da água e do sal.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/produtos" className="btn-primary">Ver Coleção</Link>
              <Link href="/sobre" className="btn-outline border-white text-white hover:bg-white hover:text-[#1e3a5f]">Nossa História</Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Image src="/logo.png" alt="Água e Sal" width={380} height={380} className="opacity-90" />
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-playfair text-3xl text-center text-[#1e3a5f] mb-10" style={{ fontFamily: 'var(--font-playfair)' }}>
          Nossas Categorias
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Anéis', 'Colares', 'Pulseiras', 'Brincos'].map(cat => (
            <Link
              key={cat}
              href={`/produtos?categoria=${cat.toLowerCase()}`}
              className="bg-[#1e3a5f] text-white text-center py-8 rounded-sm hover:bg-[#2a4f7c] transition-colors"
            >
              <p className="font-playfair text-xl" style={{ fontFamily: 'var(--font-playfair)' }}>{cat}</p>
              <p className="text-blue-200 text-xs tracking-widest mt-1 uppercase">Ver peças</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-playfair text-3xl text-[#1e3a5f]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Destaques
          </h2>
          <Link href="/produtos" className="text-sm text-[#1e3a5f] tracking-widest uppercase hover:underline">
            Ver tudo →
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="font-playfair text-2xl mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Em breve</p>
            <p className="text-sm">Nossa coleção está sendo preparada com muito carinho.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner institucional */}
      <section className="bg-[#1e3a5f] text-white py-16 text-center">
        <p className="text-[#c9a96e] tracking-widest uppercase text-sm mb-3">Prata 925 Certificada</p>
        <h2 className="font-playfair text-4xl mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Feito com alma</h2>
        <p className="text-blue-200 max-w-xl mx-auto leading-relaxed">
          Cada peça é produzida artesanalmente, com prata 925 de alta qualidade e inspiração no universo praiano.
        </p>
      </section>
    </>
  )
}
