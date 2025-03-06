"use client";

import React, { useState } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { mergeClass } from "@/lib/utils/mergeClass";
import { Skeleton } from "@/components/ui/skeleton";
import { atom, useAtom } from "jotai";
import { getAvatarUrl } from "@/lib/utils/avatar";

// Атом для состояния аутентификации (из Header.tsx)
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Пропсы компонента HeaderAvatar
 * @interface HeaderAvatarProps
 */
interface HeaderAvatarProps {
    username?: string;
    avatar?: string;
    className?: string;
}

/**
 * Компонент аватара пользователя
 * @description Отображает аватар пользователя с поддержкой изображения или fallback
 * @param {HeaderAvatarProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const HeaderAvatar: React.FC<HeaderAvatarProps> = React.memo(
  ({ className = "h-[42px] w-[42px]" }) => {
    const [auth] = useAtom(authAtom);
    const [isLoading, setIsLoading] = useState(!!auth?.user?.user_avatar);
    const username = auth?.user?.username || "";
    const avatarUrl = auth?.user?.user_avatar ? getAvatarUrl(auth.user.user_avatar) : undefined;

    if (!auth?.user && auth?.isAuthenticated) {
      return <Skeleton className={mergeClass("h-[42px] w-[42px] rounded-full", className)} />;
    }

    return (
      <AvatarPrimitive.Root
        className={mergeClass(
          "relative flex h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full",
          className
        )}
      >
        {isLoading && avatarUrl && (
          <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-full" />
        )}
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={username}
            className="aspect-square object-cover h-full w-full"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        )}
        <AvatarPrimitive.Fallback
          className="flex h-full text-[12px] w-full items-center justify-center border border-white/5 rounded-full bg-white/5 text-white/60 uppercase"
        >
          {username.slice(0, 2)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  }
);

HeaderAvatar.displayName = "HeaderAvatar";
export default HeaderAvatar;