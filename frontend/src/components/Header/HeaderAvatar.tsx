'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { getAvatarUrl } from "@/utils/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from '@/hooks/useAuth';

interface HeaderAvatarProps {
    className?: string;
}

export const HeaderAvatar: React.FC<HeaderAvatarProps> = ({ 
    className = "h-[42px] w-[42px]",
}) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const username = user?.username || '';
    const avatarUrl = user?.user_avatar ? getAvatarUrl(user.user_avatar) : undefined;

    // Показываем скелетон только если идет загрузка И пользователь авторизован
    if (!user && isAuthenticated) {
        return (
            <Skeleton className={cn("h-[42px] w-[42px] rounded-full", className)} />
        );
    }

    return (
        <AvatarPrimitive.Root
            className={cn(
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
                className="flex h-full w-full items-center justify-center rounded-full bg-muted"
            >
                {username.slice(0, 2)}
            </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    );
};

export default HeaderAvatar;