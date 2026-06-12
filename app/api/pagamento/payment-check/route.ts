import { NextRequest, NextResponse } from 'next/server'
import { checkPaymentStatus } from '@/lib/infinitepay'
import { getSupabaseServer } from '@/lib/supabase-server'
import { enviarEmailNovoPedido, enviarEmailConfirmacaoCliente } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { order_nsu, transaction_nsu, slug, capture_method } = await request.json()

    if (!order_nsu || !transaction_nsu || !slug) {
      return NextResponse.json({ error: 'Parâmetros incompletos' }, { status: 400 })
    }

    const result = await checkPaymentStatus({ order_nsu, transaction_nsu, slug })

    if (result.paid) {
      const supabase = await getSupabaseServer()
      const { data: order } = await supabase.from('orders').select('*').eq('id', order_nsu).single()

      if (order && order.status !== 'paid') {
        await supabase.from('orders').update({
          status: 'paid',
          payment_status: 'approved',
          payment_method: capture_method || result.capture_method,
          updated_at: new Date().toISOString(),
        }).eq('id', order_nsu)

        try {
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
              payment_method: capture_method || result.capture_method,
            }),
            enviarEmailConfirmacaoCliente({
              id: order.id,
              customer_name: order.customer_name,
              customer_email: order.customer_email,
              shipping_address: order.shipping_address,
              items: order.items,
              shipping_option: order.shipping_option,
              total: order.total,
              payment_method: capture_method || result.capture_method,
            }),
          ])
        } catch (emailError) {
          console.error('Erro ao enviar e-mail:', emailError)
        }
      }

      const is_motoboy = order?.shipping_option?.company === '\uD83D\uDEF5 Motoboy'
      return NextResponse.json({ ...result, is_motoboy })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json({ error: 'Erro ao verificar pagamento' }, { status: 500 })
  }
}
