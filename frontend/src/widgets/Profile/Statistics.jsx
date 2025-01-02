"use client"
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useLazyGetUserByUsernameQuery } from '@/features/auth/authApiSlice'
import { useEffect, useState } from 'react'
import { Activity, Clock, Trophy, Heart } from "lucide-react"

const Statistics = () => {
  const username = useSelector(selectCurrentUser);
  const [getUserByUsername, { data: userData, isLoading, isError }] = useLazyGetUserByUsernameQuery();
  const [timeFromRegistration, setTimeFromRegistration] = useState('');

  useEffect(() => {
    if (username) {
      getUserByUsername(username);
    }
  }, [username, getUserByUsername]);

  useEffect(() => {
    if (userData?.created_at) {
      const updateTime = () => {
        const registrationDate = new Date(userData.created_at);
        const now = new Date();
        const diff = now - registrationDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        let timeString = '';
        if (days > 0) timeString += `${days}д `;
        if (hours > 0) timeString += `${hours}ч `;
        timeString += `${minutes}м`;

        setTimeFromRegistration(timeString);
      };

      updateTime();
      const timer = setInterval(updateTime, 60000); // Обновляем каждую минуту

      return () => clearInterval(timer);
    }
  }, [userData?.created_at]);

  const activity = [100, 40, 80, 70, 20, 50, 10, 50, 100, 20, 35, 20, 20, 20];
  const BAR_HEIGHT = 25;

  const stats = [
    { icon: Trophy, label: 'Просмотрено', value: '42 аниме' },
    { icon: Heart, label: 'В избранном', value: '15 аниме' },
    { icon: Clock, label: 'На сайте', value: timeFromRegistration || 'Загрузка...' },
  ];

  // Добавим данные для подписей дней
  const getDayLabels = () => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.getDate());
    }
    return days;
  };

  const dayLabels = getDayLabels();

  return (
    <div className="w-full">
      <h2 className="text-[18px] lg:text-[20px] mb-8 font-bold">Статистика</h2>
        
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-4">
        {/* График активности */}
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[14px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="h-5 w-5 text-white/60" />
            <h3 className="text-[16px] font-semibold">Активность за 2 недели</h3>
          </div>
            
          <div className="space-y-3">
            <div className="w-full h-[180px] flex gap-2">
              {activity.map((item, index) => {
                const heightPercentage = (item / 100) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 h-full flex flex-col justify-end relative group"
                  >
                    {/* Тултип */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                      {item} действий
                    </div>
                    {/* Контейнер для столбца */}
                    <div className="w-full h-full relative">
                      {/* Фоновый элемент */}
                      <div className="absolute bottom-0 left-0 w-full h-full bg-[#CCBAE4]/10 rounded-full" />
                      {/* Активный столбец */}
                      <div
                        className="absolute bottom-0 left-0 w-full bg-[#CCBAE4] transition-all duration-300 rounded-full group-hover:opacity-80"
                        style={{ height: `${heightPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Подписи дней */}
            <div className="flex gap-2">
              {dayLabels.map((day, index) => (
                <div key={index} className="flex-1 text-center">
                  <span className="text-[10px] text-white/40">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[14px] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[rgba(255,255,255,0.02)]">
                  <stat.icon className="h-5 w-5 text-white/60" />
                </div>
                <div>
                  <p className="text-[14px] text-white/60">{stat.label}</p>
                  <p className="text-[16px] font-semibold mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
