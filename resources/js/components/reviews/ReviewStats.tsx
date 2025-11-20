import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from './StarRating';
import { useTranslations } from '@/hooks/useTranslations';
import { Progress } from '@/components/ui/progress';

interface ReviewStatsProps {
    stats: {
        total: number;
        average: number;
        distribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    };
    className?: string;
}

export default function ReviewStats({ stats, className }: ReviewStatsProps) {
    const { t } = useTranslations();

    const getPercentage = (count: number): number => {
        if (stats.total === 0) return 0;
        return Math.round((count / stats.total) * 100);
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                    {t('reviews.rating_distribution', 'Rating Distribution')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold">{stats.average.toFixed(1)}</div>
                        <StarRating rating={Math.round(stats.average)} readonly size="sm" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm text-muted-foreground mb-1">
                            {t('reviews.average_rating', 'Average Rating')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {stats.total} {stats.total === 1 ? t('reviews.total_reviews', 'Total Review') : t('reviews.total_reviews', 'Total Reviews')}
                        </div>
                    </div>
                </div>

                {stats.total > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = stats.distribution[rating as keyof typeof stats.distribution];
                            const percentage = getPercentage(count);

                            return (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-20">
                                        <span className="text-sm font-medium w-4">{rating}</span>
                                        <StarRating rating={1} readonly size="sm" />
                                    </div>
                                    <Progress value={percentage} className="flex-1 h-2" />
                                    <span className="text-sm text-muted-foreground w-12 text-right">
                                        {percentage}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

