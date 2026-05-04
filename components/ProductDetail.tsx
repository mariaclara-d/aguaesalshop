'use client'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'
import { ShoppingBag } from 'lucide-react'
import { useState } from 'react'

const ALL_SIZES = [9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
const IS_RING = (category: string) => category === 'Anéis'

export default function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [sizeError, setSizeError] = useState(false)

  const isRing = IS_RING(product.category)
  const availableSizes = product.sizes || []

  const handleAdd = () => {
    if (isRing && !selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    add(product, selectedSize ?? undefined)
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
              <button key={i} onClick={() => setActiveImg(i)}
                className={`relative w-16 h-16 border-2 rounded-sm overflow-hidden ${activeImg === i ? 'border-[#1e3a5f]' : 'border-transparent'}`}>
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
        <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
        <p className="text-sm text-gray-400 mb-6">
          Prata 925 · {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
        </p>

        {/* Seletor de tamanho — só para anéis */}
        {isRing && availableSizes.length > 0 && (
          <div className="mb-6">
            <p className={`text-sm font-semibold uppercase tracking-wide mb-3 ${sizeError ? 'text-red-500' : 'text-gray-700'}`}>
              {sizeError ? 'Selecione um tamanho *' : 'Tamanho'}
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map(size => {
                const available = availableSizes.includes(size)
                const selected = selectedSize === size
                return (
                  <button
                    key={size}
                    onClick={() => available && (setSelectedSize(size), setSizeError(false))}
                    disabled={!available}
                    className={`relative w-11 h-11 text-sm border rounded-sm transition-colors
                      ${selected ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : ''}
                      ${available && !selected ? 'border-gray-300 text-gray-700 hover:border-[#1e3a5f]' : ''}
                      ${!available ? 'border-gray-200 text-gray-300 cursor-not-allowed' : ''}
                    `}
                  >
                    {size}
                    {!available && (
                      <span className="absolute top-0.5 right-0.5 text-red-400 text-xs leading-none">×</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

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
