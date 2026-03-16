'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Trash2 } from 'lucide-react'

export default function CarrinhoPage() {
  const { items, remove, update, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-playfair text-4xl text-[#1e3a5f] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Seu carrinho está vazio
        </h1>
        <p className="text-gray-500 mb-8">Explore nossas joias e encontre a peça perfeita para você.</p>
        <Link href="/produtos" className="btn-primary">Ver Joias</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl text-[#1e3a5f] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Carrinho
      </h1>

      <div className="space-y-4 mb-8">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="bg-white p-4 flex gap-4 items-center rounded-sm shadow-sm">
            <div className="relative w-20 h-20 bg-[#f0ece6] rounded-sm overflow-hidden flex-shrink-0">
              <Image src={product.images[0] || '/placeholder.svg'} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-playfair text-[#1e3a5f]" style={{ fontFamily: 'var(--font-playfair)' }}>{product.name}</h3>
              <p className="text-sm text-gray-400">{product.category}</p>
              <p className="text-[#1e3a5f] font-semibold mt-1">
                {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => update(product.id, quantity - 1)} className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100">−</button>
              <span className="w-8 text-center">{quantity}</span>
              <button onClick={() => update(product.id, quantity + 1)} className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
            </div>
            <button onClick={() => remove(product.id)} className="text-gray-400 hover:text-red-500 transition-colors ml-2">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-sm shadow-sm max-w-sm ml-auto">
        <div className="flex justify-between mb-4 text-lg">
          <span>Total</span>
          <span className="font-semibold text-[#1e3a5f]">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
        <button className="btn-primary w-full text-center">Finalizar Pedido</button>
        <Link href="/produtos" className="block text-center text-sm text-gray-400 mt-3 hover:underline">
          Continuar comprando
        </Link>
      </div>
    </div>
  )
}
