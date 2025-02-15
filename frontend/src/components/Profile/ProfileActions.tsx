'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Trophy, Settings, Share2, Flag, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileActionsProps {
    isOwnProfile?: boolean;
    username?: string;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ isOwnProfile = false, username }) => {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-3"
        >
            {/* Primary Actions */}
            {isOwnProfile ? (
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
            ) : (
                <>
                    <motion.div variants={itemVariants}>
                        <Button 
                            className="h-[45px] px-4 bg-[#DEDEDF] hover:bg-[#DEDEDF]/60 text-black font-medium rounded-full flex items-center gap-2"
                        >
                            <MessageSquare className="h-4 w-4" />
                            Написать сообщение
                        </Button>
                    </motion.div>
                    
                    {/* Secondary Actions */}
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
};

export default ProfileActions;
