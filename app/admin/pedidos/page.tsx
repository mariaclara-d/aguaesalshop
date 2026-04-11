export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Aguardando pagamento', color: 'bg-yellow-100 text-yellow-700' },
  paid:      { label: 'Pago',                 color: 'bg-green-100 text-green-700' },
  shipped:   { label: 'Enviado',              color: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Entregue',             color: 'bg-gray-100 text-gray-600' },
}

export default async function AdminPedidosPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-[#1e3a5f]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Pedidos
          </h1>
          <p className="text-gray-400 text-sm mt-1">{orders?.length ?? 0} pedido(s) encontrado(s)</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/produtos" className="btn-outline text-sm py-2 px-4">Produtos</Link>
          <form action="/api/admin-logout" method="POST">
            <button type="submit" className="btn-outline text-sm py-2 px-4">Sair</button>
          </form>
        </div>
      </div>

      <div className="space-y-4">
        {(!orders || orders.length === 0) && (
          <div className="bg-white rounded-sm shadow-sm px-6 py-12 text-center text-gray-400">
            Nenhum pedido ainda.
          </div>
        )}

        {orders?.map(order => {
          const st = STATUS_LABEL[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' }
          const items = Array.isArray(order.items) ? order.items : []
          const shipping = order.shipping_option

          return (
            <div key={order.id} className="bg-white rounded-sm shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                {/* Cabeçalho */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${st.color}`}>
                      {st.label}
                    </span>
                    {order.payment_method && (
                      <span className="text-xs text-gray-400">
                        {order.payment_method === 'pix' ? 'PIX' : 'Cartão'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-300 font-mono">{order.id}</p>
                </div>

                {/* Total */}
                <div className="text-right">
                  <p className="text-lg font-semibold text-[#1e3a5f]">
                    {Number(order.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">

                {/* Cliente */}
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Cliente</p>
                  <p className="text-gray-700">{order.customer_name}</p>
                  <p className="text-gray-500">{order.customer_email}</p>
                  <p className="text-gray-500">{order.customer_phone}</p>
                </div>

                {/* Endereço */}
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Endereço</p>
                  <p className="text-gray-600 text-xs leading-relaxed">{order.shipping_address}</p>
                </div>

                {/* Frete */}
                {shipping && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Frete</p>
                    <p className="text-gray-700">{shipping.company} — {shipping.name}</p>
                    <p className="text-gray-500">{shipping.delivery_time} dias úteis</p>
                    <p className="text-gray-500">
                      {Number(shipping.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                )}
              </div>

              {/* Itens */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Itens</p>
                <div className="space-y-1">
                  {items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} × {item.quantity}</span>
                      <span className="text-gray-500">
                        {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
