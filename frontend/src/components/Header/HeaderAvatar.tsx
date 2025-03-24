"use client";

import React, { useState } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { mergeClass } from "@/lib/utils/mergeClass";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtom } from "jotai";
import { getAvatarUrl } from "@/lib/utils/avatar";
import { userAtom } from "@/lib/atom/authAtom";
import { User, List, Settings, LogOut } from "lucide-react";

interface HeaderAvatarProps {
  className?: string;
}

export const HeaderAvatar: React.FC<HeaderAvatarProps> = React.memo(
  ({ className = "h-[42px] w-[42px]" }) => {
    const [user] = useAtom(userAtom);
    const [isLoading, setIsLoading] = useState(!!user?.user_avatar);
    const username = user?.username || "";
    const avatarUrl = user?.user_avatar ? getAvatarUrl(user.user_avatar) : undefined;

    if (!user) {
      return <Skeleton className={mergeClass("h-[42px] w-[42px] rounded-full", className)} />;
    }

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <AvatarPrimitive.Root
              className={mergeClass(
                "relative flex h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full",
                className
              )}
            >
              {isLoading && avatarUrl && (
                <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-full" />
              )}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={username}
                  className="aspect-square object-cover h-full w-full"
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                />
              ) : (
                <AvatarPrimitive.Fallback
                  className="flex h-full text-[12px] w-full items-center justify-center border border-white/5 rounded-full bg-white/5 text-white/60 uppercase"
                >
                  {username.slice(0, 2)}
                </AvatarPrimitive.Fallback>
              )}
            </AvatarPrimitive.Root>
            <span className="text-white text-sm font-medium">{username}</span>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-black text-white py-2">
          <DropdownMenu.Item className="flex flex-row items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer">
            <User size={25} className="text-gray-500" />
            <div className="flex flex-col">
              <span className="font-medium">Профиль</span>
              <span className="text-xs text-gray-400">Просмотр профиля</span>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Item className="flex flex-row items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer">
            <List size={25} className="text-gray-500" />
            <div className="flex flex-col">
              <span className="font-medium">Мои списки</span>
              <span className="text-xs text-gray-400">Управление списками</span>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Item className="flex flex-row items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer">
            <Settings size={25} className="text-gray-500" />
            <div className="flex flex-col">
              <span className="font-medium">Настройки</span>
              <span className="text-xs text-gray-400">Настройки профиля</span>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Item className="flex flex-row items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-700 cursor-pointer">
            <LogOut size={25} className="text-red-500" />
            <div className="flex flex-col">
              <span className="font-medium">Выйти</span>
              <span className="text-xs text-red-400">Выход из аккаунта</span>
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  }
);

HeaderAvatar.displayName = "HeaderAvatar";
export default HeaderAvatar;
