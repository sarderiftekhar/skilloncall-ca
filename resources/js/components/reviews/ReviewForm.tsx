import React, { useState, FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import StarRating from './StarRating';
import { useTranslations } from '@/hooks/useTranslations';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
    applicationId: number;
    revieweeId: number;
    existingReview?: {
        id: number;
        rating: number;
        comment?: string;
    };
    onSubmit: (data: { rating: number; comment?: string }) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export default function ReviewForm({
    applicationId,
    revieweeId,
    existingReview,
    onSubmit,
    onCancel,
    isLoading = false,
}: ReviewFormProps) {
    const { t } = useTranslations();
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        application_id: applicationId,
        reviewee_id: revieweeId,
        rating: rating,
        comment: comment,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (rating === 0) {
            return;
        }

        onSubmit({
            rating,
            comment: comment.trim() || undefined,
        });
    };

    const maxCommentLength = 1000;
    const remainingChars = maxCommentLength - comment.length;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                    {existingReview 
                        ? t('reviews.edit_review', 'Edit Review')
                        : t('reviews.create_review', 'Create Review')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="rating" className="text-base">
                            {t('reviews.rating', 'Rating')} <span className="text-destructive">*</span>
                        </Label>
                        <StarRating
                            rating={rating}
                            onRatingChange={setRating}
                            showLabel
                            size="lg"
                        />
                        {errors.rating && (
                            <InputError message={errors.rating} className="mt-1" />
                        )}
                        {rating === 0 && (
                            <p className="text-sm text-destructive mt-1">
                                {t('reviews.rating_required', 'Please select a rating.')}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">
                            {t('reviews.comment_optional', 'Comment (optional)')}
                        </Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={t('reviews.comment_placeholder', 'Share your experience...')}
                            rows={5}
                            maxLength={maxCommentLength}
                            className="resize-none"
                        />
                        <div className="flex justify-between items-center">
                            <div>
                                {errors.comment && (
                                    <InputError message={errors.comment} className="mt-1" />
                                )}
                            </div>
                            <span className={cn(
                                "text-xs text-muted-foreground",
                                remainingChars < 50 && "text-warning"
                            )}>
                                {remainingChars} {t('reviews.character_count', 'characters')} {t('reviews.max_characters', 'remaining')}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={processing || isLoading}
                            >
                                {t('reviews.cancel', 'Cancel')}
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={processing || isLoading || rating === 0}
                            className="cursor-pointer"
                        >
                            {processing || isLoading
                                ? t('reviews.submit_review', 'Submitting...')
                                : existingReview
                                    ? t('reviews.update_review', 'Update Review')
                                    : t('reviews.submit_review', 'Submit Review')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

