'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search as SearchIcon, X, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Search = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [inputValue, setInputValue] = useState(searchParams.get('search') ?? '')
    const [isFocused, setIsFocused] = useState(false)

    // Debounced search handler
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId: NodeJS.Timeout;
            return (value: string) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    const query = createQueryString('search', value);
                    router.replace(`${pathname}?${query}`);
                }, 500); // 500ms delay
            };
        })(),
        [pathname, router]
    );

    useEffect(() => {
        // Sync input value with URL only on initial load and direct URL changes
        const searchParam = searchParams.get('search');
        if (searchParam !== inputValue) {
            setInputValue(searchParam ?? '');
        }
    }, [searchParams]);

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) {
            params.set(name, value)
        } else {
            params.delete(name)
        }
        params.set('page', '1')
        return params.toString()
    }

    const handleSearch = (value: string) => {
        setInputValue(value)
        debouncedSearch(value)
    }

    const clearSearch = () => {
        setInputValue('')
        const params = new URLSearchParams(searchParams)
        params.delete('search')
        params.set('page', '1')
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="relative w-full">
            <div className={`
                relative flex items-center gap-2 p-1.5 
                bg-white/[0.02] border border-white/5 rounded-xl
                transition-all duration-300
                ${isFocused ? 'bg-white/[0.03] border-white/10' : ''}
            `}>
                <div className="flex-1 flex items-center gap-3 px-3">
                    <SearchIcon className="w-5 h-5 text-[#555555]" />
                    <Input
                        type="text"
                        value={inputValue}
                        placeholder="Поиск аниме..."
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="h-[50px] bg-transparent border-0 p-0 text-[15px] placeholder:text-white/40 focus-visible:ring-0"
                    />
                    <AnimatePresence>
                        {inputValue && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={clearSearch}
                                    className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10"
                                >
                                    <X className="w-4 h-4 text-white/60" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Фильтр кнопка только для экранов меньше 1024px */}
                <div className="lg:hidden pr-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-[42px] h-[42px] rounded-lg bg-white/5 hover:bg-white/10"
                    >
                        <Filter className="w-4 h-4 text-white[/60]" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Search
