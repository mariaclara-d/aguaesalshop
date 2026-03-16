'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { Product } from '@/types'

type Props = { product?: Product }

export default function ProductForm({ product }: Props) {
  const router = useRouter()
  const isEdit = !!product

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category: product?.category || 'Anéis',
    stock: product?.stock?.toString() || '0',
  })
  const [imageFiles, setImageFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const uploadImages = async (files: FileList): Promise<string[]> => {
    const supabase = getSupabase()
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('products').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('products').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = getSupabase()
      let images = product?.images || []

      if (imageFiles && imageFiles.length > 0) {
        const uploaded = await uploadImages(imageFiles)
        images = [...images, ...uploaded]
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock),
        images,
      }

      if (isEdit) {
        await supabase.from('products').update(payload).eq('id', product.id)
      } else {
        await supabase.from('products').insert(payload)
      }

      router.push('/admin/produtos')
      router.refresh()
    } catch {
      setError('Erro ao salvar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl text-[#1e3a5f] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEdit ? 'Editar Produto' : 'Novo Produto'}
      </h1>

      {error && <p className="bg-red-50 text-red-500 text-sm px-4 py-3 mb-6 rounded-sm">{error}</p>}

      <div className="space-y-5">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nome da peça *</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Descrição</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Preço (R$) *</label>
            <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Estoque *</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Categoria *</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm bg-white">
            {['Anéis', 'Colares', 'Pulseiras', 'Brincos'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Fotos do produto</label>
          <input type="file" accept="image/*" multiple onChange={e => setImageFiles(e.target.files)}
            className="w-full border border-gray-200 px-4 py-3 text-sm rounded-sm" />
          {product?.images && product.images.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">{product.images.length} foto(s) já cadastrada(s). Novas fotos serão adicionadas.</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancelar</button>
      </div>
    </form>
  )
}
