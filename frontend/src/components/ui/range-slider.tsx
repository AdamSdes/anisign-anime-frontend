'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface RangeSliderProps {
    min: number
    max: number
    value: [number, number]
    onChange: (value: [number, number]) => void
    className?: string
}

const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    value,
    onChange,
    className = ''
}) => {
    const [isDragging, setIsDragging] = useState<null | 'min' | 'max'>(null)
    const trackRef = useRef<HTMLDivElement>(null)

    const getPercentage = useCallback(
        (value: number) => ((value - min) / (max - min)) * 100,
        [min, max]
    )

    const getValueFromPosition = useCallback(
        (position: number) => {
            if (!trackRef.current) return 0
            const trackRect = trackRef.current.getBoundingClientRect()
            const percent = (position - trackRect.left) / trackRect.width
            const value = percent * (max - min) + min
            return Math.round(Math.max(min, Math.min(max, value)))
        },
        [min, max]
    )

    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            if (!isDragging) return

            const newValue = getValueFromPosition(event.clientX)
            const [minValue, maxValue] = value

            if (isDragging === 'min') {
                onChange([Math.min(newValue, maxValue - 1), maxValue])
            } else {
                onChange([minValue, Math.max(newValue, minValue + 1)])
            }
        },
        [isDragging, onChange, value, getValueFromPosition]
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(null)
    }, [])

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    const [minPercent, maxPercent] = [
        getPercentage(value[0]),
        getPercentage(value[1])
    ]

    return (
        <div className={`relative w-full h-1 my-8 ${className}`} ref={trackRef}>
            {/* Track background */}
            <div className="absolute w-full h-full rounded-full bg-white/5" />

            {/* Active track */}
            <div
                className="absolute h-full rounded-full bg-[#CCBAE4]"
                style={{
                    left: `${minPercent}%`,
                    width: `${maxPercent - minPercent}%`
                }}
            />

            {/* Min thumb */}
            <button
                type="button"
                className="absolute w-6 h-6 -ml-3 -mt-2.5 flex items-center justify-center 
                          focus:outline-none cursor-grab active:cursor-grabbing"
                style={{ left: `${minPercent}%` }}
                onMouseDown={() => setIsDragging('min')}
                onClick={(e) => e.preventDefault()}
            >
                <span className="absolute w-6 h-6 rounded-full bg-[#CCBAE4]" />
                <span 
                    className="absolute w-3 h-3 rounded-full bg-black transition-transform duration-150"
                    style={{
                        transform: isDragging === 'min' ? 'scale(0.6)' : 'scale(1)'
                    }}
                />
            </button>

            {/* Max thumb */}
            <button
                type="button"
                className="absolute w-6 h-6 -ml-3 -mt-2.5 flex items-center justify-center 
                          focus:outline-none cursor-grab active:cursor-grabbing"
                style={{ left: `${maxPercent}%` }}
                onMouseDown={() => setIsDragging('max')}
                onClick={(e) => e.preventDefault()}
            >
                <span className="absolute w-6 h-6 rounded-full bg-[#CCBAE4]" />
                <span 
                    className="absolute w-3 h-3 rounded-full bg-black transition-transform duration-150"
                    style={{
                        transform: isDragging === 'max' ? 'scale(0.6)' : 'scale(1)'
                    }}
                />
            </button>
        </div>
    )
}

export default RangeSlider
