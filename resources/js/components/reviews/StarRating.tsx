import React, { useState, useEffect } from 'react';
import { Star } from 'react-feather';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

export default function StarRating({
    rating,
    onRatingChange,
    readonly = false,
    size = 'md',
    showLabel = false,
    className,
}: StarRatingProps) {
    const { t, locale } = useTranslations();
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const starSize = sizeClasses[size];

    const handleClick = (value: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value: number) => {
        if (!readonly) {
            setHoveredRating(value);
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoveredRating(0);
            setIsHovering(false);
        }
    };

    const displayRating = isHovering ? hoveredRating : rating;

    const getRatingLabel = (value: number): string => {
        const labels: Record<number, string> = {
            1: t('reviews.one_star', 'Poor'),
            2: t('reviews.two_stars', 'Fair'),
            3: t('reviews.three_stars', 'Good'),
            4: t('reviews.four_stars', 'Very Good'),
            5: t('reviews.five_stars', 'Excellent'),
        };
        return labels[value] || '';
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div
                className={cn(
                    'flex items-center gap-0.5',
                    !readonly && 'cursor-pointer'
                )}
                role={readonly ? undefined : 'radiogroup'}
                aria-label={readonly ? `Rating: ${rating} ${rating === 1 ? t('reviews.star', 'star') : t('reviews.stars', 'stars')}` : 'Select rating'}
                onMouseLeave={handleMouseLeave}
            >
                {[1, 2, 3, 4, 5].map((value) => {
                    const isFilled = value <= displayRating;
                    const isActive = !readonly && value === hoveredRating;

                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleClick(value)}
                            onMouseEnter={() => handleMouseEnter(value)}
                            className={cn(
                                'transition-all duration-150',
                                !readonly && 'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded',
                                readonly && 'cursor-default'
                            )}
                            aria-label={`${value} ${value === 1 ? t('reviews.star', 'star') : t('reviews.stars', 'stars')}`}
                            aria-pressed={value === rating}
                            disabled={readonly}
                        >
                            <Star
                                className={cn(
                                    starSize,
                                    isFilled
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700',
                                    isActive && !readonly && 'fill-yellow-300 text-yellow-300',
                                    'transition-colors duration-150'
                                )}
                            />
                        </button>
                    );
                })}
            </div>
            {showLabel && rating > 0 && (
                <span className="text-sm text-muted-foreground">
                    {getRatingLabel(rating)}
                </span>
            )}
        </div>
    );
}

