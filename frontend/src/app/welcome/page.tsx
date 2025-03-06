"use client";

import React from "react";
import { atom, useAtom } from "jotai";
import { WelcomeScreen } from "@/components/WelcomeScreen/welcome-screen";

// Атом для состояния аутентификации (из предыдущих файлов)
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { id: string; username: string; nickname?: string; user_avatar?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Пропсы компонента WelcomePage
 * @interface WelcomePageProps
 */
interface WelcomePageProps {}

/**
 * Компонент приветственной страницы
 * @description Отображает приветственный экран для пользователей портала Anisign
 * @returns {JSX.Element}
 */
const WelcomePage: React.FC<WelcomePageProps> = React.memo(() => {
  const [auth] = useAtom(authAtom);

  return <WelcomeScreen isAunticated={auth.isAuthenticated} />;
});

WelcomePage.displayName = "WelcomePage";
export default WelcomePage;