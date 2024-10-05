"use client";
import React, {useState} from "react";
import {Slider} from "@nextui-org/slider";
import {Chip} from "@nextui-org/chip";

const FilterSidebar = () => {

    const [years, setYears] = React.useState([1965, 2024]);
    const [inputValues, setInputValues] = React.useState([1965, 2024]);

    const handleSliderChange = (newValue) => {
        setYears(newValue);
        setInputValues(newValue);
    };

    const handleInputChange = (index, value) => {
        if (value.length > 4) return;

        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);

        const newYears = [...years];
        const parsedValue = Number(value);

        if (!isNaN(parsedValue) && parsedValue >= 1965 && parsedValue <= 2024) {
            newYears[index] = parsedValue;
            if (newYears[0] <= newYears[1]) {
                setYears(newYears);
            }
        }
    };

    return (
        <aside className="hidden lg:block  space-y-6 sticky top-20">
            <div className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-6 rounded-[14px]">
                <h3 className="font-semibold mb-5 w-full">Сортировать по</h3>

                {/* Используем flexbox и flex-wrap для адаптации элементов */}
                <div className="flex flex-wrap gap-2 ">
                    <div className="flex items-center px-[15px] h-[39px] font-medium rounded-[34px] cursor-pointer hover:opacity-60 transition-all duration-300 ease-in-out bg-[#CCBAE4] text-black border">
                        Дате</div>
                    <div className="flex items-center px-[15px] h-[39px] font-medium rounded-[34px] cursor-pointer hover:opacity-60 transition-all duration-300 ease-in-out bg-[rgba(255,255,255,0.02)]  text-[rgba(255,255,255,0.6)] border">
                        Рейтингу</div>
                    <div className="flex items-center px-[15px] h-[39px] font-medium rounded-[34px] cursor-pointer hover:opacity-60 transition-all duration-300 ease-in-out bg-[rgba(255,255,255,0.02)]  text-[rgba(255,255,255,0.6)] border">
                        Названию</div>
                    <div className="flex items-center px-[15px] h-[39px] font-medium rounded-[34px] cursor-pointer hover:opacity-60 transition-all duration-300 ease-in-out bg-[rgba(255,255,255,0.02)]  text-[rgba(255,255,255,0.6)] border">
                        Просмотрам</div>

                </div>
            </div>


            <div className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-6 rounded-[14px]">
                <h3 className="font-semibold mb-5">Год выхода</h3>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-white gap-4">

                        <input
                            type="text"
                            value={inputValues[0]}
                            maxLength="4" //
                            onChange={(e) => handleInputChange(0, e.target.value)}
                            className="w-[70px] px-2 py-2 bg-[rgba(255,255,255,0.02)] border border-white/5 text-center text-white/80 outline-none rounded-[40px] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300 focus:bg-[rgba(255,255,255,0.05)]"
                        />

                        <div className="px-3 py-3 bg-none border w-full min-w-[80px] rounded-[40px]">
                            <Slider
                                className=""
                                showTooltip={true}
                                thumbClassName="thumb"
                                trackClassName="track"
                                defaultValue={years}
                                maxValue={2024}
                                minValue={1965}
                                value={years}
                                onChange={handleSliderChange}
                                ariaLabel={['Lower thumb', 'Upper thumb']}
                                ariaValuetext={state => `Year ${state.valueNow}`}
                                step={1}
                                minDistance={1}
                                renderTrack={(props, state) => (<div
                                    {...props}
                                    className={`track ${state.index === 1 ? 'filled-track' : 'empty-track'}`}
                                />)}
                            />
                        </div>

                        <input
                            type="text"
                            value={inputValues[1]}
                            maxLength="4" //
                            onChange={(e) => handleInputChange(1, e.target.value)}
                            className="w-[70px] px-2 py-2 bg-[rgba(255,255,255,0.02)] border border-white/5 text-center text-white/80 outline-none rounded-[40px] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300 focus:bg-[rgba(255,255,255,0.05)]"
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
