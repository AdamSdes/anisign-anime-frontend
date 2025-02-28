import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    className?: string;
    required?: boolean;
    htmlFor?: string;
}
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ children, className, required, htmlFor, ...props }, ref) => {
        const t = useTranslations('common');
        return (
            <label 
                ref={ref}
                htmlFor={htmlFor}
                className={cn(
                    'text-sm font-medium text-white/80',
                    'cursor-pointer hover:text-white',
                    required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
                    className
                )}
                {...props}
            >
                {children}
            </label>
        );
    }
);

Label.displayName = 'Label';