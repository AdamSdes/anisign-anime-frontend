import './globals.css';

import {Montserrat} from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Footer from "@/shared/ui/Footer/Footer"; // Импортируем AuthProvider

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

export const metadata = {
  title: 'Anisign',
  description: 'Аниме сайт',
};

export default function RootLayout({children}) {
  return (
      <html lang="ru" className={`dark ${montserrat.className}`}>
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="min-h-screen flex flex-col">
      <AuthProvider>
        <main className="flex-grow">
          {children}
        </main>
      </AuthProvider>
      <Footer />
      </body>
      </html>
  );
}
