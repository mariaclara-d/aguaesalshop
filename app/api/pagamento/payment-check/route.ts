import { NextRequest, NextResponse } from 'next/server'
import { checkPaymentStatus } from '@/lib/infinitepay'

export async function POST(request: NextRequest) {
  try {
    const { order_nsu, transaction_nsu, slug } = await request.json()

    if (!order_nsu || !transaction_nsu || !slug) {
      return NextResponse.json({ error: 'Parâmetros incompletos' }, { status: 400 })
    }

    const result = await checkPaymentStatus({ order_nsu, transaction_nsu, slug })
    return NextResponse.json(result)

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json({ error: 'Erro ao verificar pagamento' }, { status: 500 })
  }
}
