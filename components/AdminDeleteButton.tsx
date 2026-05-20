'use client'
import { useRouter } from 'next/navigation'

export default function AdminDeleteButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    await fetch(`/api/admin/produtos/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="py-1 px-3 text-xs border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
      Excluir
    </button>
  )
}
