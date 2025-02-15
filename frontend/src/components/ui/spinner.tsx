'use client';

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
};

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
    return (
        <Loader2 
            className={cn(
                "animate-spin text-white/60",
                sizeClasses[size],
                className
            )}
        />
    );
}; 