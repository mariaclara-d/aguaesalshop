import { NextRequest, NextResponse } from 'next/server'
import { checkPaymentStatus } from '@/lib/infinitepay'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { order_nsu, transaction_nsu, slug } = await request.json()

    if (!order_nsu || !transaction_nsu || !slug) {
      return NextResponse.json({ error: 'Parâmetros incompletos' }, { status: 400 })
    }

    const result = await checkPaymentStatus({ order_nsu, transaction_nsu, slug })

    if (result.paid) {
      const supabase = await getSupabaseServer()
      const { data: order } = await supabase.from('orders').select('shipping_option').eq('id', order_nsu).single()
      const is_motoboy = order?.shipping_option?.company === '🛵 Motoboy'
      return NextResponse.json({ ...result, is_motoboy })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json({ error: 'Erro ao verificar pagamento' }, { status: 500 })
  }
}
