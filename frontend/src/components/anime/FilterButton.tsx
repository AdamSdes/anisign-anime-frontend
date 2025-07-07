'use client';

import { ReactNode } from 'react';

interface FilterButtonProps {
  children: ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

export default function FilterButton({ 
  children, 
  isActive = false, 
  onClick 
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 h-[35px] flex items-center gap-[10px] rounded-full text-[13px] font-medium transition-all duration-300 ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-white/5 text-white/60 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}
