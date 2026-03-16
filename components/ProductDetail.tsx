'use client'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'
import { ShoppingBag } from 'lucide-react'
import { useState } from 'react'

export default function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  const handleAdd = () => {
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
      <div>
        <div className="relative aspect-square bg-[#f0ece6] rounded-sm overflow-hidden mb-3">
          <Image
            src={product.images[activeImg] || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`relative w-16 h-16 border-2 rounded-sm overflow-hidden ${activeImg === i ? 'border-[#1e3a5f]' : 'border-transparent'}`}>
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-[#c9a96e] text-sm tracking-widest uppercase mb-2">{product.category}</p>
        <h1 className="font-playfair text-4xl text-[#1e3a5f] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {product.name}
        </h1>
        <p className="text-2xl font-semibold text-[#1e3a5f] mb-6">
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
        <p className="text-sm text-gray-400 mb-6">Prata 925 · {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}</p>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-50"
        >
          <ShoppingBag size={16} />
          {added ? 'Adicionado!' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  )
}
