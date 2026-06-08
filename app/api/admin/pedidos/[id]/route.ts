import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { enviarEmailPedidoEnviado } from '@/lib/email'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const { status } = await req.json()

  const valid = ['pending', 'paid', 'shipped', 'delivered']
  if (!valid.includes(status)) {
    return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (status === 'shipped') {
    const { data: order } = await supabase.from('orders').select('*').eq('id', id).single()
    if (order) {
      try {
        await enviarEmailPedidoEnviado({
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          shipping_address: order.shipping_address,
          shipping_option: order.shipping_option,
          tracking_code: order.tracking_code || undefined,
        })
      } catch (e) {
        console.error('Erro ao enviar email de envio:', e)
      }
    }
  }

  return NextResponse.json({ ok: true })
}
