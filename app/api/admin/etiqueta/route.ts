import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getAccessToken, meHeaders } from '@/lib/melhor-envio'

const ME_URL = process.env.MELHOR_ENVIO_URL!

async function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )
}

// POST /api/admin/etiqueta
// body: { action, orderId, ...params }
export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { action, orderId } = body

  const supabase = await getSupabase()
  const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()
  if (!order) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })

  const token = await getAccessToken()
  const headers = meHeaders(token)
  const shipping = order.shipping_option

  // ── 1. INSERIR NO CARRINHO ME ──────────────────────────────────────────────
  if (action === 'inserir') {
    const { invoice_key } = body

    const payload = {
      service: body.service_id,
      agency: body.agency_id || undefined,
      from: {
        name: process.env.MELHOR_ENVIO_FROM_NAME,
        phone: process.env.MELHOR_ENVIO_FROM_PHONE,
        email: process.env.MELHOR_ENVIO_FROM_EMAIL,
        document: '',
        company_document: process.env.MELHOR_ENVIO_FROM_CNPJ,
        state_register: process.env.MELHOR_ENVIO_FROM_STATE_REGISTER || 'ISENTO',
        postal_code: process.env.MELHOR_ENVIO_FROM_POSTAL_CODE,
        address: process.env.MELHOR_ENVIO_FROM_ADDRESS,
        number: process.env.MELHOR_ENVIO_FROM_NUMBER,
        district: process.env.MELHOR_ENVIO_FROM_DISTRICT || '',
        city: process.env.MELHOR_ENVIO_FROM_CITY,
        state_abbr: process.env.MELHOR_ENVIO_FROM_STATE,
        country_id: 'BR',
      },
      to: {
        name: order.customer_name,
        phone: order.customer_phone,
        email: order.customer_email,
        document: order.customer_cpf || '',
        postal_code: order.shipping_address_data?.cep || order.shipping_address.match(/CEP:\s*([\d-]+)/)?.[1]?.replace(/\D/g, '') || '',
        address: order.shipping_address_data?.rua || order.shipping_address.split(',')[0] || '',
        number: order.shipping_address_data?.numero || order.shipping_address.match(/,\s*(\d+)/)?.[1] || 'S/N',
        complement: order.shipping_address_data?.complemento || '',
        district: order.shipping_address_data?.bairro || '',
        city: order.shipping_address_data?.cidade || order.shipping_address.match(/,\s*([^/]+)\//)?.[1]?.trim() || '',
        state_abbr: order.shipping_address_data?.estado || order.shipping_address.match(/\/([A-Z]{2})/)?.[1] || '',
        country_id: 'BR',
      },
      products: Array.isArray(order.items) ? order.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        unitary_value: item.price,
      })) : [],
      volumes: (() => {
        const items = Array.isArray(order.items) ? order.items : []
        const totalWeight = items.reduce((sum: number, item: any) =>
          sum + (item.weight || 0.05) * item.quantity, 0
        )
        const maxWidth = Math.max(...items.map((i: any) => i.width || 5))
        const maxHeight = Math.max(...items.map((i: any) => i.height || 2))
        const maxLength = Math.max(...items.map((i: any) => i.length || 5))
        return [{ weight: totalWeight, width: maxWidth, height: maxHeight, length: maxLength }]
      })(),
      options: {
        insurance_value: Number(order.total),
        receipt: false,
        own_hand: false,
        reverse: false,
        non_commercial: !invoice_key,
        invoice: invoice_key ? { key: invoice_key } : undefined,
      },
    }

    const res = await fetch(`${ME_URL}/api/v2/me/cart`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.message || 'Erro ao inserir no carrinho ME' }, { status: 500 })

    await supabase.from('orders').update({ me_cart_id: data.id, me_label_status: 'pending' }).eq('id', orderId)
    return NextResponse.json({ ok: true, cart_id: data.id })
  }

  // ── 2. COMPRAR ETIQUETA ────────────────────────────────────────────────────
  if (action === 'comprar') {
    const cartId = order.me_cart_id
    if (!cartId) return NextResponse.json({ error: 'Etiqueta não inserida no carrinho ainda' }, { status: 400 })

    const res = await fetch(`${ME_URL}/api/v2/me/shipment/checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ orders: [cartId] }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.message || 'Erro ao comprar etiqueta' }, { status: 500 })

    await supabase.from('orders').update({ me_label_status: 'released' }).eq('id', orderId)
    return NextResponse.json({ ok: true })
  }

  // ── 3. GERAR ETIQUETA ──────────────────────────────────────────────────────
  if (action === 'gerar') {
    const cartId = order.me_cart_id
    if (!cartId) return NextResponse.json({ error: 'Etiqueta não comprada ainda' }, { status: 400 })

    const res = await fetch(`${ME_URL}/api/v2/me/shipment/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ orders: [cartId] }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.message || 'Erro ao gerar etiqueta' }, { status: 500 })

    await supabase.from('orders').update({ me_label_status: 'generated' }).eq('id', orderId)
    return NextResponse.json({ ok: true })
  }

  // ── 4. IMPRIMIR ETIQUETA ───────────────────────────────────────────────────
  if (action === 'imprimir') {
    const cartId = order.me_cart_id
    if (!cartId) return NextResponse.json({ error: 'Etiqueta não gerada ainda' }, { status: 400 })

    const res = await fetch(`${ME_URL}/api/v2/me/shipment/print`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ mode: 'public', orders: [cartId] }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.message || 'Erro ao imprimir etiqueta' }, { status: 500 })

    await supabase.from('orders').update({ me_label_status: 'printed' }).eq('id', orderId)
    return NextResponse.json({ ok: true, url: data.url })
  }

  return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
}
