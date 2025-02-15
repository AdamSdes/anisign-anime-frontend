'use client';
import React, { useState } from 'react';
import Header from "@/components/Header/Header";
import Report from "@/components/Report/Report";
import Footer from "@/components/Footer/Footer";
import { MessageCircle, Clock, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import CommentsList from '@/components/Comments/CommentsList';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CommentsPage() {
    const [sortBy, setSortBy] = useState('newest');
    const [filterType, setFilterType] = useState('all');

    return (
        <main className="flex min-h-screen flex-col">
            <Header />
            <Report />
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <motion.div 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5">
                                <MessageCircle className="w-5 h-5 text-white/60" />
                            </div>
                            <h1 className="text-xl font-semibold text-white/90">Комментарии</h1>
                        </div>

                        {/* Обновленные фильтры */}
                        <div className="flex items-center gap-3">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-[50px] pl-4 pr-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-white/40" />
                                        <SelectValue placeholder="Сортировка" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-[#060606]/95 backdrop-blur-xl border-white/5">
                                    <SelectGroup className="p-1">
                                        <SelectItem 
                                            value="newest" 
                                            className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                                        >
                                            Сначала новые
                                        </SelectItem>
                                        <SelectItem 
                                            value="oldest"
                                            className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                                        >
                                            Сначала старые
                                        </SelectItem>
                                        <SelectItem 
                                            value="popular"
                                            className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                                        >
                                            По популярности
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="h-[50px] pl-4 pr-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center gap-3">
                                        <Filter className="w-4 h-4 text-white/40" />
                                        <SelectValue placeholder="Фильтр" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-[#060606]/95 backdrop-blur-xl border-white/5">
                                    <SelectGroup className="p-1">
                                        <SelectItem 
                                            value="all"
                                            className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                                        >
                                            Все комментарии
                                        </SelectItem>
                                        <SelectItem 
                                            value="my"
                                            className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                                        >
                                            Мои комментарии
                                        </SelectItem>
                                        <SelectItem 
                                            value="answered"
                                            className="rounded-lg text-[14px] text-white/60 data-[highlighted]:text-white data-[highlighted]:bg-white/5"
                                        >
                                            С ответами
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>

                    {/* Comments List */}
                    <CommentsList sortBy={sortBy} filterType={filterType} />
                </div>
            </div>

            <Footer />
        </main>
    );
}
