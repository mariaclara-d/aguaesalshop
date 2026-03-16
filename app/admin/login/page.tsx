'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/produtos')
    } else {
      setError('Senha incorreta. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center px-4">
      <div className="bg-white rounded-sm shadow-lg p-10 w-full max-w-sm text-center">
        <Image src="/logo.png" alt="Água e Sal" width={100} height={100} className="mx-auto mb-6" />
        <h1 className="font-playfair text-2xl text-[#1e3a5f] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
          Área Administrativa
        </h1>
        <p className="text-gray-400 text-sm mb-8">Água e Sal Joias</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm text-center tracking-widest"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
