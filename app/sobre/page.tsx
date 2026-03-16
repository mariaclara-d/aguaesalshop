import Image from 'next/image'

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[#c9a96e] tracking-widest uppercase text-sm mb-3">Nossa História</p>
          <h1 className="font-playfair text-4xl text-[#1e3a5f] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Nascida à beira-mar
          </h1>
          <p className="text-gray-600 leading-relaxed mb-4">
            A Água e Sal nasceu do amor pelo mar e pela arte de transformar prata em histórias. Cada peça é criada artesanalmente, com prata 925 certificada e muita dedicação.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Acreditamos que uma joia vai além do adorno — ela carrega memórias, sentimentos e a essência de quem a usa. Por isso, cada detalhe é pensado com cuidado e intenção.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Nossas peças são inspiradas na leveza das ondas, na liberdade do oceano e na beleza simples da vida praiana.
          </p>
        </div>
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Água e Sal" width={320} height={320} className="opacity-90" />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { titulo: 'Prata 925', desc: 'Toda nossa prata é certificada e de alta qualidade.' },
          { titulo: 'Artesanal', desc: 'Cada peça é feita à mão com amor e dedicação.' },
          { titulo: 'Exclusivo', desc: 'Designs únicos inspirados no universo praiano.' },
        ].map(item => (
          <div key={item.titulo} className="bg-[#1e3a5f] text-white p-8 rounded-sm">
            <h3 className="font-playfair text-xl mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{item.titulo}</h3>
            <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
