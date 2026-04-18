import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase.from('products').insert([body]).select().single()
  if (error) {
    console.error('Erro ao inserir produto:', JSON.stringify(error))
    return NextResponse.json({ error: error.message, details: error }, { status: 500 })
  }
  return NextResponse.json(data)
}
