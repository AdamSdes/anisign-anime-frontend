'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { Label } from '@/components/ui/label/Label';
import { useAuthState } from '@/lib/stores/authStore';
import { SocialLogin } from '@/components/auth/SocialLogin'; 

interface AuthFormProps {
  className?: string;
}

export  function AuthForm({ className }: AuthFormProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const { login, isAuthenticated } = useAuthState();
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      if (!response.ok) throw new Error(t('loginError'));
      const data = await response.json();
      login(data.token, data.user); 
      localStorage.setItem('token', data.token);
      router.push('/profile');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t('loginError'));
      } else {
        setError(t('loginError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={className || 'space-y-8 p-4 bg-black/90 backdrop-blur-md rounded-xl border border-white/5 shadow-lg'}>
      <h2 className="text-2xl font-bold text-white/90 text-center">
        {t('login')}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identifier" className="text-white/80">
            {t('usernameOrEmail')}
          </Label>
          <Input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={t('usernameOrEmailPlaceholder')}
            className="bg-white/[0.02] border border-white/5 text-white/60 placeholder:text-white/40 focus:ring-2 focus:ring-[#CCBAE4]/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/80">
            {t('password')}
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder')}
            className="bg-white/[0.02] border border-white/5 text-white/60 placeholder:text-white/40 focus:ring-2 focus:ring-[#CCBAE4]/50"
          />
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-sm">
            <span>{error}</span>
          </div>
        )}
        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="w-full bg-gray-200 text-black hover:bg-gray-300 rounded-xl"
        >
          {isLoading ? t('loading') : t('login')}
        </Button>
      </form>
      <div className="text-center text-sm text-white/60">
        {t('or')} <SocialLogin className="inline-block" /> {/* Интеграция SocialLogin */}
      </div>
      <p className="text-center text-sm text-white/60">
        {t('noAccount')} <a href="/auth/register" className="text-[#CCBAE4] hover:underline">{t('register')}</a>
      </p>
    </div>
  );
}