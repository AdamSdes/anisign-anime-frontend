'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { mergeClass } from '@/lib/utils/mergeClass';
import { buttonVariants } from './button';
import { ru } from 'date-fns/locale';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Компонент календаря
 * @param props Пропсы календаря
 */
export const Calendar: React.FC<CalendarProps> = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) => {
  return (
    <DayPicker
      locale={ru}
      showOutsideDays={showOutsideDays}
      className={mergeClass('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium text-white/90',
        nav: 'space-x-1 flex items-center',
        nav_button: mergeClass(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 bg-transparent p-0 hover:bg-white/5 text-white/80'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-white/60 rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: mergeClass(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-white/5',
          'first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
        ),
        day: mergeClass(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal text-white/80 hover:text-white aria-selected:opacity-100'
        ),
        day_range_end: 'day-range-end',
        day_selected: 'bg-white/10 text-white hover:bg-white/20 hover:text-white focus:bg-white/20 focus:text-white',
        day_today: 'bg-white/5 text-white',
        day_outside: 'text-white/40 opacity-50 aria-selected:bg-accent/50',
        day_disabled: 'text-white/20',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4 text-white/80" />
          ) : (
            <ChevronRight className="h-4 w-4 text-white/80" />
          ),
      }}
      {...props}
    />
  );
};
Calendar.displayName = 'Calendar';
