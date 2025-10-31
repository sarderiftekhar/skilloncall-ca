import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    MapPin,
    Clock,
    DollarSign,
    Briefcase,
    Bookmark,
    ChevronLeft,
    ChevronRight,
    Lock,
} from 'react-feather';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { SharedData } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';

interface Job {
    id: number;
    title: string;
    employer?: {
        id: number;
        name: string;
    };
    location: string;
    budget: number;
    job_type: string;
    experience_level: string;
    required_skills?: string[];
    description: string;
    published_at: string;
    applications_count?: number;
    views_count?: number;
    status: string;
    category?: string;
}

interface PaginatedJobs {
    data: Job[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
}

interface SavedJobsProps {
    jobs: PaginatedJobs;
}

// Loading Skeleton Components
const SavedJobCardSkeleton = () => (
    <Card className="hover:shadow-md transition-shadow animate-pulse">
        <CardContent className="p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                {/* Job Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className="h-5 lg:h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 lg:w-4 lg:h-4 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-3 lg:h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 lg:w-4 lg:h-4 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-3 lg:h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 lg:w-4 lg:h-4 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-3 lg:h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                    </div>

                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>

                    <div className="flex items-center gap-4">
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto flex-shrink-0">
                    <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const HeaderSkeleton = () => (
    <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <div className="h-8 lg:h-9 bg-gray-300 rounded w-40 lg:w-48 mb-2 animate-pulse"></div>
                <div className="h-4 lg:h-5 bg-gray-200 rounded w-64 lg:w-80 animate-pulse"></div>
            </div>
            <div className="text-right">
                <div className="h-8 lg:h-9 bg-gray-300 rounded w-12 mb-1 animate-pulse"></div>
                <div className="h-3 lg:h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
        </div>
    </div>
);

export default function SavedJobs({ jobs: initialJobs }: SavedJobsProps) {
    const { subscription } = usePage<SharedData>().props;
    const { t } = useTranslations();
    
    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Loading timer similar to dashboard
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
            // Quick content reveal
            setTimeout(() => setShowContent(true), 50);
        }, 800);

        return () => clearTimeout(loadingTimer);
    }, []);

    // Check if user is on free tier (no subscription or Basic plan)
    const isFreeTier = !subscription || subscription.plan_name === 'Basic' || !subscription.plan_name;

    // Function to mask company name for free tier users
    const getMaskedCompanyName = (companyName: string) => {
        if (!isFreeTier) return companyName;
        if (companyName.length <= 5) return companyName;
        return companyName.substring(0, 5) + '•••••';
    };

    // Function to handle apply button click
    const handleApplyClick = (jobId: number) => {
        if (isFreeTier) {
            return;
        }
        console.log('Applying to job:', jobId);
    };

    // Function to remove job from saved jobs
    const handleUnsaveJob = (jobId: number) => {
        router.delete(`/worker/jobs/${jobId}/unsave`, {
            preserveScroll: true,
        });
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            if (diffInHours === 0) {
                const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                return `${diffInMinutes} ${t('minutes_ago')}`;
            }
            return `${diffInHours} ${t('hours_ago')}`;
        } else if (diffInDays === 1) {
            return t('yesterday');
        } else {
            return `${diffInDays} ${t('days_ago')}`;
        }
    };

    return (
        <AppLayout>
            <Head title={t('nav.saved_jobs')} />
            
            <div className="flex-1 min-w-0 max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className={`transition-all duration-400 ease-out ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                    {isLoading ? (
                        <HeaderSkeleton />
                    ) : (
                        <div className="mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#10B3D6' }}>
                                        {t('nav.saved_jobs')}
                                    </h1>
                                    <p className="text-sm lg:text-base text-gray-600">
                                        {t('your_bookmarked_jobs')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl lg:text-3xl font-bold" style={{ color: '#192341' }}>{initialJobs.total || 0}</div>
                                    <p className="text-xs lg:text-sm text-gray-600">{t('saved_jobs_count')}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Notices */}
                <div className={`transition-all duration-400 ease-out ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                    {isLoading ? (
                        <>
                            <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 lg:p-4 mb-6 animate-pulse">
                                <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                            </div>
                            {isFreeTier && (
                                <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 lg:p-4 mb-6 animate-pulse">
                                    <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Info Notice */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 lg:p-4 mb-6 text-xs lg:text-sm" style={{ borderColor: '#10B3D6' }}>
                                <p className="text-gray-700">
                                    <strong style={{ color: '#10B3D6' }}>💾 {t('saved_jobs_info')}</strong> {t('saved_jobs_description')}
                                </p>
                            </div>

                            {/* Free Tier Restriction Notice */}
                            {isFreeTier && (
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-3 lg:p-4 mb-4 shadow-md relative overflow-hidden">
                                    {/* Background accent */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                                    
                                    <div className="flex items-center gap-3">
                                        {/* Warning Icon */}
                                        <div className="flex-shrink-0 w-6 h-6 lg:w-7 lg:h-7 bg-amber-100 rounded-full flex items-center justify-center">
                                            <span className="text-amber-600 text-sm lg:text-base font-bold">⚠️</span>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-amber-900 font-bold text-sm mb-1">
                                                        {t('free_plan_limitations')}
                                                    </h3>
                                                    <p className="text-amber-800 text-xs lg:text-sm leading-snug">
                                                        {t('free_plan_description')}
                                                    </p>
                                                </div>
                                                
                                                {/* Upgrade Button */}
                                                <a 
                                                    href="/subscriptions" 
                                                    className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-3 lg:px-4 py-1.5 lg:py-2 rounded-md transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer text-xs lg:text-sm whitespace-nowrap"
                                                >
                                                    <span>{t('upgrade_to_pro')}</span>
                                                    <span className="hidden sm:inline opacity-90">{t('upgrade_message')}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Jobs List */}
                <div className={`transition-all duration-400 ease-out ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                    {isLoading ? (
                        <div className="space-y-3 lg:space-y-4 pb-8">
                            <SavedJobCardSkeleton />
                            <SavedJobCardSkeleton />
                            <SavedJobCardSkeleton />
                            <SavedJobCardSkeleton />
                        </div>
                    ) : (
                        <div className="space-y-3 lg:space-y-4 pb-8">
                            {initialJobs.data.length > 0 ? (
                                initialJobs.data.map((job, index) => (
                            <div key={job.id} className={`animate-[fadeInUp_0.4s_ease-out_${0.1 + index * 0.05}s_both]`}>
                                <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                                <CardContent className="p-4 lg:p-5">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                                        {/* Job Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <h3 className="text-base lg:text-lg font-semibold" style={{ color: '#192341' }}>
                                                    {job.title}
                                                </h3>
                                            </div>
                                            <p className="text-xs lg:text-sm text-gray-600 mb-3">
                                                {getMaskedCompanyName(job.employer?.name || t('company'))}
                                            </p>

                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 mb-3">
                                                <div className="flex items-center gap-2 text-xs lg:text-sm">
                                                    <MapPin className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" style={{ color: '#10B3D6' }} />
                                                    <span className="text-gray-700 truncate">{job.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs lg:text-sm">
                                                    <DollarSign className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" style={{ color: '#10B3D6' }} />
                                                    <span className="text-gray-700 font-semibold">
                                                        ${job.budget ? Math.round(Number(job.budget)) : '0'}{t('per_hour')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs lg:text-sm">
                                                    <Clock className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" style={{ color: '#10B3D6' }} />
                                                    <span className="text-gray-700 capitalize">{job.job_type?.replace('_', ' ')}</span>
                                                </div>
                                            </div>

                                            <p className="text-xs lg:text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>

                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>{job.applications_count || 0} {t('interested')}</span>
                                                <span>{getTimeAgo(job.published_at)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex sm:flex-col gap-2 w-full sm:w-auto flex-shrink-0">
                                            {isFreeTier ? (
                                                <div className="flex-1 sm:flex-none">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                disabled
                                                                className="text-white text-xs px-4 lg:px-6 w-full opacity-60 cursor-not-allowed"
                                                                style={{ backgroundColor: '#10B3D6' }}
                                                            >
                                                                <Lock className="w-3 h-3 mr-1" />
                                                                {t('apply')}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {t('please_subscribe_to_apply')}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <p className="text-xs text-gray-500 text-center mt-1 sm:hidden">
                                                        {t('please_subscribe_to_apply')}
                                                    </p>
                                                </div>
                                            ) : (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApplyClick(job.id)}
                                                            className="text-white text-xs px-4 lg:px-6 flex-1 sm:flex-none cursor-pointer hover:scale-[1.02] transition-all duration-200"
                                                            style={{ backgroundColor: '#10B3D6' }}
                                                        >
                                                            {t('apply')}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {t('please_subscribe_to_apply')}
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleUnsaveJob(job.id)}
                                                className="text-xs flex-1 sm:flex-none cursor-pointer text-red-500 hover:text-red-700 hover:border-red-300 hover:scale-[1.02] transition-all duration-200"
                                            >
                                                <Bookmark 
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="p-8 lg:p-12 text-center">
                                <Bookmark className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-base lg:text-lg font-semibold text-gray-600 mb-2">{t('no_saved_jobs')}</h3>
                                <p className="text-sm text-gray-500 mb-4">{t('no_saved_jobs_description')}</p>
                                <Button
                                    onClick={() => router.get('/worker/jobs')}
                                    className="cursor-pointer text-white hover:scale-[1.02] transition-all duration-200"
                                    style={{ backgroundColor: '#10B3D6' }}
                                >
                                    {t('browse_jobs')}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && initialJobs.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 bg-white rounded-lg mb-6">
                        <div className="text-sm text-gray-600">
                            {t('showing')} {initialJobs.from} {t('to')} {initialJobs.to} {t('of')} {initialJobs.total} {t('saved_jobs_count')}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.get(`/worker/saved-jobs?page=${initialJobs.current_page - 1}`)}
                                disabled={initialJobs.current_page === 1}
                                className="cursor-pointer hover:scale-[1.02] transition-all duration-200 disabled:hover:scale-100"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            
                            <span className="px-3 py-1 text-sm text-gray-600">
                                {initialJobs.current_page} {t('of')} {initialJobs.last_page}
                            </span>
                            
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.get(`/worker/saved-jobs?page=${initialJobs.current_page + 1}`)}
                                disabled={initialJobs.current_page === initialJobs.last_page}
                                className="cursor-pointer hover:scale-[1.02] transition-all duration-200 disabled:hover:scale-100"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
