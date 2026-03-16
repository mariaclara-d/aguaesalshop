'use client'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function AdminDeleteButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    const supabase = getSupabase()
    await supabase.from('products').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="py-1 px-3 text-xs border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
      Excluir
    </button>
  )
}
