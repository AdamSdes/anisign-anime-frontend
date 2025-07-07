"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export function PagesDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className="relative"
      ref={dropdownRef}
    >
      <button
        className="flex items-center gap-1 text-[14px] px-2 py-1"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
      >
        Страницы
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {open && (
        <div 
          className="absolute left-0 w-40 py-2 mt-1 bg-[#121212] rounded-lg shadow-xl z-10"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex w-full items-center px-3 py-2 text-sm hover:bg-[#1e1e1e] cursor-pointer">
            <Link href='/about' className='w-full'>О проекте</Link>
          </div>
          <div className="flex w-full items-center px-3 py-2 text-sm hover:bg-[#1e1e1e] cursor-pointer">
            <Link href='/news' className='w-full'>Новости</Link>
          </div>
          <div className="flex w-full items-center px-3 py-2 text-sm hover:bg-[#1e1e1e] cursor-pointer">
            <Link href='/contact' className='w-full'>Контакты</Link>
          </div>
        </div>
      )}
    </div>
  );
}
