import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewStats from '@/components/reviews/ReviewStats';
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

interface PageProps {
    reviews: Review[];
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
    filters?: {
        type?: string;
        rating?: number;
        from_date?: string;
        to_date?: string;
    };
}

export default function EmployerReviewsIndex({ reviews, stats, filters }: PageProps) {
    const { t } = useTranslations();

    return (
        <AppLayout>
            <Head title={t('reviews.my_reviews', 'My Reviews')} />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        {t('reviews.my_reviews', 'My Reviews')}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t('reviews.title', 'Reviews')} {t('reviews.from_employees', 'from employees')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <ReviewStats stats={stats} />
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg md:text-xl">
                                    {t('reviews.title', 'Reviews')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ReviewList reviews={reviews} showJob={true} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

