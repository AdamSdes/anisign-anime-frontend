'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { TooltipContent } from "@/components/ui/tooltip/TooltipContent";
import { TooltipTrigger } from "@/components/ui/tooltip/TooltipTrigger";
import { TooltipProvider } from "@/components/ui/tooltip/TooltipProvider"
import { useTranslations } from 'next-intl';

interface CharacterTooltipProps {
    id: string;
    name: string;
    imageUrl?: string;
  }
  
  export function CharacterTooltip({ id, name, imageUrl }: CharacterTooltipProps) {
    const t = useTranslations('common');
    const triggerRef = useRef<HTMLAnchorElement>(null); 
  
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/character/${id}`}
              ref={triggerRef} 
              className="text-[#CCBAE4] hover:underline cursor-pointer"
            >
              {name}
            </Link>
          </TooltipTrigger>
          <TooltipContent
            triggerRef={
                triggerRef as unknown as React.RefObject<HTMLDivElement> 
            }
            side="top"
            className="max-w-[300px] p-4"
            children={<div className="flex gap-4"><p>{t('character')}: {name}</p></div>}
          />
        </Tooltip>
      </TooltipProvider>
    );
  }