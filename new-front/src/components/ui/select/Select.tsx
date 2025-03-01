'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { SelectContent } from './SelectContent';
import { SelectTrigger } from './SelectTrigger';
import { SelectValue } from './SelectValue';
import { useTranslations } from 'next-intl';

interface SelectProps {
    children: React.ReactNode;
    onValueChange: (value: string) => void;
    defaultValue?: string;
    value?: string;
    className?: string;
}
export function Select({ children, onValueChange, defaultValue, value: controlledValue, className }: SelectProps) {
    const t = useTranslations('common');
    const [internalValue, setInternalValue] = useState<string>(defaultValue || '');
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = useCallback((newValue: string) => {
        setInternalValue(newValue);
        onValueChange(newValue);
    }, [onValueChange]);
    useEffect(() => {
        if (controlledValue !== undefined) {
            setInternalValue(controlledValue);
        }
    }, [controlledValue]);

    return (
        <div className={className || 'relative w-full'}>
            <SelectTrigger onClick={() => {}}>
                <SelectValue placeholder={t('selectPlaceholder')} />
            </SelectTrigger>
            <SelectContent value={value} onValueChange={onValueChange}>
                {children}
            </SelectContent>
        </div>
    );
}