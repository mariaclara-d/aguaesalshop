import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'
import { enviarEmailNovoPedido } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_nsu, transaction_nsu, invoice_slug, capture_method, paid_amount } = body

    if (!order_nsu) {
      return NextResponse.json({ error: 'order_nsu ausente' }, { status: 400 })
    }

    const supabase = await getSupabaseServer()
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_status: 'approved',
        payment_method: capture_method,
        infinitepay_transaction_nsu: transaction_nsu,
        infinitepay_slug: invoice_slug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_nsu)

    if (error) {
      console.error('Erro ao atualizar pedido no webhook:', error)
      return NextResponse.json({ error: 'Erro interno' }, { status: 400 })
    }

    console.log(`✅ Pedido ${order_nsu} pago via ${capture_method} — R$ ${(paid_amount / 100).toFixed(2)}`)

    // Buscar pedido completo para enviar e-mail
    const { data: order } = await supabase.from('orders').select('*').eq('id', order_nsu).single()
    if (order) {
      try {
        await enviarEmailNovoPedido({
          id: order.id,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          shipping_address: order.shipping_address,
          items: order.items,
          shipping_option: order.shipping_option,
          total: order.total,
          payment_method: capture_method,
        })
      } catch (emailError) {
        console.error('Erro ao enviar e-mail:', emailError)
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 })

  } catch (error) {
    console.error('Erro no webhook InfinitePay:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 400 })
  }
}
