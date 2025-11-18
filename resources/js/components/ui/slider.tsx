import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: number[]
    onValueChange: (value: number[]) => void
    onValueCommit?: (value: number[]) => void
    max?: number
    step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, onValueCommit, max = 100, step = 1, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = [parseFloat(e.target.value), value[1]]
            // Ensure min <= max
            if (newValue[0] > value[1]) {
                newValue[0] = value[1];
            }
            onValueChange(newValue)
        }

        const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = [value[0], parseFloat(e.target.value)]
            // Ensure max >= min
            if (newValue[1] < value[0]) {
                newValue[1] = value[0];
            }
            onValueChange(newValue)
        }

        return (
            <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
                <div className="relative w-full h-2 bg-secondary rounded-full">
                    <div
                        className="absolute h-full bg-primary rounded-full"
                        style={{
                            left: `${(value[0] / max) * 100}%`,
                            right: `${100 - (value[1] / max) * 100}%`
                        }}
                    />
                </div>
                {/* Invisible range inputs for interaction */}
                <input
                    type="range"
                    min={0}
                    max={max}
                    step={step}
                    value={value[0]}
                    onChange={handleChange}
                    onMouseUp={() => onValueCommit?.(value)}
                    onTouchEnd={() => onValueCommit?.(value)}
                    className="absolute w-full h-full opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4"
                    style={{ zIndex: 10 }}
                    {...props}
                />
                <input
                    type="range"
                    min={0}
                    max={max}
                    step={step}
                    value={value[1]}
                    onChange={handleMaxChange}
                    onMouseUp={() => onValueCommit?.(value)}
                    onTouchEnd={() => onValueCommit?.(value)}
                    className="absolute w-full h-full opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4"
                    style={{ zIndex: 11 }}
                />
                {/* Visible Thumbs */}
                <div
                    className="absolute h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 pointer-events-none"
                    style={{ left: `calc(${(value[0] / max) * 100}% - 10px)` }}
                />
                <div
                    className="absolute h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 pointer-events-none"
                    style={{ left: `calc(${(value[1] / max) * 100}% - 10px)` }}
                />
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
