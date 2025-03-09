import React from "react";
import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import { useAtom } from "jotai";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth";
import { StoreProvider } from "@/providers/store";
import { QueryProvider } from "@/providers/queryClient";
import "@/styles/globals.css";

// Загрузка шрифта на уровне модуля
const montserrat = Montserrat({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Anisign - Аниме портал',
  description: 'Удобный сайт для просмотра аниме',
  icons: {
    icon: '/logo_header.png'
  },
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
               {/* @ts-ignore  */}
                <Toaster richColors position="top-center" />
                {children}
            </AuthProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  )
}