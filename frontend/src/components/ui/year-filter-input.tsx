'use client'

import { FC, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

enum RANGE {
    MIN = 'min',
    MAX = 'max',
}

const YEARS: [number, number] = [1965, new Date().getFullYear()]
const DEFAULT_YEAR_START = YEARS[0].toString()
const DEFAULT_YEAR_END = YEARS[1].toString()

interface YearFilterInputProps {
    years: string[]
    setSelectingYears: (years: string[]) => void
    handleChangeParam: (name: string, value: string | string[] | boolean) => void
    range: RANGE
}

const YearFilterInput: FC<YearFilterInputProps> = ({
    years,
    setSelectingYears,
    handleChangeParam,
    range,
}) => {
    const [yearValue, setYearValue] = useState<string>(
        range === RANGE.MIN ? years[0] : years[1],
    )

    const changeYearsParams = (value: string[]) => {
        setSelectingYears(value)
        handleChangeParam('years', value)
    }

    const debouncedChangeYearsParams = (value: string[], delay: number = 400) => {
        setTimeout(() => {
            changeYearsParams(value)
        }, delay)
    }

    const resetYearIfInvalid = (yearValue: string, defaultYear: string, years: string[]) => {
        if (
            yearValue === '' ||
            Number(yearValue) < Number(DEFAULT_YEAR_START) ||
            Number(yearValue) > Number(DEFAULT_YEAR_END)
        ) {
            setYearValue(defaultYear)
            debouncedChangeYearsParams(
                range === RANGE.MIN ? [defaultYear, years[1]] : [years[0], defaultYear],
            )
        }
    }

    const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const digitsOnlyRegex = /^(?!0)\d+$/
        const isInRange =
            Number(value) >= Number(DEFAULT_YEAR_START) &&
            Number(value) <= Number(DEFAULT_YEAR_END)

        if (!digitsOnlyRegex.test(value)) {
            if (range === RANGE.MIN && !value) {
                debouncedChangeYearsParams([DEFAULT_YEAR_START, years[1]])
            }

            if (range === RANGE.MAX && !value) {
                debouncedChangeYearsParams([years[0], DEFAULT_YEAR_END])
            }

            return setYearValue('')
        }

        if (range === RANGE.MIN) {
            if (isInRange) {
                if (Number(value) > Number(years[1])) {
                    return debouncedChangeYearsParams([years[1], value])
                }

                debouncedChangeYearsParams([value, years[1]])
            }
        }

        if (range === RANGE.MAX) {
            if (isInRange) {
                if (Number(value) < Number(years[0])) {
                    return debouncedChangeYearsParams([value, years[0]])
                }

                debouncedChangeYearsParams([years[0], value])
            }
        }

        setYearValue(value)
    }

    useEffect(() => {
        setYearValue(range === RANGE.MIN ? years[0] : years[1])
    }, [years])

    return (
        <Input
            type="text"
            className={cn(
                "w-[72px] h-[35px] bg-white/5 border-white/5 text-white/60 text-center",
                "hover:bg-white/10 focus:bg-white/10 focus:text-white",
                "rounded-full text-[13px] font-medium"
            )}
            value={yearValue}
            onChange={handleYearChange}
            onBlur={() =>
                resetYearIfInvalid(
                    yearValue,
                    range === RANGE.MIN ? DEFAULT_YEAR_START : DEFAULT_YEAR_END,
                    years,
                )
            }
        />
    )
}

export default YearFilterInput
