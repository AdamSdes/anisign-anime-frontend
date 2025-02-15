'use client';
import React from 'react';
import { Users, UserPlus, UserMinus, MoreHorizontal, ChevronDown } from 'lucide-react';
import HeaderAvatar from '../Header/HeaderAvatar';
import Link from 'next/link';
import { Button } from '../ui/button';

const ProfileFriends = () => {
    // Моковые данные для демонстрации дизайна
    const mockFriends = [
        {
            username: "anime_lover",
            nickname: "Anime Lover",
            avatar: "https://i.pinimg.com/736x/2f/b6/a4/2fb6a4d8122a07e0a0f0ad3832b2c8d4.jpg",
            status: "online",
            isFriend: true
        },
        {
            username: "manga_reader",
            nickname: "Manga Reader With Very Long Nickname",
            avatar: "https://i.pinimg.com/originals/01/cb/39/01cb3933edbce06d6132326ad3e817e3.gif",
            status: "offline",
            last_seen: "2 часа назад",
            isFriend: false
        },
        {
            username: "otaku_chan",
            nickname: "Otaku Chan",
            avatar: "https://i.pinimg.com/originals/2d/52/b7/2d52b7617802ac1b8ea5d4f1fffb08a3.gif",
            status: "online",
            isFriend: true
        }
    ];

    return (
        <div className="flex flex-col">
            {/* Заголовок секции с кнопкой показать всех */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-white/40" />
                    <h2 className="text-white/80 text-sm font-medium">Друзья</h2>
                    <span className="text-white/40 text-sm">({mockFriends.length})</span>
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
                {mockFriends.map((friend) => (
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
                            {friend.status === 'online' && (
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
                            {friend.status === 'offline' && friend.last_seen && (
                                <p className="text-white/30 text-xs">
                                    {friend.last_seen}
                                </p>
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

                {/* Если нет друзей */}
                {mockFriends.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-white/[0.02]">
                        <Users className="w-12 h-12 text-white/20 mb-3" />
                        <p className="text-white/40 text-sm text-center">
                            Пока нет друзей
                        </p>
                    </div>
                )}

                {/* Кнопка "Показать ещё" */}
                <Button
                    variant="ghost"
                    className="w-full h-[42px] flex items-center justify-center gap-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] text-white/40 hover:text-white/60 transition-colors"
                >
                    <ChevronDown className="w-4 h-4" />
                    <span className="text-xs">Показать ещё друзей</span>
                </Button>
            </div>
        </div>
    );
};

export default ProfileFriends; 