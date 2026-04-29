import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutLink } from '@/lib/infinitepay'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { items, endereco, freteSelecionado, total } = await request.json()

    if (!items?.length || !endereco?.email || !freteSelecionado) {
      return NextResponse.json({ error: 'Dados incompletos no checkout' }, { status: 400 })
    }

    const totalComFrete = total + parseFloat(freteSelecionado.custom_price)

    const supabase = await getSupabaseServer()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: endereco.nome,
        customer_email: endereco.email,
        customer_phone: endereco.telefone,
        shipping_address: `${endereco.rua}, ${endereco.numero} ${endereco.complemento} - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado} CEP: ${endereco.cep}`,
        items: items.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          weight: item.product.weight || 0.05,
          width: item.product.width || 5,
          height: item.product.height || 2,
          length: item.product.length || 5,
        })),
        shipping_option: {
          company: freteSelecionado.company.name,
          name: freteSelecionado.name,
          price: freteSelecionado.custom_price,
          delivery_time: freteSelecionado.custom_delivery_time,
        },
        total: totalComFrete,
        status: 'pending',
      }])
      .select()
      .single()

    if (orderError || !order) {
      console.error('Erro ao salvar pedido no Supabase:', JSON.stringify(orderError))
      return NextResponse.json({ error: 'Erro ao processar pedido', detail: orderError?.message }, { status: 500 })
    }
    console.log('Pedido salvo:', order.id)

    const checkoutItems = [
      ...items.map((item: any) => ({
        quantity: item.quantity,
        price: Math.round(item.product.price * 100),
        description: item.product.name,
      })),
      {
        quantity: 1,
        price: Math.round(parseFloat(freteSelecionado.custom_price) * 100),
        description: `Frete — ${freteSelecionado.company.name} ${freteSelecionado.name}`,
      },
    ]

    const phone = endereco.telefone.replace(/\D/g, '')
    const phoneFormatted = phone.startsWith('55') ? `+${phone}` : `+55${phone}`

    const checkout = await createCheckoutLink({
      order_nsu: order.id,
      items: checkoutItems,
      customer: {
        name: endereco.nome,
        email: endereco.email,
        phone_number: phoneFormatted,
      },
      address: {
        cep: endereco.cep.replace(/\D/g, ''),
        street: endereco.rua,
        neighborhood: endereco.bairro,
        number: endereco.numero,
        complement: endereco.complemento || undefined,
      },
    })

    await supabase
      .from('orders')
      .update({ infinitepay_slug: checkout.slug })
      .eq('id', order.id)

    return NextResponse.json({ redirectUrl: checkout.url, orderId: order.id })

  } catch (error: any) {
    console.error('Erro em /api/pagamento/processar:', error?.message || error)
    return NextResponse.json({ error: 'Erro ao processar pagamento', detail: error?.message }, { status: 500 })
  }
}
