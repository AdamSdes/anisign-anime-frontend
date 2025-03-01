'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input/Input';
import { Button } from '@/components/ui/button/Button';
import { Search as SearchIcon, X, Filter } from '@/shared/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useDebounce } from '@/lib/utils/useDebounce';
import { useTranslations } from 'next-intl';
import { FilterSidebar } from '@/components/ui/anime-list-filter/FilterSidebar';

export default function SearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [inputValue, setInputValue] = useState(searchParams.get('search') ?? '');
    const [isFocused, setIsFocused] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const t = useTranslations('common');
    const debouncedSearch = useDebounce(inputValue, 500);
    
    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        params.set('page', '1');
        return params.toString();
    }, [searchParams]);
    useEffect(() => {
        const handleSearch = () => {
            const query = createQueryString('search', debouncedSearch);
            router.replace(`${pathname}?${query}`);
        };
        handleSearch();
    }, [debouncedSearch, pathname, router, createQueryString]);
    const clearSearch = () => {
        setInputValue('');
        const params = new URLSearchParams(searchParams);
        params.delete('search');
        params.set('page', '1');
        router.replace(`${pathname}?${params.toString()}`);
    };
    return (
        <div className="relative w-full max-w-2xl">
            <div className={`
                relative flex items-center gap-2 p-1.5
                bg-white/[0.02] border border-white/5 rounded-xl
                transition-all duration-300
                ${isFocused ? 'bg-white/[0.03] border-white/10' : ''}
            `}>
                <div className="flex-1 flex items-center gap-3 px-3">
                    <SearchIcon className="w-5 h-6 text-[#555555]" />
                    <Input 
                        type="text"
                        value={inputValue}
                        placeholder={t('searchPlaceHolder')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="h-[50px] bg-transparent border-0 p-0 text-[15px] placeholder:text-white/40 focus-visible:ring-0"
                    />
                    <AnimatePresence>
                        {inputValue && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8}}
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
                <div className="lg:hidden pr-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-[42px] h-[42px] rounded-lg bg-white/5 hover:bg-white/10"
                            >
                                <Filter className="w-4 h-4 text-white/60" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:w-[540px] bg-[#060606]/95 backdrop-blur-xl border-white/5 p-6">
                            <h3 className="text-lg font-medium text-white/90 mb-6">
                                {t('filters')}
                            </h3>
                            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white-10 scrollbar-track-transparent">
                                <FilterSidebar />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}