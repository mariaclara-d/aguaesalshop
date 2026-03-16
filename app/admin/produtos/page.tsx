export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getSupabaseServer } from '@/lib/supabase-server'
import AdminDeleteButton from '@/components/AdminDeleteButton'

export default async function AdminProdutosPage() {
  const supabase = await getSupabaseServer()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-[#1e3a5f]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Painel Admin
          </h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie os produtos da loja</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/produtos/novo" className="btn-primary">+ Novo Produto</Link>
          <form action="/api/admin-logout" method="POST">
            <button type="submit" className="btn-outline text-sm py-2 px-4">Sair</button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#1e3a5f] text-white">
            <tr>
              <th className="text-left px-4 py-3">Nome</th>
              <th className="text-left px-4 py-3">Categoria</th>
              <th className="text-left px-4 py-3">Preço</th>
              <th className="text-left px-4 py-3">Estoque</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products?.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#1e3a5f]">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category}</td>
                <td className="px-4 py-3">{Number(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 flex gap-2 justify-end">
                  <Link href={`/admin/produtos/${p.id}`} className="btn-outline py-1 px-3 text-xs">Editar</Link>
                  <AdminDeleteButton id={p.id} />
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">Nenhum produto cadastrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
