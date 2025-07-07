'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  indicator?: ReactNode;
  icon?: ReactNode;
  hasActiveFilters?: boolean;
}

export default function FilterSection({ 
  title, 
  children, 
  defaultOpen = false,
  indicator,
  icon,
  hasActiveFilters = false
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div 
      data-state={isOpen ? "open" : "closed"}
      className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-5 rounded-[14px] mb-3 group"
      style={{ opacity: 1, transform: 'none' }}
    >
      <div 
        className="flex items-center justify-between gap-2"
        style={{ opacity: 1 }}
      >
        <div 
          className="flex items-center gap-2 cursor-pointer flex-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {icon}
          <div className="flex items-center">
            <h3 className="text-[14px] font-medium text-white/80">{title}</h3>
            {hasActiveFilters && (
              <div className="ml-2 w-2 h-2 rounded-full bg-[#50e3c2]"></div>
            )}
            {indicator && <div className="ml-2">{indicator}</div>}
          </div>
        </div>
        
        <button 
          className="inline-flex gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary/60 hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 h-8 w-8"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="1em" 
            height="1em" 
            viewBox="0 0 24 24" 
            className="size-4 group-data-[state=closed]:hidden"
          >
            <path 
              fill="currentColor" 
              d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
            />
          </svg>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="1em" 
            height="1em" 
            viewBox="0 0 24 24" 
            className="size-4 group-data-[state=open]:hidden"
          >
            <path 
              fill="currentColor" 
              d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062"
            />
          </svg>
        </button>
      </div>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1, 
              marginTop: 16,
              transition: { 
                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }, 
                opacity: { duration: 0.25, ease: "easeInOut" } 
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              marginTop: 0,
              transition: { 
                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }, 
                opacity: { duration: 0.25, delay: 0.1, ease: "easeInOut" } 
              }
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
