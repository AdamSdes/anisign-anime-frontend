"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ru } from 'date-fns/locale';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={ru}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-white/90", // Обновлено
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 hover:bg-white/5 text-white/80" // Обновлено
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-white/60 rounded-md w-9 font-normal text-[0.8rem]", // Обновлено
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-white/5",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-white/80 hover:text-white aria-selected:opacity-100" // Обновлено
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-white/10 text-white hover:bg-white/20 hover:text-white focus:bg-white/20 focus:text-white", // Обновлено
        day_today: "bg-white/5 text-white", // Обновлено
        day_outside: "text-white/40 opacity-50 aria-selected:bg-accent/50",
        day_disabled: "text-white/20", // Обновлено
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-white/80" />, // Обновлено
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-white/80" />, // Обновлено
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
