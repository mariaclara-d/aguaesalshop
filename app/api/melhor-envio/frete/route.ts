import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, meHeaders } from '@/lib/melhor-envio'

export async function POST(req: NextRequest) {
  const { postal_code, products } = await req.json()

  if (!postal_code || !products?.length) {
    return NextResponse.json({ error: 'CEP e produtos são obrigatórios.' }, { status: 400 })
  }

  const token = await getAccessToken()

  const res = await fetch(`${process.env.MELHOR_ENVIO_URL}/api/v2/me/shipment/calculate`, {
    method: 'POST',
    headers: meHeaders(token),
    body: JSON.stringify({
      from: { postal_code: process.env.MELHOR_ENVIO_FROM_POSTAL_CODE },
      to: { postal_code },
      products,
      options: { receipt: false, own_hand: false },
    }),
  })

  const data = await res.json()
  return NextResponse.json(data)
}
