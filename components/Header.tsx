'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function Header() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-[#1e3a5f] text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Água e Sal" width={60} height={60} className="rounded-full" />
          <div className="hidden sm:block">
            <p className="font-playfair text-lg leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Água e Sal</p>
            <p className="text-xs tracking-widest text-blue-200">Joias em Prata 925</p>
          </div>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm tracking-widest uppercase">
          <Link href="/" className="hover:text-blue-200 transition-colors">Início</Link>
          <Link href="/produtos" className="hover:text-blue-200 transition-colors">Joias</Link>
          <Link href="/sobre" className="hover:text-blue-200 transition-colors">Sobre</Link>
          <Link href="/contato" className="hover:text-blue-200 transition-colors">Contato</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/carrinho" className="relative">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c9a96e] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#162d4a] px-4 pb-4 flex flex-col gap-4 text-sm tracking-widest uppercase">
          <Link href="/" onClick={() => setMenuOpen(false)}>Início</Link>
          <Link href="/produtos" onClick={() => setMenuOpen(false)}>Joias</Link>
          <Link href="/sobre" onClick={() => setMenuOpen(false)}>Sobre</Link>
          <Link href="/contato" onClick={() => setMenuOpen(false)}>Contato</Link>
        </div>
      )}
    </header>
  )
}
