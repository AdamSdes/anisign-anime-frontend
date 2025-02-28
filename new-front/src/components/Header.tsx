'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthState } from '@/lib/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { GoogleIcon, DiscordIcon } from '@/shared/icons';
import { motion } from 'framer-motion';

export function Header() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuthState();

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/anime', label: t('anime') },
    { href: '/calendar', label: t('calendar') },
    { href: '/characters', label: t('characters') },
    { href: isAuthenticated ? `/profile/${user?.username}` : '/auth/login', label: isAuthenticated ? t('profile') : t('login') },
  ];

  return (
    <header className="fixed top-0 w-full bg-[#060606]/95 backdrop-blur-xl border-b border-white/5 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white/90">
          Anisign
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                text-sm font-medium text-white/60 hover:text-white transition-colors
                ${pathname === item.href ? 'text-white underline' : ''}
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <SearchBar />
          {!isAuthenticated ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="h-10 px-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl text-white/60 hover:text-white"
                onClick={() => console.log('Login with Google')}
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                {t('loginWithGoogle')}
              </Button>
              <Button
                variant="ghost"
                className="h-10 px-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl text-white/60 hover:text-white"
                onClick={() => console.log('Login with Discord')}
              >
                <DiscordIcon className="mr-2 h-4 w-4" />
                {t('loginWithDiscord')}
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={logout}
                className="h-10 px-4 bg-[#FDA4AF] hover:bg-[#FDA4AF]/90 text-white rounded-xl"
              >
                {t('logout')}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}