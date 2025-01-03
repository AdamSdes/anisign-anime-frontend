'use client';

import React, { useState } from 'react';
import { Button } from "@/shared/shadcn-ui/button";
import { Crown, CheckCircle2 } from "lucide-react";

const ProBanner = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="container px-2 py-8">
      <div
        className="relative flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-[#CCBAE4]/20 bg-white/[0.02] p-8 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Spotlight effect */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(204,186,228,0.05), transparent 40%)`,
            opacity: isHovering ? 1 : 0,
          }}
        />

        {/* Left side - Text content */}
        <div className="flex-1 space-y-4 relative">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#CCBAE4]" />
            <h2 className="text-xl font-semibold">Получите AniSign Pro</h2>
          </div>
          <p className="text-white/70">
            Разблокируйте все возможности и получите максимум от просмотра аниме
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <CheckCircle2 className="w-4 h-4 text-[#CCBAE4]" />
              <span>Без рекламы</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <CheckCircle2 className="w-4 h-4 text-[#CCBAE4]" />
              <span>Ранний доступ к новым сериям</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <CheckCircle2 className="w-4 h-4 text-[#CCBAE4]" />
              <span>Эксклюзивные функции</span>
            </div>
          </div>
        </div>

        {/* Right side - CTA */}
        <div className="flex flex-col items-center gap-3 relative">
          <div className="text-center">
            <div className="text-2xl font-bold">299₽</div>
            <div className="text-sm text-white/40">в месяц</div>
          </div>
          <Button className="bg-[#CCBAE4] text-black hover:bg-[#CCBAE4]/90 px-8">
            Попробовать Pro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProBanner;
