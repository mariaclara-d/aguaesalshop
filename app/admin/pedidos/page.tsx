'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Aguardando pagamento', color: 'bg-yellow-100 text-yellow-700' },
  paid:      { label: 'Pago',                 color: 'bg-green-100 text-green-700' },
  shipped:   { label: 'Enviado',              color: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Entregue',             color: 'bg-gray-100 text-gray-600' },
}

const ME_LABEL_STATUS: Record<string, string> = {
  pending:   'No carrinho ME',
  released:  'Etiqueta comprada',
  generated: 'Etiqueta gerada',
  printed:   'Etiqueta impressa',
}

// IDs dos serviços do ME (da cotação de frete)
const ME_SERVICES: Record<string, number> = {
  'Correios — PAC':      1,
  'Correios — SEDEX':    2,
  'Jadlog — .Package':   3,
  'Jadlog — .Com':       4,
}

type Order = {
  id: string
  status: string
  payment_method: string
  created_at: string
  total: number
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  shipping_option: { company: string; name: string; price: string; delivery_time: number } | null
  items: { name: string; price: number; quantity: number }[]
  me_cart_id: string | null
  me_label_status: string | null
}

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [invoiceKeys, setInvoiceKeys] = useState<Record<string, string>>({})
  const [error, setError] = useState<Record<string, string>>({})

  const fetchOrders = async () => {
    const res = await fetch('/api/admin/pedidos')
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const setErr = (id: string, msg: string) => setError(prev => ({ ...prev, [id]: msg }))
  const clearErr = (id: string) => setError(prev => ({ ...prev, [id]: '' }))

  const updateStatus = async (orderId: string, status: string) => {
    setActionLoading(orderId + '_status')
    clearErr(orderId)
    const res = await fetch(`/api/admin/pedidos/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) { const d = await res.json(); setErr(orderId, d.error) }
    await fetchOrders()
    setActionLoading(null)
  }

  const etiquetaAction = async (orderId: string, action: string, extra?: object) => {
    setActionLoading(orderId + '_' + action)
    clearErr(orderId)
    const order = orders.find(o => o.id === orderId)
    const shipping = order?.shipping_option
    const serviceKey = shipping ? `${shipping.company} — ${shipping.name}` : ''
    const service_id = ME_SERVICES[serviceKey] || 1

    const res = await fetch('/api/admin/etiqueta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, orderId, service_id, ...extra }),
    })
    const data = await res.json()
    if (!res.ok) { setErr(orderId, data.error); setActionLoading(null); return }

    if (action === 'imprimir' && data.url) {
      window.open(data.url, '_blank')
    }
    await fetchOrders()
    setActionLoading(null)
  }

  const isLoading = (key: string) => actionLoading === key

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Carregando pedidos...</div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-[#1e3a5f]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Pedidos
          </h1>
          <p className="text-gray-400 text-sm mt-1">{orders.length} pedido(s)</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/produtos" className="btn-outline text-sm py-2 px-4">Produtos</Link>
          <form action="/api/admin-logout" method="POST">
            <button type="submit" className="btn-outline text-sm py-2 px-4">Sair</button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length === 0 && (
          <div className="bg-white rounded-sm shadow-sm px-6 py-12 text-center text-gray-400">
            Nenhum pedido ainda.
          </div>
        )}

        {orders.map(order => {
          const st = STATUS_LABEL[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' }
          const shipping = order.shipping_option

          return (
            <div key={order.id} className="bg-white rounded-sm shadow-sm p-6 space-y-4">

              {/* Cabeçalho */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${st.color}`}>{st.label}</span>
                    {order.me_label_status && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                        {ME_LABEL_STATUS[order.me_label_status] ?? order.me_label_status}
                      </span>
                    )}
                    {order.payment_method && (
                      <span className="text-xs text-gray-400">
                        {order.payment_method === 'pix' ? 'PIX' : 'Cartão'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-gray-300 font-mono">{order.id}</p>
                </div>
                <p className="text-lg font-semibold text-[#1e3a5f]">
                  {Number(order.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>

              {/* Dados */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Cliente</p>
                  <p className="text-gray-700">{order.customer_name}</p>
                  <p className="text-gray-500">{order.customer_email}</p>
                  <p className="text-gray-500">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Endereço</p>
                  <p className="text-gray-600 text-xs leading-relaxed">{order.shipping_address}</p>
                </div>
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
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Itens</p>
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} × {item.quantity}</span>
                      <span className="text-gray-500">
                        {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Erro */}
              {error[order.id] && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-sm">{error[order.id]}</p>
              )}

              {/* Ações */}
              <div className="border-t border-gray-100 pt-4 space-y-3">

                {/* Mudar status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Status:</span>
                  {(['pending', 'paid', 'shipped', 'delivered'] as const).map(s => (
                    <button key={s} onClick={() => updateStatus(order.id, s)}
                      disabled={order.status === s || isLoading(order.id + '_status')}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors disabled:opacity-40 ${
                        order.status === s
                          ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                          : 'border-gray-200 text-gray-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f]'
                      }`}>
                      {STATUS_LABEL[s].label}
                    </button>
                  ))}
                </div>

                {/* Etiqueta ME — só para pedidos pagos */}
                {order.status === 'paid' || order.status === 'shipped' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Etiqueta Melhor Envio</p>

                    {/* Inserir no carrinho */}
                    {!order.me_cart_id && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="text"
                          placeholder="Chave NF (opcional, 44 dígitos)"
                          value={invoiceKeys[order.id] || ''}
                          onChange={e => setInvoiceKeys(prev => ({ ...prev, [order.id]: e.target.value }))}
                          className="border border-gray-200 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#1e3a5f] w-72"
                        />
                        <button
                          onClick={() => etiquetaAction(order.id, 'inserir', {
                            invoice_key: invoiceKeys[order.id] || undefined,
                          })}
                          disabled={isLoading(order.id + '_inserir')}
                          className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
                          {isLoading(order.id + '_inserir') ? 'Inserindo...' : 'Inserir no carrinho ME'}
                        </button>
                      </div>
                    )}

                    {/* Comprar etiqueta */}
                    {order.me_cart_id && order.me_label_status === 'pending' && (
                      <button
                        onClick={() => etiquetaAction(order.id, 'comprar')}
                        disabled={isLoading(order.id + '_comprar')}
                        className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
                        {isLoading(order.id + '_comprar') ? 'Comprando...' : 'Comprar etiqueta (debita saldo ME)'}
                      </button>
                    )}

                    {/* Gerar etiqueta */}
                    {order.me_label_status === 'released' && (
                      <button
                        onClick={() => etiquetaAction(order.id, 'gerar')}
                        disabled={isLoading(order.id + '_gerar')}
                        className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
                        {isLoading(order.id + '_gerar') ? 'Gerando...' : 'Gerar etiqueta'}
                      </button>
                    )}

                    {/* Imprimir etiqueta */}
                    {(order.me_label_status === 'generated' || order.me_label_status === 'printed') && (
                      <button
                        onClick={() => etiquetaAction(order.id, 'imprimir')}
                        disabled={isLoading(order.id + '_imprimir')}
                        className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
                        {isLoading(order.id + '_imprimir') ? 'Abrindo...' : '🖨️ Imprimir etiqueta (PDF)'}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
