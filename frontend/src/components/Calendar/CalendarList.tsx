'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimeCard from '@/components/Calendar/AnimeCard';
import { motion } from 'framer-motion';

interface CalendarListProps {
    currentDate: Date;
    showMyAnime: boolean;
}

const CalendarList = ({ currentDate, showMyAnime }: CalendarListProps) => {
    const getDayName = (date: Date) => {
        return date.toLocaleDateString('ru-RU', { 
            weekday: 'long',
            day: 'numeric'
        });
    };

    const getDaysOfWeek = () => {
        const days = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            days.push({
                value: `day-${i}`,
                label: getDayName(date),
                date: date
            });
        }

        return days;
    };

    const days = getDaysOfWeek();

    return (
        <Tabs defaultValue={days[0].value} className="w-full">
            <TabsList className="w-full h-auto bg-white/[0.02] rounded-xl p-1 mb-6">
                <div className="grid grid-cols-7 gap-1 w-full">
                    {days.map(day => (
                        <TabsTrigger
                            key={day.value}
                            value={day.value}
                            className={`
                                flex flex-col gap-1 rounded-lg py-3 px-1
                                text-[14px] text-white/60 
                                data-[state=active]:text-white 
                                data-[state=active]:bg-white/5
                                ${day.date.toDateString() === new Date().toDateString() ? 'ring-1 ring-[#CCBAE4]/30' : ''}
                            `}
                        >
                            <span className="font-medium">{day.label.split(' ')[0]}</span>
                            <span className="text-sm opacity-60">{day.label.split(' ')[1]}</span>
                        </TabsTrigger>
                    ))}
                </div>
            </TabsList>

            {days.map(day => (
                <TabsContent 
                    key={day.value} 
                    value={day.value}
                    className="mt-0"
                >
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {/* TODO: Добавить реальные данные */}
                        {[1,2,3,4].map((_, index) => (
                            <AnimeCard
                                key={index}
                                id={index}
                                image="/mock/anime1.jpg"
                                rating="8.7"
                                title="Тестовое аниме"
                                episodeInfo="Серия 1"
                                timeInfo="12:00"
                                episodeTitle="Новая серия"
                            />
                        ))}
                    </motion.div>
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default CalendarList;
