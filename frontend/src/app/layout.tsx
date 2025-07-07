import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { AnimeFiltersProvider } from '@/context/AnimeFiltersContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Anisign - Аниме портал',
  description: 'Аниме портал с удобным интерфейсом и большой базой данных',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru' className='dark' suppressHydrationWarning>
      <body className={`${montserrat.variable} bg-[#060606]`}>
        <AuthProvider>
          <AnimeFiltersProvider>
            <TooltipProvider delayDuration={300}>
              <ReactQueryProvider>
                {children}
                <Toaster
                  position='bottom-right'
                  toastOptions={{
                    style: {
                      background: '#0A0A0A',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      padding: '20px 25px',
                      borderRadius: '16px',
                    },
                  }}
                />
              </ReactQueryProvider>
            </TooltipProvider>
          </AnimeFiltersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
