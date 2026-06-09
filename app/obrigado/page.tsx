'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { useCart } from '@/context/CartContext'

type PaymentStatus = 'loading' | 'paid' | 'pending' | 'error'

function ObrigadoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()

  const order_nsu = searchParams.get('order_nsu')
  const transaction_nsu = searchParams.get('transaction_nsu')
  const slug = searchParams.get('slug')
  const capture_method = searchParams.get('capture_method')

  const [status, setStatus] = useState<PaymentStatus>('loading')
  const [amount, setAmount] = useState<number | null>(null)
  const [receiptUrl, setReceiptUrl] = useState<string | null>(searchParams.get('receipt_url'))
  const [isMotoboy, setIsMotoboy] = useState(false)

  useEffect(() => {
    if (!order_nsu || !transaction_nsu || !slug) {
      router.replace('/')
      return
    }

    fetch('/api/pagamento/payment-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_nsu, transaction_nsu, slug }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.paid) {
          setStatus('paid')
          setAmount(data.amount)
          setIsMotoboy(data.is_motoboy || false)
          clearCart()
        } else {
          setStatus('pending')
        }
      })
      .catch(() => setStatus('error'))
  }, [order_nsu, transaction_nsu, slug])

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 w-full">

        {status === 'loading' && (
          <p className="text-gray-500">Verificando pagamento...</p>
        )}

        {status === 'paid' && (
          <>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="font-playfair text-4xl text-[#1e3a5f] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                Obrigado!
              </h1>
              <p className="text-gray-600">Seu pagamento foi confirmado</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-sm space-y-3 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Número do pedido</span>
                <span className="font-semibold text-[#1e3a5f] text-xs">{order_nsu}</span>
              </div>
              {amount && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Valor pago</span>
                  <span className="font-semibold text-[#1e3a5f]">
                    {(amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              )}
              {capture_method && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Forma de pagamento</span>
                  <span className="font-semibold text-[#1e3a5f]">
                    {capture_method === 'pix' ? 'PIX' : 'Cartão de crédito'}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold text-green-600">Confirmado ✓</span>
              </div>
            </div>
            {isMotoboy ? (
              <div className="bg-green-50 border border-green-200 rounded-sm p-4 text-sm text-green-800 text-left">
                <p className="font-semibold mb-2">🛵 Entrega por Motoboy</p>
                <p className="mb-3">Seu pedido foi confirmado! Clique abaixo para combinar a entrega pelo WhatsApp.</p>
                <a
                  href={`https://wa.me/5574991303205?text=Ol%C3%A1!%20Acabei%20de%20realizar%20um%20pedido%20no%20site%20%C3%81gua%20e%20Sal%20Joias%20e%20escolhi%20entrega%20por%20motoboy.%20Pedido%3A%20${order_nsu}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-primary inline-block">
                  💬 Combinar entrega no WhatsApp
                </a>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 text-sm text-blue-800 text-left">
                <p className="font-semibold mb-1">Próximos passos:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Você receberá um e-mail de confirmação</li>
                  <li>Seu pedido será processado e enviado em breve</li>
                  <li>Você poderá rastrear sua entrega pelo e-mail</li>
                </ul>
              </div>
            )}
            {receiptUrl && (
              <a href={receiptUrl} target="_blank" rel="noopener noreferrer"
                className="btn-outline inline-block">
                Ver comprovante
              </a>
            )}
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="font-playfair text-3xl text-[#1e3a5f]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Pagamento pendente
            </h1>
            <p className="text-gray-600 text-sm">Assim que confirmado, você receberá um e-mail.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="font-playfair text-3xl text-[#1e3a5f]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Não foi possível verificar
            </h1>
            <p className="text-gray-600 text-sm">Se você pagou, não se preocupe — entraremos em contato.</p>
          </>
        )}

        {status !== 'loading' && (
          <div className="flex gap-3 justify-center pt-2">
            <button onClick={() => router.push('/')} className="btn-outline">Voltar ao início</button>
            <button onClick={() => router.push('/produtos')} className="btn-primary">Continuar comprando</button>
          </div>
        )}

      </div>
    </div>
  )
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400">Carregando...</div>}>
      <ObrigadoContent />
    </Suspense>
  )
}
