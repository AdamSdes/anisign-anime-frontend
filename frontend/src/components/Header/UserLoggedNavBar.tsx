"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
  BookMarked,
  Bell,
  ChevronDown,
  Crown,
} from "lucide-react";
import { logout } from "@/services/auth";
import { atom, useAtom } from "jotai";
import { Badge } from "@/components/ui/badge";
import HeaderAvatar from "./HeaderAvatar";
import { Separator } from "@/components/ui/separator";
import { mergeClass } from "@/lib/utils/mergeClass";

// Атом для состояния аутентификации (из Header.tsx)
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Тип уведомления
 * @interface NotificationType
 */
interface NotificationType {
  id: number;
  type: "episode" | "reaction" | "achievement" | "friend" | "anime";
  title: string;
  message: string;
  time: string;
  read: boolean;
  image?: string;
  badge?: string;
  link?: string;
}

/**
 * Пропсы компонента UserLoggedNavBar
 * @interface UserLoggedNavBarProps
 */
interface UserLoggedNavBarProps {
  notifications?: number;
}

/**
 * Компонент навигационной панели для авторизованного пользователя
 * @description Отображает уведомления и профиль пользователя с выпадающими меню
 * @param {UserLoggedNavBarProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const UserLoggedNavBar: React.FC<UserLoggedNavBarProps> = React.memo(
  ({ notifications = 0 }) => {
    const [auth] = useAtom(authAtom);
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await logout();
        toast.success("Вы успешно вышли");
        router.push("/auth");
      } catch (error) {
        toast.error("Ошибка при выходе");
      }
    };

    // Пример данных уведомлений (можно заменить на SWR-запрос)
    const notificationsList: NotificationType[] = [
      {
        id: 1,
        type: "anime",
        title: "Магическая битва 2",
        message: "Вышла новая серия 13",
        time: "5 минут назад",
        read: false,
        image: "https://animego.org/media/cache/thumbs_250x350/upload/anime/images/64aaabf85970e166817725.jpg",
        badge: "Новая серия",
        link: "/anime/123",
      },
      {
        id: 2,
        type: "friend",
        title: "@kerrytokyo",
        message: "Добавил вас в друзья",
        time: "15 минут назад",
        read: false,
        image: "https://i.pinimg.com/736x/26/27/2b/26272b824bd1cc443988391899355ea5.jpg",
        badge: "Новый друг",
        link: "/profile/kerrytokyo",
      },
    ];

    return (
      <div className="flex items-center gap-4">
        {/* Уведомления */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all">
              <Bell className="w-5 h-5 text-white/60 hover:text-white/90 transition-colors" />
              {notifications > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1.5 bg-[#CCBAE4] text-black text-[11px] font-medium">
                  {notifications}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[420px] bg-[#060606]/95 backdrop-blur-xl border-white/5 p-3 rounded-xl"
          >
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <h4 className="text-[14px] font-medium text-white/90">Уведомления</h4>
                <Badge className="bg-[#CCBAE4]/10 text-[#CCBAE4] hover:bg-[#CCBAE4]/20">
                  {notificationsList.filter((n) => !n.read).length} новых
                </Badge>
              </div>
              <button className="text-[12px] text-[#CCBAE4] hover:text-[#CCBAE4]/80 transition-colors">
                Отметить все
              </button>
            </div>
            {notificationsList.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <Bell className="w-8 h-8 text-white/10 mb-3" />
                <p className="text-[14px] text-white/40 mb-1">Нет новых уведомлений</p>
                <p className="text-[12px] text-white/30">Здесь будут появляться ваши уведомления</p>
              </div>
            ) : (
              <div className="max-h-[420px] overflow-y-auto space-y-1">
                {notificationsList.map((notification) => (
                  <Link
                    key={notification.id}
                    href={notification.link || "#"}
                    className={`group flex items-start gap-4 p-3 rounded-lg cursor-pointer ${
                      notification.read ? "opacity-60" : "opacity-100"
                    } hover:bg-white/[0.04] transition-all`}
                  >
                    <div
                      className={`relative flex-shrink-0 w-[60px] h-[60px] rounded-lg overflow-hidden ${
                        !notification.read && "ring-2 ring-[#CCBAE4]/20"
                      } border border-white/5`}
                    >
                      {notification.image ? (
                        <img
                          src={notification.image}
                          alt={notification.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
                          <Bell className="w-6 h-6 text-white/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h4 className="text-[14px] font-medium text-white/90 line-clamp-1">
                            {notification.title}
                          </h4>
                          <p className="text-[13px] text-white/60 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={mergeClass(
                            "flex-shrink-0 bg-white/[0.02] border-white/5 text-[11px]",
                            {
                              "bg-[#CCBAE4]/10 text-[#CCBAE4] border-[#CCBAE4]/20":
                                notification.type === "anime",
                              "bg-blue-500/10 text-blue-400 border-blue-500/20":
                                notification.type === "friend",
                            }
                          )}
                        >
                          {notification.badge}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[12px] text-white/40">
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Separator className="my-2 bg-white/5" />
            <Link href="/profile/notifications">
              <button className="w-full p-2 text-[13px] text-center text-[#CCBAE4] hover:text-[#CCBAE4]/80 hover:bg-white/[0.04] transition-all rounded-lg">
                Все уведомления
              </button>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-[22px] bg-white/5" />

        {/* Профиль */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-4 pr-[20px] pl-[10px] py-2 rounded-full hover:bg-white/[0.02] transition-colors outline-none group">
            <HeaderAvatar />
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-medium text-white/90">
                {auth?.user?.nickname || auth?.user?.username}
              </span>
              {auth?.user?.isPro && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90">
                  <Crown className="w-3 h-3" />
                  <span>PRO</span>
                </div>
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-white/40 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[280px] bg-[#060606]/95 backdrop-blur-xl border-white/5 p-3 rounded-xl"
          >
            <Link href={`/profile/${auth?.user?.username}`}>
              <DropdownMenuItem className="flex items-center gap-3 p-3 text-white/60 hover:text-white focus:text-white rounded-lg data-[highlighted]:bg-white/5 cursor-pointer group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <User className="h-4 w-4 text-white/40 group-hover:text-white/60" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium">Профиль</span>
                  <span className="text-[12px] text-white/40">Просмотр профиля</span>
                </div>
              </DropdownMenuItem>
            </Link>
            <Link href="/profile/lists">
              <DropdownMenuItem className="flex items-center gap-3 p-3 text-white/60 hover:text-white focus:text-white rounded-lg data-[highlighted]:bg-white/5 cursor-pointer group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <BookMarked className="h-4 w-4 text-white/40 group-hover:text-white/60" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium">Мои списки</span>
                  <span className="text-[12px] text-white/40">Управление списками</span>
                </div>
              </DropdownMenuItem>
            </Link>
            <Link href="/profile/settings">
              <DropdownMenuItem className="flex items-center gap-3 p-3 text-white/60 hover:text-white focus:text-white rounded-lg data-[highlighted]:bg-white/5 cursor-pointer group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Settings className="h-4 w-4 text-white/40 group-hover:text-white/60" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium">Настройки</span>
                  <span className="text-[12px] text-white/40">Настройки профиля</span>
                </div>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="my-1 bg-white/5" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 text-red-400 hover:text-red-300 focus:text-red-300 rounded-lg hover:bg-red-500/10 data-[highlighted]:bg-red-500/10 cursor-pointer group"
            >
              <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium">Выйти</span>
                <span className="text-[12px] text-red-400/60">Выход из аккаунта</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

UserLoggedNavBar.displayName = "UserLoggedNavBar";
export default UserLoggedNavBar;