'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { CartItem, Product } from '@/types'

type CartContextType = {
  items: CartItem[]
  add: (product: Product) => void
  remove: (id: string) => void
  update: (id: string, quantity: number) => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
  }

  const remove = (id: string) => setItems(prev => prev.filter(i => i.product.id !== id))

  const update = (id: string, quantity: number) => {
    if (quantity <= 0) return remove(id)
    setItems(prev => prev.map(i => i.product.id === id ? { ...i, quantity } : i))
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, update, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
