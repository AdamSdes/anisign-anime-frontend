'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input/Input';
import { Search } from '@/shared/icons'; 

interface SearchBarProps {
  className?: string; 
  placeholder?: string;
}

export function SearchBar({ className, placeholder = 'Поиск...' }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');
  const router = useRouter();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/anime?search=${encodeURIComponent(query.trim())}`);
    }
  }, [query, router]);

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-3 bg-white/[0.02] border border-white/5 rounded-xl text-white/60 placeholder:text-white/40 focus:ring-2 focus:ring-[#CCBAE4]/50"
      />
    </form>
  );
}