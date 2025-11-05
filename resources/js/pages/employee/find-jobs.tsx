import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    MapPin,
    Clock,
    DollarSign,
    Briefcase,
    Bookmark,
    Search,
    ChevronDown,
    ChevronUp,
    Star,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Lock,
} from 'react-feather';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useMemo, useEffect } from 'react';
import * as employeeJobsRoute from '@/routes/employee/jobs';
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
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface FindJobsProps {
    jobs: PaginatedJobs;
    filters?: {
        search?: string;
        professions?: string[];
        shifts?: string[];
        experience?: string[];
        min_rate?: number;
        max_rate?: number;
    };
    savedJobIds?: number[];
    allProfessions?: string[];
}

// Extract unique professions from job titles
const extractProfessions = (jobs: Job[]) => {
    const professions = new Set<string>();
    jobs.forEach(job => {
        const titleParts = job.title.toLowerCase().split(/[\s-/]+/);
        titleParts.forEach(part => {
            if (part.length > 2 && !['the', 'for', 'and', 'or', 'a', 'an'].includes(part)) {
                professions.add(part.charAt(0).toUpperCase() + part.slice(1));
            }
        });
    });
    return Array.from(professions).sort();
};

export default function FindJobs({ jobs: initialJobs, filters: initialFilters = {}, savedJobIds = [], allProfessions = [] }: FindJobsProps) {
    const { subscription } = usePage<SharedData>().props;
    const { t } = useTranslations();
    
    const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
    const [professionSearch, setProfessionSearch] = useState('');
    const [selectedProfessions, setSelectedProfessions] = useState<string[]>(initialFilters.professions || []);
    const [selectedShifts, setSelectedShifts] = useState<string[]>(initialFilters.shifts || []);
    const [selectedExperience, setSelectedExperience] = useState<string[]>(initialFilters.experience || []);
    const [minRate, setMinRate] = useState<number>(initialFilters.min_rate || 16);
    const [maxRate, setMaxRate] = useState<number>(initialFilters.max_rate || 100);
    const [savedJobs, setSavedJobs] = useState<number[]>(savedJobIds);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    
    const [expandedFilters, setExpandedFilters] = useState({
        profession: true,
        shift: true,
        experience: true,
        rate: true,
    });

    // Check if user is on free tier (no subscription or Basic plan)
    const isFreeTier = !subscription || subscription.plan_name === 'Basic' || !subscription.plan_name;

    // Function to mask company name for free tier users
    const getMaskedCompanyName = (companyName: string) => {
        if (!isFreeTier) return companyName;
        if (companyName.length <= 2) return '•••••';
        // Hide first 2 letters, show next 5 characters, then hide the rest
        const remaining = companyName.substring(2);
        const visible = remaining.substring(0, 5);
        return '••' + visible + '•••••';
    };

    // Function to handle apply button click
    const handleApplyClick = (jobId: number) => {
        if (isFreeTier) {
            // Don't perform any action for free tier users
            return;
        }
        // TODO: Implement actual apply functionality for paid users
        console.log('Applying to job:', jobId);
    };

    // Use professions from backend (always complete list)
    const filteredProfessions = professionSearch.length > 0 
        ? allProfessions.filter(p => p.toLowerCase().includes(professionSearch.toLowerCase()))
        : allProfessions;

    // Handle filter changes
    const applyFilters = () => {
        router.get(employeeJobsRoute.index.url(), {
            search: searchQuery || undefined,
            professions: selectedProfessions.length > 0 ? selectedProfessions : undefined,
            shifts: selectedShifts.length > 0 ? selectedShifts : undefined,
            experience: selectedExperience.length > 0 ? selectedExperience : undefined,
            min_rate: minRate !== 16 ? minRate : undefined,
            max_rate: maxRate !== 100 ? maxRate : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleFilterChange = () => {
        applyFilters();
    };

    const handlePageChange = (page: number) => {
        router.get(employeeJobsRoute.index.url(), {
            page,
            search: searchQuery || undefined,
            professions: selectedProfessions.length > 0 ? selectedProfessions : undefined,
            shifts: selectedShifts.length > 0 ? selectedShifts : undefined,
            experience: selectedExperience.length > 0 ? selectedExperience : undefined,
            min_rate: minRate !== 16 ? minRate : undefined,
            max_rate: maxRate !== 100 ? maxRate : undefined,
        }, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const toggleSaveJob = (jobId: number) => {
        const isSaved = savedJobs.includes(jobId);
        
        // Optimistically update UI
        setSavedJobs(prev => 
            isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId]
        );

        // Make API call to persist the change
        if (isSaved) {
            // Unsave the job
            router.delete(`/employee/jobs/${jobId}/unsave`, {
                preserveScroll: true,
                onError: () => {
                    // Revert on error
                    setSavedJobs(prev => [...prev, jobId]);
                }
            });
        } else {
            // Save the job
            router.post(`/employee/jobs/${jobId}/save`, {}, {
                preserveScroll: true,
                onError: () => {
                    // Revert on error
                    setSavedJobs(prev => prev.filter(id => id !== jobId));
                }
            });
        }
    };

    const toggleFilter = (filterKey: keyof typeof expandedFilters) => {
        setExpandedFilters(prev => ({
            ...prev,
            [filterKey]: !prev[filterKey],
        }));
    };

    const toggleMultiFilter = (value: string, currentList: string[], setter: (val: string[]) => void) => {
        if (currentList.includes(value)) {
            setter(currentList.filter(v => v !== value));
        } else {
            setter([...currentList, value]);
        }
        // Apply filters after a short delay to allow state update
        setTimeout(() => applyFilters(), 100);
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const published = new Date(date);
        const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const days = Math.floor(diffInHours / 24);
        if (days < 7) return `${days}d ago`;
        const weeks = Math.floor(days / 7);
        return `${weeks}w ago`;
    };

    return (
        <AppLayout>
            <Head title="Find Jobs" />

            {/* Mobile-First Responsive Layout */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-7xl mx-auto pt-16 px-4 lg:px-0">
                
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800">{t('filters')}</h2>
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="p-2 rounded-lg border border-gray-200"
                    >
                        {mobileFiltersOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Sidebar Filters */}
                <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block lg:w-72 flex-shrink-0 mb-6 lg:mb-0`}>
                    <div className="bg-white rounded-lg shadow-sm p-5 lg:p-6 space-y-5 lg:space-y-6 lg:sticky lg:top-20">
                        
                        {/* Reset Button */}
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedProfessions([]);
                                    setSelectedShifts([]);
                                    setSelectedExperience([]);
                                    setMinRate(16);
                                    setMaxRate(100);
                                    setProfessionSearch('');
                                    router.get(employeeJobsRoute.index.url());
                                }}
                                className="text-xs cursor-pointer"
                                disabled={!searchQuery && selectedProfessions.length === 0 && selectedShifts.length === 0 && selectedExperience.length === 0 && minRate === 16 && maxRate === 100}
                            >
                                Reset Filters
                            </Button>
                        </div>
                        
                        {/* Search */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">{t('search')}</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder={t('search_placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-10 text-sm"
                                />
                            </div>
                        </div>

                        {/* Profession Filter with Search */}
                        <div>
                            <button
                                onClick={() => toggleFilter('profession')}
                                className="flex items-center justify-between w-full mb-3"
                            >
                                <label className="text-sm font-semibold text-gray-700">Profession</label>
                                {expandedFilters.profession ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {expandedFilters.profession && (
                                <div className="space-y-3">
                                    {/* Profession Search */}
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search professions..."
                                            value={professionSearch}
                                            onChange={(e) => setProfessionSearch(e.target.value)}
                                            className="pl-7 h-9 text-xs"
                                        />
                                    </div>
                                    
                                    {/* Professions List */}
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {filteredProfessions.length > 0 ? (
                                            filteredProfessions.map(prof => (
                                                <label key={prof} className="flex items-center gap-2 cursor-pointer text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProfessions.includes(prof)}
                                                        onChange={() => toggleMultiFilter(prof, selectedProfessions, setSelectedProfessions)}
                                                        className="w-4 h-4 rounded"
                                                    />
                                                    <span className="text-gray-700">{prof}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500">No professions found</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Shift Pattern Filter */}
                        <div>
                            <button
                                onClick={() => toggleFilter('shift')}
                                className="flex items-center justify-between w-full mb-3"
                            >
                                <label className="text-sm font-semibold text-gray-700">Shift</label>
                                {expandedFilters.shift ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {expandedFilters.shift && (
                                <div className="space-y-2 text-sm">
                                    {['morning', 'evening', 'night', 'flexible'].map(shift => (
                                        <label key={shift} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedShifts.includes(shift)}
                                                onChange={() => toggleMultiFilter(shift, selectedShifts, setSelectedShifts)}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700 capitalize">{shift}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Experience Level Filter */}
                        <div>
                            <button
                                onClick={() => toggleFilter('experience')}
                                className="flex items-center justify-between w-full mb-3"
                            >
                                <label className="text-sm font-semibold text-gray-700">Experience</label>
                                {expandedFilters.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {expandedFilters.experience && (
                                <div className="space-y-2 text-sm">
                                    {['entry', 'intermediate', 'expert'].map(level => (
                                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedExperience.includes(level)}
                                                onChange={() => toggleMultiFilter(level, selectedExperience, setSelectedExperience)}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700 capitalize">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Hourly Rate Filter */}
                        <div>
                            <button
                                onClick={() => toggleFilter('rate')}
                                className="flex items-center justify-between w-full mb-3"
                            >
                                <label className="text-sm font-semibold text-gray-700">Hourly Rate</label>
                                {expandedFilters.rate ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {expandedFilters.rate && (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-xs text-gray-600">Min</label>
                                            <span className="text-xs font-semibold">${minRate}/hr</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="16"
                                            max="100"
                                            value={minRate}
                                            onChange={(e) => {
                                                setMinRate(Number(e.target.value));
                                                setTimeout(() => applyFilters(), 300);
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-xs text-gray-600">Max</label>
                                            <span className="text-xs font-semibold">${maxRate}/hr</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="16"
                                            max="100"
                                            value={maxRate}
                                            onChange={(e) => {
                                                setMaxRate(Number(e.target.value));
                                                setTimeout(() => applyFilters(), 300);
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Clear Filters */}
                        {(searchQuery || selectedProfessions.length || selectedShifts.length || selectedExperience.length) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedProfessions([]);
                                    setSelectedShifts([]);
                                    setSelectedExperience([]);
                                    setMinRate(16);
                                    setMaxRate(100);
                                    setProfessionSearch('');
                                    router.get(employeeJobsRoute.index.url());
                                }}
                                className="w-full text-xs cursor-pointer"
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#10B3D6' }}>{t('browse_jobs')}</h1>
                                <p className="text-sm lg:text-base text-gray-600">{t('discover_opportunities')}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl lg:text-3xl font-bold" style={{ color: '#192341' }}>{initialJobs.total}</div>
                                <p className="text-xs lg:text-sm text-gray-600">{t('jobs_found')}</p>
                            </div>
                        </div>
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

                    {/* Jobs List */}
                    <div className="space-y-3 lg:space-y-4 pb-8">
                        {initialJobs.data.length > 0 ? (
                            initialJobs.data.map(job => (
                                <Card key={job.id} className="hover:shadow-md transition-shadow">
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
                                                className="text-white text-xs px-4 lg:px-6 flex-1 sm:flex-none cursor-pointer"
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
                                                    onClick={() => toggleSaveJob(job.id)}
                                                    className={`text-xs flex-1 sm:flex-none cursor-pointer`}
                                                    style={savedJobs.includes(job.id) ? { color: '#192341' } : {}}
                                                >
                                                    <Bookmark 
                                                        className="w-4 h-4"
                                                        fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-8 lg:p-12 text-center">
                                    <Briefcase className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-base lg:text-lg font-semibold text-gray-600 mb-2">{t('no_jobs_found')}</h3>
                                    <p className="text-sm text-gray-500">{t('try_adjusting_filters')}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Pagination */}
                    {initialJobs.last_page > 1 && (
                        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 bg-white rounded-lg mb-6">
                            <div className="text-sm text-gray-600">
                                {t('showing')} {initialJobs.from} {t('to')} {initialJobs.to} {t('of')} {initialJobs.total} {t('jobs_found')}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={initialJobs.current_page === 1}
                                    onClick={() => handlePageChange(initialJobs.current_page - 1)}
                                    className="cursor-pointer"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(initialJobs.last_page, 5) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Button
                                                key={page}
                                                variant={initialJobs.current_page === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className="cursor-pointer w-8 h-8 p-0"
                                                style={initialJobs.current_page === page ? {backgroundColor: '#10B3D6', color: 'white'} : {}}
                                            >
                                                {page}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={initialJobs.current_page === initialJobs.last_page}
                                    onClick={() => handlePageChange(initialJobs.current_page + 1)}
                                    className="cursor-pointer"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
