'use client';

import React, { useCallback } from 'react';

interface SelectItemProps {
    children: React.ReactNode;
    value: string;
    onSelect: (value: string) => void;
    selected?: boolean;
    className?: string;
}
export function SelectItem({ children, value, onSelect, selected = false, className }: SelectItemProps) {
    const handleClick = useCallback(() => {
        onSelect(value);
    }, [value, onSelect]);
    return (
        <div
            onClick={handleClick}
            className={className || `px-3 py-2 text-white/80 hover:bg-white/[0.04] ${selected ? 'bg-white/[0.06]' : ''}`}
        >
            {children}
        </div>
    );
}