'use client';

import React from 'react';

interface SelectValueProps {
    children?: React.ReactNode;
    placeholder: string;
    className?: string;
}
export function SelectValue({ children, placeholder, className }: SelectValueProps) {
    return (
        <span className={className || 'truncate text-white/60'}>
            {children || placeholder}
        </span>
    );
}