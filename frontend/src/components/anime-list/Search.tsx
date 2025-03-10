// Search.tsx
"use client";

import React, { useCallback, useEffect } from "react";
import { atom, useAtom } from "jotai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { FilterSidebar } from "./FilterSidebar";
import { mergeClass } from "@/lib/utils/mergeClass";

export const searchQueryAtom = atom<string>("");

export const Search: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, [setSearchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, [setSearchQuery]);

  return (
    <div className="relative w-full">
      <div
        className={mergeClass(
          "relative flex items-center gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-xl transition-all duration-300",
          isFocused ? "bg-white/[0.03] border-white/10" : ""
        )}
      >
        <div className="flex-1 flex items-center gap-3 px-3">
          <SearchIcon className="w-5 h-5 text-[#555555]" />
          <Input
            type="text"
            value={searchQuery}
            placeholder="Поиск аниме..."
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="h-[50px] bg-transparent border-0 p-0 text-[15px] placeholder:text-white/40 focus-visible:ring-0"
          />
          <AnimatePresence>
            {searchQuery && (
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
            <SheetContent
              side="right"
              className="w-full sm:w-[540px] bg-[#060606]/95 backdrop-blur-xl border-white/5 p-6"
            >
              <SheetTitle className="text-lg font-medium text-white/90 mb-6">
                Фильтры
              </SheetTitle>
              <div className="h-full overflow-y-auto">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
});

Search.displayName = "Search";
export default Search;