import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';
import { useTranslations } from '@/hooks/useTranslations';
import { format } from 'date-fns';
import { enUS, frCA } from 'date-fns/locale';

interface ReviewCardProps {
    review: {
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
    };
    showJob?: boolean;
}

export default function ReviewCard({ review, showJob = true }: ReviewCardProps) {
    const { t, locale } = useTranslations();
    const dateLocale = locale === 'fr' ? frCA : enUS;

    const reviewerName = review.reviewer.employerProfile?.business_name 
        || review.reviewer.employeeProfile 
            ? `${review.reviewer.employeeProfile?.first_name || ''} ${review.reviewer.employeeProfile?.last_name || ''}`.trim()
            : review.reviewer.name;

    const reviewerInitials = reviewerName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const profilePhoto = review.reviewer.employeeProfile?.profile_photo;

    const formattedDate = format(new Date(review.created_at), 'PPP', { locale: dateLocale });

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            {profilePhoto ? (
                                <AvatarImage 
                                    src={profilePhoto.startsWith('http') ? profilePhoto : `/storage/${profilePhoto}`} 
                                    alt={reviewerName}
                                />
                            ) : null}
                            <AvatarFallback className="text-xs">
                                {reviewerInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{reviewerName}</span>
                            <span className="text-xs text-muted-foreground">
                                {t('reviews.written_by', 'Written by')} {reviewerName} {t('reviews.on', 'on')} {formattedDate}
                            </span>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {review.type === 'employer_to_employee' 
                            ? t('reviews.from_employers', 'From Employers')
                            : t('reviews.from_employees', 'From Employees')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <StarRating rating={review.rating} readonly size="sm" />
                {review.comment && (
                    <p className="text-sm text-foreground leading-relaxed">
                        {review.comment}
                    </p>
                )}
                {showJob && review.job && (
                    <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                            {t('reviews.for_job', 'for job')}: <span className="font-medium">{review.job.title}</span>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

