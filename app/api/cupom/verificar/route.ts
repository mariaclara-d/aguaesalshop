import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const { cpf, cupom } = await request.json()

  if (cupom?.toUpperCase() !== 'PRIMEIRACOMPRA') {
    return NextResponse.json({ valid: false, message: 'Cupom inválido' })
  }

  const cpfLimpo = cpf.replace(/\D/g, '')
  if (cpfLimpo.length !== 11) {
    return NextResponse.json({ valid: false, message: 'CPF inválido' })
  }

  const supabase = await getSupabaseServer()
  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('customer_cpf', cpfLimpo)
    .in('status', ['paid', 'shipped', 'delivered'])

  if ((count ?? 0) > 0) {
    return NextResponse.json({ valid: false, message: 'Cupom válido apenas para a primeira compra' })
  }

  return NextResponse.json({ valid: true, discount: 0.20, message: '20% de desconto aplicado!' })
}
