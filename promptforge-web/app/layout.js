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
  title: 'PromptForge – turn rough ideas into precise AI prompts',
  description:
    'Paste a rough idea, answer a few quick questions, get a precise prompt for ChatGPT, Claude, Gemini or local LLMs. Free to try, no signup.',
  openGraph: {
    title: 'PromptForge',
    description: 'Answer a few questions, get a precise AI prompt. Free to try, no signup.',
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
    description: 'Answer a few questions, get a precise AI prompt. Free to try, no signup.',
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
