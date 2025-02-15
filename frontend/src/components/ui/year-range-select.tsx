'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"

interface YearRangeSelectProps {
    className?: string
    startYear?: number
    endYear?: number
    onChange?: (startYear: number | undefined, endYear: number | undefined) => void
}

export function YearRangeSelect({ className, startYear, endYear, onChange }: YearRangeSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [years, setYears] = React.useState<[number, number]>([startYear || 1980, endYear || new Date().getFullYear()])
    const minYear = 1980
    const maxYear = new Date().getFullYear()

    const handleChange = (values: number[]) => {
        setYears([values[0], values[1]])
    }

    const handleApply = () => {
        onChange?.(years[0], years[1])
        setOpen(false)
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        setYears([minYear, maxYear])
        onChange?.(undefined, undefined)
    }

    const formatYearRange = () => {
        if (!startYear && !endYear) return 'Выберите года'
        if (startYear === endYear) return `${startYear}`
        return `${startYear || minYear} - ${endYear || maxYear}`
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full h-full items-center py-4 rounded-[14px] justify-between",
                        "bg-white/[0.02] border-white/5 hover:bg-white/[0.03]",
                        "text-white/60 hover:text-white",
                        className
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0 text-white/40" />
                        <span>{formatYearRange()}</span>
                    </div>
                    {(startYear || endYear) && (
                        <div
                            role="button"
                            tabIndex={0}
                            className="h-4 w-4 p-0 hover:bg-transparent text-white/40 hover:text-white/60 cursor-pointer"
                            onClick={handleClear}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleClear(e as any)
                                }
                            }}
                        >
                            ✕
                        </div>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-full p-4 bg-[#0A0A0A] border border-white/5 shadow-xl" 
                align="start"
                sideOffset={5}
            >
                <div className="space-y-4">
                    <div className="flex justify-between text-sm text-white/60">
                        <span>{years[0]}</span>
                        <span>{years[1]}</span>
                    </div>
                    <Slider
                        min={minYear}
                        max={maxYear}
                        step={1}
                        value={[years[0], years[1]]}
                        onValueChange={handleChange}
                        className="[&_[role=slider]]:bg-[#CCBAE4] [&_[role=slider]]:border-[#CCBAE4]"
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={handleApply}
                            className="bg-[#CCBAE4] text-black hover:bg-[#CCBAE4]/90"
                        >
                            Применить
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
