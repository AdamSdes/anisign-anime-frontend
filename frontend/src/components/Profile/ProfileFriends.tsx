"use client";

import React from "react";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import { Users, UserPlus, UserMinus, MoreHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderAvatar from "../header/HeaderAvatar";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios/axiosConfig";

/**
 * Атом для состояния аутентификации
 * @type {Atom<{ isAuthenticated: boolean; user: { username: string; ... } | null }>}
 */
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс данных друга
 * @interface Friend
 */
interface Friend {
  username: string;
  nickname?: string;
  avatar?: string;
  status: "online" | "offline";
  last_seen?: string;
  isFriend: boolean;
}

/**
 * Пропсы компонента ProfileFriends
 * @interface ProfileFriendsProps
 */
interface ProfileFriendsProps {
  username?: string; // Опционально, если передаётся извне
}

/**
 * Компонент списка друзей
 * @description Отображает список друзей пользователя с возможностью управления
 * @param {ProfileFriendsProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const ProfileFriends: React.FC<ProfileFriendsProps> = React.memo(({ username }) => {
  const [auth] = useAtom(authAtom);
  const currentUsername = username || auth.user?.username;

  // Загрузка списка друзей через SWR
  const { data: friendsData, error, isLoading } = useSWR<Friend[]>(
    currentUsername ? `/api/profile/${currentUsername}/friends` : null,
    (url) => axiosInstance.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-white/5 rounded animate-pulse" />
            <div className="h-6 w-20 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-12 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !friendsData) {
    return <div className="text-red-500">Ошибка загрузки списка друзей</div>;
  }

  const friends = friendsData || [];

  return (
    <div className="flex flex-col">
      {/* Заголовок секции с кнопкой показать всех */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-white/40" />
          <h2 className="text-white/80 text-sm font-medium">Друзья</h2>
          <span className="text-white/40 text-sm">({friends.length})</span>
        </div>
        <Button
          variant="ghost"
          className="text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          Показать всех
        </Button>
      </div>

      {/* Список друзей */}
      <div className="space-y-2">
        {friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-white/[0.02]">
            <Users className="w-12 h-12 text-white/20 mb-3" />
            <p className="text-white/40 text-sm text-center">Пока нет друзей</p>
          </div>
        ) : (
          <>
            {friends.map((friend) => (
              <div
                key={friend.username}
                className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                {/* Аватар с статусом */}
                <div className="relative flex-shrink-0">
                  <HeaderAvatar
                    username={friend.username}
                    avatar={friend.avatar}
                    className="h-10 w-10"
                  />
                  {friend.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black" />
                  )}
                </div>

                {/* Информация о пользователе */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white/80 text-sm font-medium truncate">
                      {friend.nickname || friend.username}
                    </p>
                  </div>
                  {friend.status === "offline" && friend.last_seen && (
                    <p className="text-white/30 text-xs">{friend.last_seen}</p>
                  )}
                </div>

                {/* Кнопки действий */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {friend.isFriend ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/40 hover:text-white/60"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/40 hover:text-white/60"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/40 hover:text-white/60"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full h-[42px] flex items-center justify-center gap-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] text-white/40 hover:text-white/60 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
              <span className="text-xs">Показать ещё друзей</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
});

ProfileFriends.displayName = "ProfileFriends";
export default ProfileFriends;