'use client';

import React, { useCallback } from 'react';
import { ChevronDown } from '@/shared/icons';

interface SelectTriggerProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
}
export function SelectTrigger({ children, onClick, className }: SelectTriggerProps) {
    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        onClick();
    }, [onClick]);
    return (
        <div
            onClick={handleClick}
            className={className || 'w-full h-10 flex items-center justify-between px-3 bg-white/[0.02] border border-white/5 rounded-xl text-white/60 cursor-pointer focus:ring-2 focus:ring-[#CCBAE4]/50'}
        >
            {children}
            <ChevronDown className="w-4 h-4 text-white/60" />
        </div>
    );
}