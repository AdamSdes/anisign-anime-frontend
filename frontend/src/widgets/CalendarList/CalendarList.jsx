'use client';
import React, {useEffect, useState} from 'react';
import {DateRangePicker} from "@nextui-org/date-picker";
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
                    <DateRangePicker
                        calendarProps={{
                            classNames: {
                                base: "bg-background",
                                headerWrapper: "pt-4 bg-background",
                                prevButton: "border-1 border-default-200 rounded-small",
                                nextButton: "border-1 border-default-200 rounded-small",
                                gridHeader: "bg-background shadow-none border-b-1 border-white",
                                cellButton: [
                                    "data-[today=true]:bg-default-100 data-[selected=true]:bg-transparent rounded-small",
                                    // start (pseudo)
                                    "data-[range-start=true]:before:rounded-l-small",
                                    "data-[selection-start=true]:before:rounded-l-small",
                                    // end (pseudo)
                                    "data-[range-end=true]:before:rounded-r-small",
                                    "data-[selection-end=true]:before:rounded-r-small",
                                    // start (selected)
                                    "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-small",
                                    // end (selected)
                                    "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-small",
                                ],
                            },
                        }}
                        className="max-w-xs"
                        label="Stay duration"
                        variant=""
                    />
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
