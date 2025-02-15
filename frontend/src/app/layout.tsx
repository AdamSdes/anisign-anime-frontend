import { Montserrat } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/providers/AuthProvider'
import { StoreProvider } from '@/providers/StoreProvider'
import QueryProvider from "@/providers/query-provider"

const montserrat = Montserrat({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Anisign - Аниме портал',
  description: 'Удобный сайт для просмотра аниме',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <QueryProvider>
          <StoreProvider>
            <AuthProvider>
                <Toaster richColors position="top-center" />
                {children}
            </AuthProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
