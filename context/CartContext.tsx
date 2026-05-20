'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { CartItem, Product } from '@/types'

type CartContextType = {
  items: CartItem[]
  add: (product: Product, size?: string, price?: number) => void
  remove: (id: string, size?: string) => void
  update: (id: string, quantity: number, size?: string) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = (product: Product, size?: string, price?: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size)
      if (existing) return prev.map(i =>
        i.product.id === product.id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i
      )
      return [...prev, { product, quantity: 1, size, price }]
    })
  }

  const remove = (id: string, size?: string) => setItems(prev =>
    prev.filter(i => !(i.product.id === id && i.size === size))
  )

  const update = (id: string, quantity: number, size?: string) => {
    if (quantity <= 0) return remove(id, size)
    setItems(prev => prev.map(i =>
      i.product.id === id && i.size === size ? { ...i, quantity } : i
    ))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + (i.price ?? i.product.price) * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, update, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
