'use client';
import React from 'react';

import {ASwitch} from "@/shared/anisign-ui/Switch";
import Calendar from "@/widgets/Calendar/Calendar";

const CalendarList = () => {


    return (
        <main className="mb-[40px]">

            <div className="container mx-auto px-2 py-5">
                <div className="flex justify-between items-center mt-5 flex-wrap gap-5">
                    <div
                        className="flex items-center    gap-10 bg-[rgba(255,255,255,0.02)] rounded-[12px] py-[20px] px-[20px]">
                        <p className="text-white/80">Мои аниме</p>
                        <ASwitch/>
                    </div>

        
                </div>
                <div className="w-full h-[1px] bg-white/5 mt-5"></div>

                <div className="mt-5">
                    <div className="flex items-center gap-2">
                        <p className='font-semibold text-[16px]'>Понедельник</p>
                        <span className='font-medium text-white/60 text-[14px]'>/ 18.08.2024</span>
                    </div>
                    <Calendar/>
                </div>

            </div>

        </main>
    );
};

export default CalendarList;
