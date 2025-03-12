"use client";

import React, { useState } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { mergeClass } from "@/lib/utils/mergeClass";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtom } from "jotai";
import { getAvatarUrl } from "@/lib/utils/avatar";
import { userAtom } from "@/lib/atom/authAtom"; 

interface HeaderAvatarProps {
  username?: string;
  avatar?: string;
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