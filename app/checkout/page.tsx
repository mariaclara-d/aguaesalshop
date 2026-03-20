'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

type FreteOption = {
  id: number
  name: string
  company: { name: string }
  custom_price: string
  custom_delivery_time: number
  error?: string
}

type Endereco = {
  nome: string
  email: string
  telefone: string
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()

  const [etapa, setEtapa] = useState<'endereco' | 'frete' | 'resumo'>('endereco')
  const [endereco, setEndereco] = useState<Endereco>({
    nome: '', email: '', telefone: '', cep: '', rua: '',
    numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  })
  const [fretes, setFretes] = useState<FreteOption[]>([])
  const [freteSelecionado, setFreteSelecionado] = useState<FreteOption | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    router.replace('/carrinho')
    return null
  }

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndereco(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const buscarCep = async () => {
    const cep = endereco.cep.replace(/\D/g, '')
    if (cep.length !== 8) return
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await res.json()
    if (!data.erro) {
      setEndereco(prev => ({
        ...prev,
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      }))
    }
  }

  const calcularFrete = async () => {
    setLoading(true)
    setError('')
    try {
      const products = items.map(({ product, quantity }) => ({
        id: product.id,
        width: product.width || 5,
        height: product.height || 2,
        length: product.length || 5,
        weight: product.weight || 0.05,
        insurance_value: product.price,
        quantity,
      }))

      const res = await fetch('/api/melhor-envio/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postal_code: endereco.cep.replace(/\D/g, ''), products }),
      })

      const data = await res.json()
      const disponiveis = data.filter((f: FreteOption) => !f.error)
      if (disponiveis.length === 0) {
        setError('Nenhuma transportadora disponível para este CEP.')
        return
      }
      setFretes(disponiveis)
      setEtapa('frete')
    } catch {
      setError('Erro ao calcular frete. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const confirmarFrete = () => {
    if (!freteSelecionado) return
    setEtapa('resumo')
  }

  const finalizarPedido = () => {
    // Aqui entrará o Mercado Pago
    alert('Integração com Mercado Pago em breve!')
  }

  const totalComFrete = total + (freteSelecionado ? parseFloat(freteSelecionado.custom_price) : 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl text-[#1e3a5f] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Finalizar Pedido
      </h1>

      {/* Indicador de etapas */}
      <div className="flex gap-2 mb-8 text-sm">
        {['endereco', 'frete', 'resumo'].map((e, i) => (
          <div key={e} className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${etapa === e ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </span>
            <span className={etapa === e ? 'text-[#1e3a5f] font-semibold' : 'text-gray-400'}>
              {e === 'endereco' ? 'Endereço' : e === 'frete' ? 'Frete' : 'Resumo'}
            </span>
            {i < 2 && <span className="text-gray-300">→</span>}
          </div>
        ))}
      </div>

      {error && <p className="bg-red-50 text-red-500 text-sm px-4 py-3 mb-6 rounded-sm">{error}</p>}

      {/* Etapa 1: Endereço */}
      {etapa === 'endereco' && (
        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Nome completo *</label>
              <input name="nome" value={endereco.nome} onChange={handleEnderecoChange} required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">E-mail *</label>
              <input name="email" type="email" value={endereco.email} onChange={handleEnderecoChange} required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Telefone *</label>
              <input name="telefone" value={endereco.telefone} onChange={handleEnderecoChange} required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CEP *</label>
              <input name="cep" value={endereco.cep} onChange={handleEnderecoChange} onBlur={buscarCep}
                placeholder="00000-000" maxLength={9} required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Número *</label>
              <input name="numero" value={endereco.numero} onChange={handleEnderecoChange} required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Rua *</label>
              <input name="rua" value={endereco.rua} onChange={handleEnderecoChange} required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Complemento</label>
              <input name="complemento" value={endereco.complemento} onChange={handleEnderecoChange}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Bairro *</label>
              <input name="bairro" value={endereco.bairro} onChange={handleEnderecoChange} required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cidade *</label>
              <input name="cidade" value={endereco.cidade} onChange={handleEnderecoChange} required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Estado *</label>
              <input name="estado" value={endereco.estado} onChange={handleEnderecoChange} required maxLength={2}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
            </div>
          </div>
          <button onClick={calcularFrete} disabled={loading || !endereco.cep || !endereco.nome || !endereco.email}
            className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Calculando frete...' : 'Calcular Frete'}
          </button>
        </div>
      )}

      {/* Etapa 2: Frete */}
      {etapa === 'frete' && (
        <div className="bg-white p-6 rounded-sm shadow-sm">
          <h2 className="font-playfair text-xl text-[#1e3a5f] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Escolha o frete
          </h2>
          <div className="space-y-3 mb-6">
            {fretes.map(frete => (
              <label key={frete.id}
                className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${freteSelecionado?.id === frete.id ? 'border-[#1e3a5f] bg-[#f8f5f0]' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="frete" checked={freteSelecionado?.id === frete.id}
                    onChange={() => setFreteSelecionado(frete)} className="accent-[#1e3a5f]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1e3a5f]">{frete.company.name} — {frete.name}</p>
                    <p className="text-xs text-gray-400">{frete.custom_delivery_time} dias úteis</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#1e3a5f]">
                  {parseFloat(frete.custom_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setEtapa('endereco')} className="btn-outline">Voltar</button>
            <button onClick={confirmarFrete} disabled={!freteSelecionado} className="btn-primary flex-1 disabled:opacity-50">
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Etapa 3: Resumo */}
      {etapa === 'resumo' && (
        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
          <h2 className="font-playfair text-xl text-[#1e3a5f]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Resumo do pedido
          </h2>
          <div className="space-y-2 text-sm">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between">
                <span>{product.name} × {quantity}</span>
                <span>{(product.price * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            ))}
            <div className="flex justify-between text-gray-500 pt-2 border-t border-gray-100">
              <span>Frete ({freteSelecionado?.company.name} — {freteSelecionado?.name})</span>
              <span>{parseFloat(freteSelecionado!.custom_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#1e3a5f] text-base pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{totalComFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500 pt-2 border-t border-gray-100">
            <p className="font-semibold text-gray-700 mb-1">Entrega para:</p>
            <p>{endereco.nome}</p>
            <p>{endereco.rua}, {endereco.numero} {endereco.complemento}</p>
            <p>{endereco.bairro} — {endereco.cidade}/{endereco.estado}</p>
            <p>CEP: {endereco.cep}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEtapa('frete')} className="btn-outline">Voltar</button>
            <button onClick={finalizarPedido} className="btn-primary flex-1">
              Ir para Pagamento
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
