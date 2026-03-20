import { NextRequest, NextResponse } from 'next/server'
import { saveTokens } from '@/lib/melhor-envio'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Código de autorização não encontrado.' }, { status: 400 })
  }

  const res = await fetch(`${process.env.MELHOR_ENVIO_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': process.env.MELHOR_ENVIO_USER_AGENT!,
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.MELHOR_ENVIO_CLIENT_ID,
      client_secret: process.env.MELHOR_ENVIO_CLIENT_SECRET,
      redirect_uri: process.env.MELHOR_ENVIO_REDIRECT_URI,
      code,
    }),
  })

  const json = await res.json()

  if (!json.access_token) {
    return NextResponse.json({ error: 'Falha na autenticação.', detail: json }, { status: 401 })
  }

  await saveTokens(json.access_token, json.refresh_token, json.expires_in)

  return NextResponse.redirect(new URL('/admin/produtos', req.nextUrl.origin))
}
