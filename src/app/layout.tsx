import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Brainstormers - AI-Powered Creative Thinking',
  description: 'Transform your ideas into breakthrough solutions with AI-powered brainstorming methodologies. Explore Big Mind Mapping, Reverse Brainstorming, Role Storming, SCAMPER, Six Thinking Hats, and Starbursting.',
  keywords: 'brainstorming, AI, creativity, innovation, ideation, problem solving, mind mapping',
  authors: [{ name: 'Brainstormers Team' }],
  openGraph: {
    title: 'Brainstormers - AI-Powered Creative Thinking',
    description: 'Transform your ideas into breakthrough solutions with AI-powered brainstorming methodologies.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brainstormers - AI-Powered Creative Thinking',
    description: 'Transform your ideas into breakthrough solutions with AI-powered brainstorming methodologies.',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}