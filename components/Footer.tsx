import Link from 'next/link'
import { Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-playfair text-xl mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Água e Sal</h3>
          <p className="text-blue-200 text-sm leading-relaxed">Joias artesanais em Prata 925 com alma praiana. Cada peça conta uma história.</p>
        </div>
        <div>
          <h4 className="text-sm tracking-widest uppercase mb-3">Links</h4>
          <ul className="space-y-2 text-sm text-blue-200">
            <li><Link href="/produtos" className="hover:text-white transition-colors">Todas as Joias</Link></li>
            <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
            <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm tracking-widest uppercase mb-3">Redes Sociais</h4>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
            <Instagram size={16} /> @aguaesal.joias
          </a>
          <p className="text-blue-200 text-sm mt-4">contato@aguaesal.com.br</p>
        </div>
      </div>
      <div className="border-t border-blue-800 text-center py-4 text-xs text-blue-300">
        © {new Date().getFullYear()} Água e Sal Joias. Todos os direitos reservados.
      </div>
    </footer>
  )
}
