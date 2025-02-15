"use client"
import { useEffect, useState } from 'react'
import { Activity, Clock, Trophy, Heart, Star, Eye } from "lucide-react"

const Statistics = () => {
  // Используем моковые данные вместо Redux
  const mockTimeOnSite = "5д 12ч 30м";
  const activity = [100, 40, 80, 70, 20, 50, 10, 50, 100, 20, 35, 20, 20, 20];

  const stats = [
    { icon: Trophy, label: 'Просмотрено', value: '42 аниме' },
    { icon: Heart, label: 'В избранном', value: '15 аниме' },
    { icon: Clock, label: 'На сайте', value: mockTimeOnSite },
  ];

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
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-[18px] lg:text-[20px] font-bold">Статистика</h2>
      </div>
        
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,373px] gap-6">
        {/* График активности */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-white/60" />
              <h3 className="text-[16px] font-medium text-white/90">Активность за 2 недели</h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/[0.04] text-[12px] text-white/60">
              Всего действий: {activity.reduce((a, b) => a + b, 0)}
            </div>
          </div>
            
          <div className="space-y-3">
            <div className="w-full h-[180px] flex gap-2">
              {activity.map((item, index) => (
                <div
                  key={index}
                  className="flex-1 h-full flex flex-col justify-end relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-[#060606] border border-white/5 backdrop-blur-xl px-2.5 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap">
                      <Eye className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-[12px] text-white/90">{item} действий</span>
                    </div>
                  </div>
                  <div className="w-full h-full relative">
                    <div className="absolute bottom-0 left-0 w-full h-full bg-white/[0.02] rounded-full" />
                    <div
                      className="absolute bottom-0 left-0 w-full bg-white/20 transition-all duration-300 rounded-full group-hover:opacity-80"
                      style={{ height: `${(item / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {dayLabels.map((day, index) => (
                <div key={index} className="flex-1 text-center">
                  <span className="text-[10px] text-white/40">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Разделитель */}
        <div className="hidden lg:block w-[1px] bg-white/5 my-2" />

        {/* Карточки статистики */}
        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors">
                  <stat.icon className="h-5 w-5 text-white/60" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] text-white/60 mb-1">{stat.label}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-[18px] font-semibold text-white/90">{stat.value}</p>
                    <div className="text-[12px] text-white/40 mb-1">
                      {index === 0 && '• 42 часа просмотра'}
                      {index === 1 && '• 3 новых за неделю'}
                      {index === 2 && '• активный пользователь'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
