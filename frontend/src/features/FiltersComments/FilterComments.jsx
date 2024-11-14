'use client'
import {Switch} from "@/shared/shadcn-ui/switch";
import React from "react";
import {ASwitch} from "@/shared/anisign-ui/Switch";

const FilterComments = () => {
    return (
        <div className="container mx-auto px-2 mt-[30px] flex gap-5 overflow-x-auto">
            <div className="flex w-full flex-col gap-[30px]">
                <div className="flex items-center justify-between">
                        <div
                            className="flex items-center gap-10 bg-[rgba(255,255,255,0.02)] rounded-[12px] py-[20px] px-[20px]">
                            <p className="text-white/80">Мои коментарии</p>
                            <ASwitch/>
                        </div>
                </div>
                <div className="w-full h-[1px] mb-[30px] bg-white/5"></div>
            </div>
        </div>
    );
}

export default FilterComments;