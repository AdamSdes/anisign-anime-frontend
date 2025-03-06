"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps as SonnerProps } from "sonner";

// Расширенные пропсы компонента Toaster
interface ExtendedToasterProps extends SonnerProps {
  expandByDefault?: boolean; 
}

/**
 * Компонент для отображения уведомлений
 * @param props Пропсы уведомлений
 */
export const Toaster = ({ ...props }: ExtendedToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ExtendedToasterProps["theme"]}
      className="toaster group"
      expandByDefault
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group flex items-center gap-3 w-full p-4 mb-2 rounded-xl border border-white/5 bg-[#060606]/95 backdrop-blur-xl shadow-lg",
          title: "text-[14px] font-medium text-white/90",
          description: "text-[13px] text-white/60",
          actionButton:
            "px-3 py-1.5 rounded-lg bg-[#CCBAE4] text-black text-[12px] font-medium hover:bg-[#CCBAE4]/90 transition-colors",
          cancelButton:
            "px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-[12px] font-medium hover:bg-white/10 transition-colors",
          closeButton:
            "rounded-full p-1 hover:bg-white/5 transition-colors text-white/40 hover:text-white/60",
          success: "!bg-[#86EFAC]/10 !border-[#86EFAC]/20",
          error: "!bg-[#FDA4AF]/10 !border-[#FDA4AF]/20",
          warning: "!bg-[#FCD34D]/10 !border-[#FCD34D]/20",
          info: "!bg-[#93C5FD]/10 !border-[#93C5FD]/20",
          loader: "text-white/40",
        },
        duration: 4000,
      }}
      {...props}
    />
  );
};