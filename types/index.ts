export type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  created_at: string
}

export type CartItem = {
  product: Product
  quantity: number
}

export type Order = {
  id: string
  user_id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  created_at: string
}
