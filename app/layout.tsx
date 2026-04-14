import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-heading'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'PokéVault | Coleção Premium de Pokémon',
  description: 'Explore a experiência premium definitiva de Pokémon. Descubra, colecione e compare seus Pokémon favoritos em detalhes incríveis.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/pokeball.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/pokeball.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased min-h-screen overflow-x-hidden`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
