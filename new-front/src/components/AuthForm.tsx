import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import SocialLogin from '@/components/auth/SocialLogin';

type TranslationFunction = ReturnType<typeof useTranslations>;

interface AuthFormProps {
    type: 'login' | 'register';
    onSubmit: (username: string, password: string, confirmPassword?: string) => void;
}

/**
 * Универсальная форма авторизации и регистрации
 * @param type Тип формы
 * @param onSubmit Обработчик отправки формы
 */
const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
    
}