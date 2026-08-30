import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import BackgroundFX from '@/components/BackgroundFX'
import SmoothScroll from '@/components/SmoothScroll'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://promptforge.ai'),
  title: 'PromptForge | Better prompts before you waste the next AI response',
  description:
    'PromptForge turns rough ideas into structured prompts, catches missing context, and gives you cleaner instructions for ChatGPT, Claude, Gemini, Groq, and local LLMs.',
  openGraph: {
    title: 'PromptForge',
    description: 'Free early access for a prompt rewriting and scoring tool.',
    url: 'https://promptforge.ai',
    siteName: 'PromptForge',
    images: [
      {
        url: '/promptforge-hero.png',
        width: 1792,
        height: 1024,
        alt: 'PromptForge dashboard preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptForge',
    description: 'Better prompts before you waste the next AI response.',
    images: ['/promptforge-hero.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll />
        <BackgroundFX />
        {children}
      </body>
    </html>
  )
}
