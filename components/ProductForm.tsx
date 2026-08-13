'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { Product, Variant } from '@/types'

type Props = { product?: Product }

const TEXT_SIZE_CATEGORIES = ['Pulseiras', 'Colares', 'Tornozeleiras', 'Masculino']
const VARIANT_CATEGORIES = ['Brincos']
const RING_CATEGORY = 'Anéis'
const TEXT_SIZES = ['PP', 'P', 'M', 'G', 'GG']
const RING_SIZES = [9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]

export default function ProductForm({ product }: Props) {
  const router = useRouter()
  const isEdit = !!product

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category: product?.category || 'Anéis',
    stock: product?.stock?.toString() || '0',
    weight: product?.weight?.toString() || '',
    width: product?.width?.toString() || '',
    height: product?.height?.toString() || '',
    length: product?.length?.toString() || '',
  })

  // Anéis: tamanhos numéricos
  const [ringSizes, setRingSizes] = useState<number[]>(
    (product?.sizes || []).map(Number).filter(Boolean)
  )

  // Pulseiras/Colares/etc: tamanhos texto sem preço
  const [textSizes, setTextSizes] = useState<string[]>(product?.sizes || [])

  // Brincos: variantes com preço
  const existingVariants = product?.variants && product.variants.length > 0
    ? product.variants
    : [{ size: 'P', price: 0 }, { size: 'M', price: 0 }, { size: 'G', price: 0 }]

  // Garante que P, M, G sempre aparecem, preenchendo com valores existentes
  const [variants, setVariants] = useState<Variant[]>(
    ['P', 'M', 'G'].map(s => existingVariants.find((v: Variant) => v.size === s) || { size: s, price: 0 })
  )

  const [imageFiles, setImageFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const convertToJpeg = (file: File): Promise<File> =>
    new Promise((resolve) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d')!.drawImage(img, 0, 0)
        canvas.toBlob(blob => {
          resolve(new File([blob!], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
        }, 'image/jpeg', 0.85)
      }
      img.src = URL.createObjectURL(file)
    })

  const uploadImages = async (files: FileList): Promise<string[]> => {
    const supabase = getSupabase()
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const converted = await convertToJpeg(file)
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const { error } = await supabase.storage.from('products').upload(path, converted)
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

      const isRing = form.category === RING_CATEGORY
      const isVariant = VARIANT_CATEGORIES.includes(form.category)
      const isText = TEXT_SIZE_CATEGORIES.includes(form.category)

      // Preço base: para brincos usa o menor preço das variantes com preço > 0
      const validVariants = variants.filter(v => v.price > 0)
      const basePrice = isVariant
        ? (validVariants.length > 0 ? Math.min(...validVariants.map(v => v.price)) : 0)
        : parseFloat(form.price)

      const payload = {
        name: form.name,
        description: form.description,
        price: basePrice,
        category: form.category,
        stock: parseInt(form.stock),
        images,
        weight: form.weight ? parseFloat(form.weight) : null,
        width: form.width ? parseFloat(form.width) : null,
        height: form.height ? parseFloat(form.height) : null,
        length: form.length ? parseFloat(form.length) : null,
        sizes: isRing ? ringSizes.map(String) : isText ? textSizes : [],
        variants: isVariant ? validVariants : [],
      }

      if (isEdit) {
        const res = await fetch(`/api/admin/produtos/${product.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      } else {
        const res = await fetch('/api/admin/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
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
          <label className="block text-sm text-gray-600 mb-1">Categoria *</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm bg-white">
            {['Anéis', 'Colares', 'Pulseiras', 'Brincos', 'Tornozeleiras', 'Masculino'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Descrição</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm resize-none" />
        </div>

        {/* Preço — não aparece para brincos (preço vem das variantes) */}
        {!VARIANT_CATEGORIES.includes(form.category) && (
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
        )}

        {/* Variantes com preço — só brincos */}
        {VARIANT_CATEGORIES.includes(form.category) && (
          <div>
            <label className="block text-sm text-gray-600 mb-2">Tamanhos e preços *</label>
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={v.size} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-semibold text-[#1e3a5f]">{v.size}</span>
                  <input
                    type="number" step="0.01" min="0"
                    placeholder={`Preço tamanho ${v.size} (0 = indisponível)`}
                    value={v.price || ''}
                    onChange={e => setVariants(prev => prev.map((vv, ii) =>
                      ii === i ? { ...vv, price: parseFloat(e.target.value) || 0 } : vv
                    ))}
                    className="flex-1 border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Deixe 0 para tamanhos indisponíveis</p>
            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-1">Estoque *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
          </div>
        )}

        {/* Tamanhos numéricos — só anéis */}
        {form.category === RING_CATEGORY && (
          <div>
            <label className="block text-sm text-gray-600 mb-2">Tamanhos disponíveis</label>
            <div className="flex flex-wrap gap-2">
              {RING_SIZES.map(size => {
                const active = ringSizes.includes(size)
                return (
                  <button key={size} type="button"
                    onClick={() => setRingSizes(prev =>
                      active ? prev.filter(s => s !== size) : [...prev, size].sort((a,b) => a-b)
                    )}
                    className={`w-11 h-11 text-sm border rounded-sm transition-colors ${
                      active ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-gray-200 text-gray-600 hover:border-[#1e3a5f]'
                    }`}>
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Tamanhos P/M/G — pulseiras, colares, tornozeleiras, masculino */}
        {TEXT_SIZE_CATEGORIES.includes(form.category) && (
          <div>
            <label className="block text-sm text-gray-600 mb-2">Tamanhos disponíveis</label>
            <div className="flex gap-2">
              {TEXT_SIZES.map(size => {
                const active = textSizes.includes(size)
                return (
                  <button key={size} type="button"
                    onClick={() => setTextSizes(prev =>
                      active ? prev.filter(s => s !== size) : [...prev, size]
                    )}
                    className={`px-4 h-11 text-sm border rounded-sm transition-colors ${
                      active ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-gray-200 text-gray-600 hover:border-[#1e3a5f]'
                    }`}>
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Peso (kg)</label>
            <input name="weight" type="number" step="0.001" min="0" value={form.weight} onChange={handleChange}
              placeholder="ex: 0.050"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Comprimento (cm)</label>
            <input name="length" type="number" step="0.01" min="0" value={form.length} onChange={handleChange}
              placeholder="ex: 5"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Largura (cm)</label>
            <input name="width" type="number" step="0.01" min="0" value={form.width} onChange={handleChange}
              placeholder="ex: 5"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Altura (cm)</label>
            <input name="height" type="number" step="0.01" min="0" value={form.height} onChange={handleChange}
              placeholder="ex: 2"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
          </div>
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
