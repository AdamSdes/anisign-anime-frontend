// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthState } from '@/lib/stores/authStore';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import { fetchNotifications } from '@/lib/api';

const BellIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 16 16"
    fill="none"
    className="text-white/60"
  >
    <path
      d="M8 2C6.34315 2 5 3.34315 5 5V7.5C5 8.88071 3.88071 10 2.5 10V11.5C2.5 12.3284 3.17157 13 4 13H12C12.8284 13 13.5 12.3284 13.5 11.5V10C12.1193 10 11 8.88071 11 7.5V5C11 3.34315 9.65685 2 8 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
    <circle cx="8" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 16 16"
    fill="none"
    className="text-white/60"
  >
    <rect y="3" width="16" height="2" fill="currentColor" />
    <rect y="7" width="16" height="2" fill="currentColor" />
    <rect y="11" width="16" height="2" fill="currentColor" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 16 16"
    fill="none"
    className="text-white/60"
  >
    <circle cx="8" cy="4" r="3" fill="currentColor" />
    <path
      d="M8 7C5.23858 7 3 9.23858 3 12V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V12C13 9.23858 10.7614 7 8 7Z"
      fill="currentColor"
    />
  </svg>
);

interface Notification {
  id: number;
  title: string;
  description: string;
  type: 'episode' | 'friendRequest';
  timestamp: string;
  read: boolean;
}

export default function Header() {
  const t = useTranslations('header');
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка уведомлений через API
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchNotifications()
        .then((data: Notification[]) => { 
          setNotifications(data);
          setError(null);
        })
        .catch((err: unknown) => {
          console.error('Ошибка при загрузке уведомлений:', err);
          setError(err instanceof Error ? err.message : t('notificationError'));
        })
        .finally(() => setLoading(false));
    } else {
      setNotifications([]);
      setError(null);
      setLoading(false);
    }
  }, [isAuthenticated, t]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const getAvatarSrc = (): string => {
    if (user?.avatar && typeof user.avatar === 'string') {
      return user.avatar.startsWith('http') ? user.avatar : `/images/${user.avatar}`;
    }
    return '/images/icons/user.png';
  };

  return (
    <header className="sticky top-0 z-50 bg-black bg-opacity-80 backdrop-blur-md text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Логотип */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="Anisign Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-bold">Anisign</span>
        </Link>

        {/* Навигация и элементы для десктопа */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/anime-list" className="hover:text-yellow-400 transition-colors">
            {t('animeList')}
          </Link>

          {/* Поле поиска */}
          <SearchBar className="w-64" />

          {isAuthenticated ? (
            // Элементы для авторизованного пользователя
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 hover:bg-white/[0.04] rounded-full transition-colors"
                aria-label={t('notifications')}
              >
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="p-2 hover:bg-white/[0.04] rounded-full"
                aria-label={t('profile')}
              >
                <Image
                  src={getAvatarSrc()}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                    (e.target as HTMLImageElement).outerHTML = UserIcon().props.dangerouslySetInnerHTML?.__html || '';
                  }}
                />
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            // Элементы для неавторизованного пользователя
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/register"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
              >
                {t('register')}
              </Link>
              <Link
                href="/auth/login"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all"
              >
                {t('login')}
              </Link>
            </div>
          )}
        </nav>

        {/* Мобильное меню (бургер) */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-md p-4 rounded-b-lg shadow-lg"
          >
            <nav className="flex flex-col space-y-4">
              <Link
                href="/anime-list"
                className="hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('animeList')}
              </Link>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsNotificationsOpen(true);
                    }}
                    className="flex items-center space-x-2 hover:text-yellow-400 transition-colors"
                  >
                    <span>{t('notifications')}</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      router.push('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="hover:text-yellow-400 transition-colors"
                  >
                    {t('profile')}
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('register')}
                  </Link>
                  <Link
                    href="/auth/login"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Окно уведомлений */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsNotificationsOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-black/90 border border-white/5 rounded-xl p-6 w-full max-w-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-white">{t('notificationsTitle')}</h3>
              {loading ? (
                <p className="text-white/60">{t('loading')}</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : notifications.length === 0 ? (
                <p className="text-white/60">{t('noNotifications')}</p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.read ? 'bg-black/70' : 'bg-black/90'
                      } hover:bg-black/80 transition-colors`}
                    >
                      <h4 className="text-white font-medium">{notification.title}</h4>
                      <p className="text-white/60 text-sm">{notification.description}</p>
                      <p className="text-white/40 text-xs mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="mt-2 text-blue-400 hover:text-blue-500 text-xs"
                        >
                          {t('markAsRead')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
              >
                {t('close')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}