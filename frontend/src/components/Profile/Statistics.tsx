"use client";

import React from "react";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import {
  Activity,
  Trophy,
  Heart,
  Clock,
  Eye,
} from "lucide-react";
import { axiosInstance } from "@/lib/axios/axiosConfig";

/**
 * Атом для состояния аутентификации
 * @type {Atom<{ isAuthenticated: boolean; user: { username: string; ... } | null }>}
 */
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс данных статистики
 * @interface StatisticsData
 */
interface StatisticsData {
  activity: number[]; 
  stats: {
    watched: { value: string; detail?: string };
    favorites: { value: string; detail?: string };
    timeOnSite: { value: string; detail?: string };
  };
  dayLabels: number[]; 
}

/**
 * Компонент статистики профиля
 * @description Отображает график активности и основные статистические данные пользователя
 * @returns {JSX.Element}
 */
export const Statistics: React.FC = React.memo(() => {
  const [auth] = useAtom(authAtom);

  // Загрузка данных статистики через SWR
  const { data: statsData, error, isLoading } = useSWR<StatisticsData>(
    auth.user ? `/api/profile/${auth.user.username}/stats` : null,
    (url) => axiosInstance.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-7 w-32 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,373px] gap-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <div className="h-6 w-48 bg-white/5 rounded animate-pulse mb-6" />
            <div className="h-[180px] bg-white/5 rounded animate-pulse" />
          </div>
          <div className="hidden lg:block w-[1px] bg-white/5 my-2" />
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-20 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return <div className="text-red-500">Ошибка загрузки статистики</div>;
  }

  const activity = statsData.activity || [100, 40, 80, 70, 20, 50, 10, 50, 100, 20, 35, 20, 20, 20];
  const stats = statsData.stats || {
    watched: { value: "42 аниме" },
    favorites: { value: "15 аниме" },
    timeOnSite: { value: "5д 12ч 30м" },
  };
  const dayLabels = statsData.dayLabels || (() => {
    const days = [];
    const date = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(date);
      d.setDate(date.getDate() - i);
      days.push(d.getDate());
    }
    return days;
  })();

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
          {[
            { icon: Trophy, label: "Просмотрено", ...stats.watched },
            { icon: Heart, label: "В избранном", ...stats.favorites },
            { icon: Clock, label: "На сайте", ...stats.timeOnSite },
          ].map((stat, index) => (
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
                    {stat.detail && (
                      <div className="text-[12px] text-white/40 mb-1">{stat.detail}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

Statistics.displayName = "Statistics";
export default Statistics;