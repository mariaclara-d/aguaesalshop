import { Instagram, Mail, Phone } from 'lucide-react'

export default function ContatoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-[#c9a96e] tracking-widest uppercase text-sm mb-3">Fale Conosco</p>
      <h1 className="font-playfair text-4xl text-[#1e3a5f] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        Contato
      </h1>
      <p className="text-gray-500 mb-12">Tem alguma dúvida ou quer encomendar uma peça especial? Entre em contato!</p>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 text-[#1e3a5f] hover:text-[#2a4f7c] transition-colors">
            <div className="w-12 h-12 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center">
              <Instagram size={20} />
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Instagram</p>
              <p className="font-semibold">@aguaesal.joias</p>
            </div>
          </a>
          <a href="mailto:contato@aguaesal.com.br"
            className="flex items-center gap-4 text-[#1e3a5f] hover:text-[#2a4f7c] transition-colors">
            <div className="w-12 h-12 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">E-mail</p>
              <p className="font-semibold">contato@aguaesal.com.br</p>
            </div>
          </a>
          <a href="https://wa.me/5500000000000"
            className="flex items-center gap-4 text-[#1e3a5f] hover:text-[#2a4f7c] transition-colors">
            <div className="w-12 h-12 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">WhatsApp</p>
              <p className="font-semibold">(00) 00000-0000</p>
            </div>
          </a>
        </div>

        <form className="space-y-4">
          <input type="text" placeholder="Seu nome" className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
          <input type="email" placeholder="Seu e-mail" className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm" />
          <textarea placeholder="Sua mensagem" rows={5} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] rounded-sm resize-none" />
          <button type="submit" className="btn-primary w-full">Enviar Mensagem</button>
        </form>
      </div>
    </div>
  )
}
