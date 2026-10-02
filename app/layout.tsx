import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'WEAR AURA — New Streetwear',
  description: 'Not another clothing brand. Wear the fit. Own the aura.',
  openGraph: {
    title: 'WEAR AURA',
    description: 'Wear the fit. Own the aura.',
    url: 'https://wearaura.space',
    siteName: 'WEAR AURA',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
