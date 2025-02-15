'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { EmblaCarouselType } from 'embla-carousel-react'

type UsePrevNextButtonsType = {
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: () => boolean;
    canScrollNext: () => boolean;
    on: (eventName: string, callback: () => void) => EmblaCarouselType;
}

export const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined) => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return
        emblaApi.scrollPrev()
    }, [emblaApi])

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return
        emblaApi.scrollNext()
    }, [emblaApi])

    const onSelect = useCallback(() => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onSelect])

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    }
}

interface ButtonProps {
    children?: React.ReactNode;
    [key: string]: any;
}

export const PrevButton = (props: ButtonProps) => {
    const { children, ...restProps } = props
    return (
        <button 
            type="button" 
            {...restProps}
        >
            <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                    d="M12.5 15L7.5 10L12.5 5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
            </svg>
            {children}
        </button>
    )
}

export const NextButton = (props: ButtonProps) => {
    const { children, ...restProps } = props
    return (
        <button 
            type="button" 
            {...restProps}
        >
            <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                    d="M7.5 5L12.5 10L7.5 15" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
            </svg>
            {children}
        </button>
    )
}
