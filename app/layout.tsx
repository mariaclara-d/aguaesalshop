import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--font-lato' })

export const metadata: Metadata = {
  title: 'Água e Sal | Joias em Prata 925',
  description: 'Joias artesanais em prata 925 com alma praiana. Peças únicas feitas com amor.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <Script id="meta-pixel" strategy="beforeInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1671779504034972');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=1671779504034972&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={`${playfair.variable} ${lato.variable} bg-[#f8f5f0] text-[#1e3a5f]`}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
