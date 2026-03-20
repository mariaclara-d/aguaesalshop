import { NextResponse } from 'next/server'

export async function GET() {
  const url = new URL(`${process.env.MELHOR_ENVIO_URL}/oauth/authorize`)
  url.searchParams.set('client_id', process.env.MELHOR_ENVIO_CLIENT_ID!)
  url.searchParams.set('redirect_uri', process.env.MELHOR_ENVIO_REDIRECT_URI!)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'cart-read cart-write shipping-calculate shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-tracking orders-read')

  return NextResponse.redirect(url.toString())
}
