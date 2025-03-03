'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button/Button';
import { useAuthState } from '@/lib/stores/authStore';
import { Google, Discord } from '@/shared/icons';

interface SocialLoginProps {
  className?: string;
}

export function SocialLogin({ className }: SocialLoginProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { socialLogin, isAuthenticated } = useAuthState(); 
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Обработка входа через социальную сеть
  const handleSocialLogin = useCallback(async (provider: 'google' | 'discord') => {
    setIsLoading(provider);
    setError(null);
    try {
      const authUrl = `/api/auth/${provider}`;
      window.location.href = authUrl;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t('errorSocialLogin'));
      } else {
        setError(t('errorSocialLogin'));
      }
    } finally {
      setIsLoading(null);
    }
  }, [t]);

  // Обработка обратного вызова после авторизации
  useEffect(() => {
    const code = searchParams?.get('code');
    const state = searchParams?.get('state');
    if (code && state) {
      handleCallback(code, state);
    }
  }, [searchParams]);

  // Обработка обратного вызова от провайдера
  const handleCallback = useCallback(async (code: string, state: string) => {
    setIsLoading('callback');
    setError(null);
    try {
      await socialLogin('google', code); 
      router.push('/profile'); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t('errorSocialLoginCallback'));
      } else {
        setError(t('errorSocialLoginCallback'));
      }
    } finally {
      setIsLoading(null);
    }
  }, [socialLogin, router, t]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={className || 'space-y-4'}>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="bg-black border-white/5 text-white/60 hover:bg-white/[0.04] rounded-xl flex items-center gap-2 w-full"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading === 'google'}
        >
          {isLoading === 'google' ? (
            <span className="animate-spin w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full" />
          ) : (
            <Google className="w-5 h-5" />
          )}
          {t('loginWithGoogleAuth')}
        </Button>
        <Button
          variant="outline"
          className="bg-black border-white/5 text-white/60 hover:bg-white/[0.04] rounded-xl flex items-center gap-2 w-full"
          onClick={() => handleSocialLogin('discord')}
          disabled={isLoading === 'discord'}
        >
          {isLoading === 'discord' ? (
            <span className="animate-spin w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full" />
          ) : (
            <Discord className="w-5 h-5" />
          )}
          {t('loginWithDiscordAuth')}
        </Button>
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-sm">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}