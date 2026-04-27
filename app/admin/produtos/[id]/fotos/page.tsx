'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import Image from 'next/image'

export default function EditarFotosPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [images, setImages] = useState<string[]>([])
  const [productName, setProductName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = getSupabase()
    supabase.from('products').select('name, images').eq('id', id).single().then(({ data }) => {
      if (data) {
        setProductName(data.name)
        setImages(data.images || [])
      }
      setLoading(false)
    })
  }, [id])

  const salvarImagens = async (novasImagens: string[]) => {
    setSaving(true)
    const res = await fetch(`/api/admin/produtos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: novasImagens }),
    })
    setSaving(false)
    if (!res.ok) setError('Erro ao salvar. Tente novamente.')
    return res.ok
  }

  const removerFoto = async (url: string) => {
    const novas = images.filter(i => i !== url)
    setImages(novas)
    await salvarImagens(novas)
  }

  const adicionarFotos = async (files: FileList) => {
    setSaving(true)
    setError('')
    const supabase = getSupabase()
    const novasUrls: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage.from('products').upload(path, file)
      if (!uploadError) {
        const { data } = supabase.storage.from('products').getPublicUrl(path)
        novasUrls.push(data.publicUrl)
      }
    }

    const novas = [...images, ...novasUrls]
    setImages(novas)
    await salvarImagens(novas)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Carregando...</div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="btn-outline text-sm py-2 px-4">← Voltar</button>
        <div>
          <h1 className="font-playfair text-2xl text-[#1e3a5f]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Fotos do produto
          </h1>
          <p className="text-gray-400 text-sm">{productName}</p>
        </div>
      </div>

      {error && <p className="bg-red-50 text-red-500 text-sm px-4 py-3 mb-6 rounded-sm">{error}</p>}
      {saving && <p className="bg-blue-50 text-blue-500 text-sm px-4 py-3 mb-6 rounded-sm">Salvando...</p>}

      {/* Fotos atuais */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {images.map((url, i) => (
            <div key={i} className="relative group">
              <Image
                src={url}
                alt={`Foto ${i + 1}`}
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded-sm border border-gray-200"
              />
              <button
                onClick={() => removerFoto(url)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-sm p-8 text-center text-gray-400 mb-8">
          Nenhuma foto cadastrada ainda.
        </div>
      )}

      {/* Adicionar novas fotos */}
      <div className="border-2 border-dashed border-gray-200 rounded-sm p-6 text-center">
        <p className="text-sm text-gray-500 mb-3">Adicionar novas fotos</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => e.target.files && adicionarFotos(e.target.files)}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:bg-[#1e3a5f] file:text-white hover:file:bg-[#2a4f7c]"
        />
      </div>
    </div>
  )
}
