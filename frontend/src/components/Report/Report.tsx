'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { HiOutlineLightBulb } from 'react-icons/hi';

const Report = ({ className = '' }) => {
    return (
        <div className={`bg-[rgba(255,255,255,0.02)] ${className}`}>
            <div className="container mx-auto px-2 py-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <HiOutlineLightBulb className="w-5 h-5 text-white/80" />
                    <p className="text-[14px] opacity-80">
                        Сайт находится в бета-версии. Если вы нашли баг, пожалуйста, обратитесь в поддержку.
                    </p>
                </div>

                <Button
                    variant="ghost"
                    className="h-[50px] px-[25px] rounded-[12px] border border-white/5 hover:bg-[#262626]/80 text-white/60 hover:text-white transition-colors"
                >
                    Репорт
                </Button>
            </div>
        </div>
    );
}

export default Report;