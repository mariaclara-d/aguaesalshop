'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()

  return (
    <div className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/produto/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#f0ece6]">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/produto/${product.id}`}>
          <h3 className="font-playfair text-[#1e3a5f] text-lg mb-1 hover:text-[#2a4f7c] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-[#1e3a5f] font-semibold">
            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          <button
            onClick={() => add(product)}
            className="btn-primary flex items-center gap-2 text-xs py-2 px-3"
          >
            <ShoppingBag size={14} /> Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
