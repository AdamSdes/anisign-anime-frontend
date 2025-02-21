import React, { useEffect, useState, useCallback } from 'react';
import { Check, ChevronDown, X, Eye, Clock, Pause, Ban, Plus, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAnimeListSave, type AnimeListName } from '@/hooks/useAnimeListSave';
import { useAuthStore } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface ListSelectorProps {
    animeId: number;
    onListChange?: (listName: string | null) => void;
}

const ANIME_LISTS = [
    { name: "Watching" as AnimeListName, label: "Смотрю", icon: Eye, color: '#CCBAE4' },
    { name: "Completed" as AnimeListName, label: "Просмотрено", icon: Check, color: '#86EFAC' },
    { name: "On Hold" as AnimeListName, label: "Отложено", icon: Pause, color: '#FCD34D' },
    { name: "Dropped" as AnimeListName, label: "Брошено", icon: Ban, color: '#FDA4AF' },
    { name: "Plan to Watch" as AnimeListName, label: "В планах", icon: Clock, color: '#93C5FD' },
];

export const ListSelector: React.FC<ListSelectorProps> = ({ animeId, onListChange }) => {
    const [currentList, setCurrentList] = useState<AnimeListName | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const { isCheckingList, isUpdatingList, getAnimeList, addAnimeToList, removeAnimeFromList } = useAnimeListSave();

    const checkCurrentList = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            // Check lists sequentially until we find the anime
            for (const list of ANIME_LISTS) {
                const animeList = await getAnimeList(list.name);
                if (animeList?.anime_ids?.includes(animeId)) {
                    setCurrentList(list.name);
                    if (onListChange) onListChange(list.name);
                    return; // Exit early once found
                }
            }
            
            // If we get here, anime wasn't found in any list
            setCurrentList(null);
            if (onListChange) onListChange(null);
        } catch (error) {
            console.error('Error checking lists:', error);
        }
    }, [animeId, getAnimeList, onListChange, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            checkCurrentList();
        } else {
            setCurrentList(null);
            if (onListChange) onListChange(null);
        }
    }, [isAuthenticated, checkCurrentList]);

    const handleListChange = async (listName: AnimeListName | null) => {
        if (isUpdatingList) return;

        try {
            if (currentList === listName) return; // No change needed

            // If removing from all lists
            if (!listName) {
                if (currentList) {
                    const removed = await removeAnimeFromList(animeId);
                    if (removed) {
                        setCurrentList(null);
                        if (onListChange) onListChange(null);
                    }
                }
                return;
            }

            // Moving to a new list
            const added = await addAnimeToList(listName, animeId);
            if (added) {
                setCurrentList(listName);
                if (onListChange) onListChange(listName);
            }
        } catch (error) {
            console.error('Error changing list:', error);
        } finally {
            setDropdownOpen(false);
        }
    };

    const handleRemoveFromList = async (e?: React.MouseEvent | React.KeyboardEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (isUpdatingList || !currentList) return;

        try {
            const removed = await removeAnimeFromList(animeId);
            if (removed) {
                setCurrentList(null);
                if (onListChange) onListChange(null);
                setDropdownOpen(false);
            }
        } catch (error) {
            console.error('Error removing from list:', error);
        }
    };

    const currentListData = ANIME_LISTS.find(list => list.name === currentList);

    if (!isAuthenticated) {
        return (
            <div className="relative group">
                <div className="w-full flex items-center justify-between h-[60px] 
                    bg-white/[0.02] border border-white/5 rounded-xl px-5 
                    text-white/40 cursor-not-allowed"
                >
                    <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" className="text-white/40">
                            <path fill="currentColor" d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
                        </svg>
                        <span className="text-[14px]">Войдите, чтобы добавить</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" className="text-white/20">
                        <path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"/>
                    </svg>
                </div>
                
                {/* Tooltip overlay on hover */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 pointer-events-none"
                >
                    <div className="bg-black/90 backdrop-blur-sm text-white/90 text-[12px] px-3 py-1.5 
                        rounded-lg whitespace-nowrap"
                    >
                        Требуется авторизация
                    </div>
                </div>
            </div>
        );
    }

    return (
        <DropdownMenu open={isAuthenticated && dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <motion.button
                    whileHover={{ opacity: 0.8 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        backgroundColor: currentListData ? `${currentListData.color}10` : 'rgba(255,255,255,0.02)',
                        borderColor: currentListData ? `${currentListData.color}20` : 'rgba(255,255,255,0.1)',
                    }}
                    className="relative w-full flex items-center justify-between h-[60px] 
                        text-white/90 font-medium rounded-xl px-5 border transition-all duration-300"
                    disabled={isUpdatingList || !isAuthenticated}
                >
                    <div className="flex items-center gap-2">
                        {isUpdatingList ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white/60" />
                                <span className="text-white/60">Загрузка...</span>
                            </>
                        ) : !isAuthenticated ? (
                            <>
                                <Plus className="h-5 w-5 text-white/40" />
                                <span className="text-white/40">Войдите, чтобы добавить в список</span>
                            </>
                        ) : currentListData ? (
                            <>
                                <currentListData.icon
                                    className="h-5 w-5"
                                    style={{ color: currentListData.color }}
                                />
                                <span style={{ color: currentListData.color }}>
                                    {currentListData.label}
                                </span>
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4 text-white/60" />
                                <span className='text-white/60'>Добавить в список</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {currentListData && !isUpdatingList && (
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={handleRemoveFromList}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleRemoveFromList(e);
                                    }
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded-full bg-black/50 
                                    hover:bg-black/70 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" style={{ color: currentListData.color }} />
                            </div>
                        )}
                        <ChevronDown 
                            className="h-4 w-4" 
                            style={{ color: currentListData ? currentListData.color : 'currentColor' }} 
                        />
                    </div>
                </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                sideOffset={8}
                className="w-[315px] bg-[#060606]/95 rounded-[14px] backdrop-blur-xl border-white/5"
            >
                {ANIME_LISTS.map((item) => (
                    <DropdownMenuItem
                        key={item.name}
                        onSelect={(e) => {
                            e.preventDefault();
                            handleListChange(item.name);
                        }}
                        style={{
                            backgroundColor: currentList === item.name ? `${item.color}10` : 'transparent',
                        }}
                        className={`
                            flex items-center gap-2 py-3 rounded-[14px] text-[15px] cursor-pointer
                            hover:bg-opacity-10 hover:bg-white
                            transition-colors duration-200
                        `}
                    >
                        <item.icon
                            className="h-4 w-4"
                            style={{ color: item.color }}
                        />
                        <span className="text-white/90">{item.label}</span>
                        {currentList === item.name && (
                            <Check className="h-4 w-4 ml-auto" style={{ color: item.color }} />
                        )}
                    </DropdownMenuItem>
                ))}
                
                {currentList && (
                    <>
                        <DropdownMenuSeparator className="my-2 bg-white/5" />
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                handleRemoveFromList();
                            }}
                            className="flex items-center gap-2 py-3 rounded-[14px] text-[15px] cursor-pointer
                                hover:bg-opacity-10 hover:bg-red-500/10 text-red-400
                                transition-colors duration-200"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Удалить из списка</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
