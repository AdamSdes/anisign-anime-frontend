"use client"

import Activity from './icons/Activity'
import Time from './icons/Time'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useLazyGetUserByUsernameQuery } from '@/features/auth/authApiSlice'
import { useEffect, useState } from 'react'

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
  const BAR_HEIGHT = 40;

  return (
    <div className="flex flex-col gap-[30px]">
      <h1 className="text-[19px] font-semibold">Статистика</h1>

      <div className="min-[1400px]:grid flex max-[1250px]:flex-col grid-cols-2 gap-[30px]">
        <div className="min-[1250px]:w-[430px] p-[17px] flex flex-col gap-[16px] bg-[#FFFFFF05] border-[1px] border-[#FFFFFF0D] rounded-[8px]">
          <div className="flex items-center align-center gap-[8px]">
            <Activity />
            <h3 className="text-[#B9B9B9] text-[14px] font-medium">
              Активность
            </h3>
          </div>

          <div className="w-full max-[1250px]:justify-between h-[40px] flex min-[450px]:gap-[21px]">
            {activity.map((item, index) => (
              <div
                key={index}
                className="w-[8px] h-full bg-[#27272A4D] rounded-full relative"
              >
                <div
                  className="w-full bg-[#FFFFFF0D] rounded-full absolute bottom-0"
                  style={{ height: `${(item / 100) * BAR_HEIGHT}px` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="min-[1250px]:w-[430px] p-[17px] flex flex-col gap-[16px] bg-[#FFFFFF05] border-[1px] border-[#FFFFFF0D] rounded-[8px]">
          <div className="flex items-center align-center gap-[8px]">
            <Time />
            <h3 className="text-[#B9B9B9] text-[14px] font-medium">
              Время с момента регистрации
            </h3>
          </div>

          <div className="flex items-center justify-center h-[40px] text-lg font-medium">
            {isLoading ? (
              'Загрузка...'
            ) : isError ? (
              'Ошибка получения данных'
            ) : !userData?.created_at ? (
              'Нет данных'
            ) : (
              timeFromRegistration
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
