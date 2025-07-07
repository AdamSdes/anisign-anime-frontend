"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Auth from "@/features/auth/Auth";
import { useAuth } from "@/context/AuthContext";

/**
 * Страница авторизации
 */
export default function AuthPage() {
  const router = useRouter();
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  // Моки OAuth URLs для демонстрации
  const mockOauthUrls = {
    google: "#",
    discord: "#"
  };

  const handleLogin = async (username: string, password: string, rememberMe: boolean) => {
    try {
      await login(username, password, rememberMe);
      toast.success(`Успешный вход: ${username}`);
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ошибка при входе в систему");
      }
    }
  };

  const handleRegister = async (username: string, email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    
    try {
      await register(username, email, password, confirmPassword);
      toast.success(`Регистрация успешна: ${username}`);
      setIsLogin(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ошибка при регистрации");
      }
    }
  };

  const handleRecovery = async (email: string) => {
    // Здесь будет логика восстановления пароля
    if (!email || !email.includes("@")) {
      toast.error("Введите корректный email");
      return;
    }
    
    toast.success(`Инструкции по восстановлению отправлены на ${email} (в разработке)`);
    console.log("Recovery attempt:", { email });
    
    // Возвращаемся к форме входа
    setIsRecovery(false);
  };

  return (
    <Auth
      isLogin={isLogin}
      isRecovery={isRecovery}
      loading={loading}
      onLoginSubmit={(username: string, password: string, rememberMe: boolean) => handleLogin(username, password, rememberMe)}
      onRegisterSubmit={(username: string, email: string, password: string, confirmPassword: string) => handleRegister(username, email, password, confirmPassword)}
      onRecoverySubmit={(email: string) => handleRecovery(email)}
      onToggleForm={() => setIsLogin(!isLogin)}
      onBackToLogin={() => setIsRecovery(false)}
      oauthUrls={mockOauthUrls}
    />
  );
}
