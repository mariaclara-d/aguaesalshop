const INFINITEPAY_API = 'https://api.infinitepay.io'

export async function createCheckoutLink(payload: {
  order_nsu: string
  items: Array<{ quantity: number; price: number; description: string }>
  customer: { name: string; email: string; phone_number: string }
  address: { cep: string; street: string; neighborhood: string; number: string; complement?: string }
}) {
  const res = await fetch(`${INFINITEPAY_API}/invoices/public/checkout/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      handle: process.env.INFINITEPAY_HANDLE,
      order_nsu: payload.order_nsu,
      items: payload.items,
      customer: payload.customer,
      address: payload.address,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/obrigado`,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/pagamento/webhook`,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('InfinitePay erro:', JSON.stringify(data))
    throw new Error(data.message || JSON.stringify(data))
  }
  return data as { url: string; slug: string }
}

export async function checkPaymentStatus(params: {
  order_nsu: string
  transaction_nsu: string
  slug: string
}) {
  const res = await fetch(`${INFINITEPAY_API}/invoices/public/checkout/payment_check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: process.env.INFINITEPAY_HANDLE, ...params }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Erro ao consultar status')
  return data as { success: boolean; paid: boolean; amount: number; capture_method: string }
}
