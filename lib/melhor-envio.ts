import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ME_URL = process.env.MELHOR_ENVIO_URL!
const USER_AGENT = process.env.MELHOR_ENVIO_USER_AGENT!

export async function getAccessToken(): Promise<string> {
  const { data } = await supabase.from('me_tokens').select('*').eq('id', 1).single()

  if (!data) throw new Error('Token não encontrado. Faça a autorização primeiro.')

  const expiresAt = new Date(data.expires_at)
  const now = new Date()
  const diffDays = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

  if (diffDays > 1) return data.access_token

  // Renova o token com refresh_token
  const res = await fetch(`${ME_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: process.env.MELHOR_ENVIO_CLIENT_ID,
      client_secret: process.env.MELHOR_ENVIO_CLIENT_SECRET,
      refresh_token: data.refresh_token,
    }),
  })

  const json = await res.json()
  if (!json.access_token) throw new Error('Falha ao renovar token.')

  await saveTokens(json.access_token, json.refresh_token, json.expires_in)
  return json.access_token
}

export async function saveTokens(access_token: string, refresh_token: string, expires_in: number) {
  const expires_at = new Date(Date.now() + expires_in * 1000).toISOString()
  await supabase.from('me_tokens').upsert({ id: 1, access_token, refresh_token, expires_at })
}

export function meHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': USER_AGENT,
  }
}
