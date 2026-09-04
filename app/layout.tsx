import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { robotoMono, satoshi, jetbrainsMono, dmSerifDisplay } from '@/lib/fonts';
import './globals.css'
import { LenisScroll } from '@/components/LenisScroll'

export const metadata: Metadata = {
  title: 'Ayush Kumar | Software Engineering Student',
  description: 'Software Engineering student passionate about programming, technology, philosophy, and continuous learning. Building meaningful projects while documenting the journey.',
  icons: {
    icon: [
      {
        url: '/Portfolio.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/Portfolio.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/Portfolio.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#121212',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${robotoMono.variable} ${satoshi.variable} ${jetbrainsMono.variable} ${dmSerifDisplay.variable} bg-black`}>
      <body className="antialiased bg-black text-gray-100" suppressHydrationWarning>
        <LenisScroll>
          {children}
        </LenisScroll>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}