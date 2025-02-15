'use client';
import React, { useState, useEffect } from 'react';
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
  ChevronDown, 
  Bell, 
  Crown, 
  PlayCircle, 
  Heart, 
  Star, 
  ThumbsUp, 
  Clock, 
  Trophy 
} from 'lucide-react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { toast } from 'sonner';
import HeaderAvatar from './HeaderAvatar';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAvatarUrl } from '@/utils/avatar';

interface UserLoggedNavBarProps {
  username: string;
  avatar?: string;
  nickname?: string;
  isPro?: boolean;
  notifications?: number;
}

interface NotificationType {
  id: number;
  type: 'episode' | 'reaction' | 'achievement';
  title: string;
  message: string;
  time: string;
  read: boolean;
  image?: string;
  badge?: string;
  icon?: React.ComponentType;
}

export const UserLoggedNavBar = ({ 
  username, 
  avatar,
  nickname,
  isPro = false,
}: UserLoggedNavBarProps) => {
  const router = useRouter();
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>(avatar);

  useEffect(() => {
    console.log('[UserLoggedNavBar] Props:', { username, avatar, nickname });
    if (avatar !== currentAvatar) {
      setCurrentAvatar(avatar);
    }
  }, [username, avatar, currentAvatar, nickname]);

  const handleAvatarLoadingChange = (loading: boolean) => {
    console.log('[UserLoggedNavBar] Avatar loading changed:', loading);
    setIsAvatarLoading(loading);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Вы успешно вышли');
      router.push('/auth');
    } catch (error) {
      toast.error('Ошибка при выходе');
    }
  };

  const notificationsList: NotificationType[] = [
    {
      id: 1,
      type: 'episode',
      title: 'Магическая битва 2',
      message: 'Вышла серия 13',
      time: '5 минут назад',
      read: false,
      image: '/mock/anime1.jpg',
      badge: 'Новая серия'
    },
    {
      id: 2,
      type: 'reaction',
      title: '@username',
      message: 'Оценил ваш комментарий к аниме "Блич"',
      time: '1 час назад',
      read: true,
      badge: 'Реакция'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Новое достижение!',
      message: 'Разблокировано достижение "Начинающий критик"',
      time: '2 часа назад',
      read: true,
      badge: 'Достижение',
      icon: Trophy
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Notifications Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all duration-200">
            <Bell className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors" />
            {notificationsList.some(n => !n.read) && (
              <Badge 
                className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1.5 bg-[#CCBAE4] hover:bg-[#CCBAE4] text-black text-[11px] font-medium"
              >
                {notificationsList.filter(n => !n.read).length}
              </Badge>
            )}
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-[380px] bg-[#060606]/95 backdrop-blur-xl border-white/5 p-2 rounded-xl"
        >
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <h4 className="text-[14px] font-medium text-white/90">Уведомления</h4>
              <Badge className="bg-[#CCBAE4]/10 text-[#CCBAE4] hover:bg-[#CCBAE4]/20 font-normal">
                {notificationsList.filter(n => !n.read).length} новых
              </Badge>
            </div>
            <button className="text-[12px] text-[#CCBAE4] hover:text-[#CCBAE4]/80 transition-colors">
              Отметить все
            </button>
          </div>
          
          <div className="mt-2 space-y-1">
            {notificationsList.map((notification) => (
              <div
                key={notification.id}
                className={`
                  group flex items-start gap-4 p-3 rounded-lg cursor-pointer
                  ${notification.read ? 'opacity-60' : 'opacity-100'}
                  hover:bg-white/[0.04] transition-all duration-200
                `}
              >
                <div className={`
                  relative flex-shrink-0 w-[60px] h-[60px] rounded-lg overflow-hidden
                  ${!notification.read && 'ring-2 ring-[#CCBAE4]/20'}
                  border border-white/5
                `}>
                  {notification.image ? (
                    <img 
                      src={notification.image} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
                      {notification.icon ? (
                        <notification.icon className="w-6 h-6 text-white/40" />
                      ) : (
                        <Bell className="w-6 h-6 text-white/40" />
                      )}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                      className="flex-shrink-0 bg-white/[0.02] border-white/5 text-white/40 text-[11px]"
                    >
                      {notification.badge}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[12px] text-white/40">
                    <Clock className="w-3.5 h-3.5" />
                    {notification.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-2 bg-white/5" />

          <button className="w-full p-2 text-[13px] text-center text-[#CCBAE4] hover:text-[#CCBAE4]/80 hover:bg-white/[0.04] transition-all rounded-lg">
            Все уведомления
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-[20px] bg-white/5" />

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
          <div className="flex items-center gap-2">
            <HeaderAvatar 
              username={username} 
              avatar={currentAvatar}
              isLoading={isAvatarLoading}
              onLoadingChange={handleAvatarLoadingChange}
            />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white/90">
                {nickname || username}
              </span>
              {isPro && (
                <span className="text-xs text-yellow-500/90">PRO</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-white/60" />
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-[280px] bg-[#060606]/95 backdrop-blur-xl border-white/5 p-2 rounded-xl"
        >

          
          <div className="grid gap-1">
            <Link href={`/profile/${username}`}>
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
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};