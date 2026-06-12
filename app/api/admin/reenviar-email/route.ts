import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { enviarEmailNovoPedido, enviarEmailConfirmacaoCliente } from '@/lib/email'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )

  const { data: order } = await supabase.from('orders').select('*').eq('id', id).single()
  if (!order) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })

  await Promise.all([
    enviarEmailNovoPedido({
      id: order.id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      shipping_address: order.shipping_address,
      items: order.items,
      shipping_option: order.shipping_option,
      total: order.total,
      payment_method: order.payment_method || 'pix',
    }),
    enviarEmailConfirmacaoCliente({
      id: order.id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      shipping_address: order.shipping_address,
      items: order.items,
      shipping_option: order.shipping_option,
      total: order.total,
      payment_method: order.payment_method || 'pix',
    }),
  ])

  return NextResponse.json({ ok: true })
}
