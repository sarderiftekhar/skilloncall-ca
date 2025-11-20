import React from 'react';
import ReviewCard from './ReviewCard';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';

interface Review {
    id: number;
    rating: number;
    comment?: string;
    created_at: string;
    reviewer: {
        id: number;
        name: string;
        employeeProfile?: {
            profile_photo?: string;
            first_name?: string;
            last_name?: string;
        };
        employerProfile?: {
            business_name?: string;
        };
    };
    job?: {
        id: number;
        title: string;
    };
    type: 'employer_to_employee' | 'employee_to_employer';
}

interface ReviewListProps {
    reviews: Review[];
    showJob?: boolean;
    emptyMessage?: string;
}

export default function ReviewList({ reviews, showJob = true, emptyMessage }: ReviewListProps) {
    const { t } = useTranslations();

    if (reviews.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                        {emptyMessage || t('reviews.no_reviews_message', 'This user has not received any reviews yet.')}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} showJob={showJob} />
            ))}
        </div>
    );
}

