'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { SelectItem } from './SelectItem';

interface SelectContentProps {
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}
export function SelectContent({ children, value, onValueChange, className }: SelectContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
            onValueChange('');
        }
    }, [onValueChange]);
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);
    return (
        <div
            ref={contentRef}
            className={className || 'absolute z-50 mt-1 w-full bg-[#060606]/95 backdrop-blur-xl border border-white/5 rounded-xl shadow-lg'}
        >
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === SelectItem) {
                    return React.cloneElement(child as React.ReactElement, {
                        onSelect: onValueChange,
                        selected: child.props.value === value,
                    });
                }
                return child;
            })}
        </div>
    );
}