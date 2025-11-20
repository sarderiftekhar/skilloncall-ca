import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ReviewForm from '@/components/reviews/ReviewForm';
import { useTranslations } from '@/hooks/useTranslations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'react-feather';

interface Application {
    id: number;
    job_id: number;
    status: string;
    job: {
        id: number;
        title: string;
        employer: {
            id: number;
            name: string;
        };
    };
    employee: {
        id: number;
        name: string;
        employeeProfile?: {
            first_name?: string;
            last_name?: string;
        };
    };
}

interface Reviewee {
    id: number;
    name: string;
    employeeProfile?: {
        first_name?: string;
        last_name?: string;
    };
}

interface PageProps {
    application: Application;
    reviewee: Reviewee;
    existingReview?: {
        id: number;
        rating: number;
        comment?: string;
    };
}

export default function EmployerReviewCreate({ application, reviewee, existingReview }: PageProps) {
    const { t } = useTranslations();
    const { flash } = usePage().props as any;

    const handleSubmit = (data: { rating: number; comment?: string }) => {
        if (existingReview) {
            router.put(`/employer/reviews/${existingReview.id}`, {
                rating: data.rating,
                comment: data.comment,
            });
        } else {
            router.post('/employer/reviews', {
                application_id: application.id,
                reviewee_id: reviewee.id,
                rating: data.rating,
                comment: data.comment,
            });
        }
    };

    const handleCancel = () => {
        router.visit(`/employer/applications/${application.id}`);
    };

    const revieweeName = reviewee.employeeProfile
        ? `${reviewee.employeeProfile.first_name || ''} ${reviewee.employeeProfile.last_name || ''}`.trim()
        : reviewee.name;

    return (
        <AppLayout>
            <Head title={t('reviews.create_review', 'Create Review')} />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('reviews.cancel', 'Back')}
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            {existingReview 
                                ? t('reviews.edit_review', 'Edit Review')
                                : t('reviews.review_employee', 'Review Employee')}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t('reviews.for_job', 'for job')}: {application.job.title}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                {t('reviews.leave_review', 'Leave a review')} {t('reviews.for_job', 'for')} <strong>{revieweeName}</strong>
                            </p>
                        </div>
                        <ReviewForm
                            applicationId={application.id}
                            revieweeId={reviewee.id}
                            existingReview={existingReview}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

