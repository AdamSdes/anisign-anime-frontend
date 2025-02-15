'use client';
import { useEffect, useState } from 'react';
import Header from "@/components/Header/Header";
import Report from "@/components/Report/Report";
import Footer from "@/components/Footer/Footer";
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from 'framer-motion';
import CalendarList from '@/components/Calendar/CalendarList';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';

export default function CalendarPage() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMyAnime, setShowMyAnime] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 7);
            return newDate;
        });
    };

    const handleNextWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 7);
            return newDate;
        });
    };

    const formatDateRange = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const formatDate = (date: Date) => {
            return date.toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'long'
            });
        };

        return `${formatDate(startOfWeek)} — ${formatDate(endOfWeek)}`;
    };

    return (
        <main className="flex min-h-screen flex-col">
            <Header />
            <Report />
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    {/* Header Section */}
                    <motion.div 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5">
                                <CalendarDays className="w-5 h-5 text-white/60" />
                            </div>
                            <h1 className="text-xl font-semibold text-white/90">Календарь выхода серий</h1>
                        </div>
                        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
                            <label className="text-[14px] text-white/60 cursor-pointer select-none" htmlFor="my-anime-switch">
                                Показывать только мои аниме
                            </label>
                            <Switch
                                id="my-anime-switch"
                                checked={showMyAnime}
                                onCheckedChange={setShowMyAnime}
                                className="data-[state=checked]:bg-[#CCBAE4] data-[state=unchecked]:bg-white/10"
                            />
                        </div>
                    </motion.div>

                    {/* Date Navigation */}
                    <motion.div 
                        className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevWeek}
                            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex-shrink-0"
                        >
                            <ChevronLeft className="h-5 w-5 text-white/60" />
                        </Button>
                        
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex-1 h-10 justify-center font-normal text-white/90 hover:text-white/90 hover:bg-white/5 transition-colors"
                                >
                                    <span className="text-[15px]">{formatDateRange()}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-[#060606] border-white/5">
                                <Calendar
                                    mode="single"
                                    selected={currentDate}
                                    onSelect={(date) => date && setCurrentDate(date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNextWeek}
                            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex-shrink-0"
                        >
                            <ChevronRight className="h-5 w-5 text-white/60" />
                        </Button>
                    </motion.div>

                    {/* Calendar Content */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-white/10 border-t-white/60 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <CalendarList currentDate={currentDate} showMyAnime={showMyAnime} />
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
