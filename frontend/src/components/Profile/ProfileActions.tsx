"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Settings, Share2, Flag, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { atom, useAtom } from "jotai";

// Атом для состояния аутентификации
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Пропсы компонента ProfileActions
 * @interface ProfileActionsProps
 */
interface ProfileActionsProps {
  isOwnProfile?: boolean;
  username?: string;
}

/**
 * Компонент действий профиля
 * @description Отображает кнопки действий в зависимости от принадлежности профиля
 * @param {ProfileActionsProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const ProfileActions: React.FC<ProfileActionsProps> = React.memo(
  ({ isOwnProfile = false, username }) => {
    const [auth] = useAtom(authAtom);

    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.1 },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.2 },
      },
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap items-center gap-3"
      >
        {/* Действия для владельца профиля */}
        {isOwnProfile && auth.isAuthenticated && (
          <>
            <motion.div variants={itemVariants}>
              <Link href="/achievements">
                <Button
                  className="h-[45px] px-4 bg-[#CCBAE4]/10 hover:bg-[#CCBAE4]/20 text-[#CCBAE4] rounded-full flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  Достижения
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/settings">
                <Button
                  className="h-[45px] px-4 bg-white/[0.02] hover:bg-white/[0.04] text-white/90 hover:text-white rounded-full flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Настройки профиля
                </Button>
              </Link>
            </motion.div>
          </>
        )}

        {/* Действия для чужого профиля */}
        {!isOwnProfile && username && (
          <>
            <motion.div variants={itemVariants}>
              <Button
                className="h-[45px] px-4 bg-[#DEDEDF] hover:bg-[#DEDEDF]/60 text-black font-medium rounded-full flex items-center gap-2"
                asChild
              >
                <Link href={`/messages?user=${username}`}>
                  <MessageSquare className="h-4 w-4" />
                  Написать сообщение
                </Link>
              </Button>
            </motion.div>

            {/* Вторичные действия */}
            <div className="flex items-center gap-2">
              <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-[45px] h-[45px] rounded-full bg-white/[0.02] hover:bg-white/[0.04] text-white/60 hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-[45px] h-[45px] rounded-full bg-white/[0.02] hover:bg-white/[0.04] text-white/60 hover:text-white"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    );
  }
);

ProfileActions.displayName = "ProfileActions";
export default ProfileActions;