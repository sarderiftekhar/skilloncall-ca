import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Search,
    MapPin,
    Star,
    Clock,
    Filter,
    Briefcase,
    CheckCircle,
    X
} from 'react-feather';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { type BreadcrumbItem, type PaginationLinks } from '@/types';

interface Skill {
    id: number;
    name: string;
}

interface Province {
    code: string;
    name: string;
}

interface Worker {
    id: number;
    name: string;
    email: string;
    employee_profile: {
        bio: string;
        hourly_rate_min: number;
        city: string;
        province: string;
        overall_experience: string;
        profile_photo: string | null;
        skills: Array<{
            id: number;
            name: string;
            pivot: {
                proficiency_level: string;
            }
        }>;
        reviews: Array<{
            rating: number;
        }>;
    };
}

interface WorkersResponse {
    data: Worker[];
    links: PaginationLinks[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    path: string;
    first_page_url: string | null;
    last_page_url: string | null;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    workers?: WorkersResponse;
    filters: {
        search?: string;
        skills?: string[];
        location?: string;
        min_rate?: number;
        max_rate?: number;
        availability?: string;
        rating?: string;
    };
    skills?: Skill[];
    provinces?: Province[];
}

// Worker Card Skeleton Component
const WorkerCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
    <Card 
        className="bg-white rounded-xl shadow-sm animate-pulse" 
        style={{ 
            borderTop: '0.5px solid #192341',
            animationDelay: `${delay}ms`,
            opacity: 0,
            animation: `fadeInUp 0.6s ease-out ${delay}ms forwards`
        }}
    >
        <CardHeader className="flex flex-row items-start gap-4 pb-2">
            <Skeleton className="rounded-full" style={{width: '60px', height: '60px'}} />
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
            </div>
        </CardHeader>
        <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
        </CardContent>
        <CardFooter className="pt-0">
            <Skeleton className="h-10 w-full rounded-md" />
        </CardFooter>
    </Card>
);

export default function WorkerIndex({ workers, filters, skills, provinces }: Props) {
    const { t, locale } = useTranslations();
    const { component } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [selectedSkills, setSelectedSkills] = useState<string[]>(filters.skills || []);
    const [location, setLocation] = useState(filters.location || '');
    const [rateRange, setRateRange] = useState([filters.min_rate || 0, filters.max_rate || 100]);
    const [availability, setAvailability] = useState(filters.availability || 'all');
    const [isLoading, setIsLoading] = useState(false);

    // Provide default values for optional props
    const workersData: WorkersResponse = workers && workers.total !== undefined ? workers : {
        data: [],
        links: [],
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0,
        total: 0,
        per_page: 12,
        path: '',
        first_page_url: null,
        last_page_url: null,
        next_page_url: null,
        prev_page_url: null,
    };
    
    // Ensure all required properties exist
    if (!workersData.data) {
        workersData.data = [];
    }
    if (!workersData.links) {
        workersData.links = [];
    }
    if (workersData.total === undefined) {
        workersData.total = 0;
    }
    if (workersData.current_page === undefined) {
        workersData.current_page = 1;
    }
    if (workersData.last_page === undefined) {
        workersData.last_page = 1;
    }
    if (workersData.from === undefined) {
        workersData.from = 0;
    }
    if (workersData.to === undefined) {
        workersData.to = 0;
    }
    
    const skillsList: Skill[] = skills || [];
    const provincesList: Province[] = provinces || [];

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                handleSearch();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset loading state when component receives new data
    useEffect(() => {
        if (workers && workers.total !== undefined) {
            setIsLoading(false);
        }
    }, [workers]);

    const handleSearch = () => {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedSkills.length > 0) params.set('skills', selectedSkills.join(','));
        if (location) params.set('location', location);
        if (rateRange[0] > 0) params.set('min_rate', rateRange[0].toString());
        if (rateRange[1] < 100) params.set('max_rate', rateRange[1].toString());
        if (availability !== 'all') params.set('availability', availability);
        params.set('lang', locale);
        
        router.get(`/employer/employees?${params.toString()}`, {}, { 
            preserveState: true, 
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const clearFilters = () => {
        setIsLoading(true);
        setSearch('');
        setSelectedSkills([]);
        setLocation('');
        setRateRange([0, 100]);
        setAvailability('all');
        router.get(`/employer/employees?lang=${locale}`, {}, {
            onFinish: () => setIsLoading(false)
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('employer.title', 'Employer Dashboard'),
            href: `/employer/dashboard?lang=${locale}`,
        },
        {
            title: t('employer.find_workers', 'Find Workers'),
            href: `/employer/employees?lang=${locale}`,
        },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employer.find_workers', 'Find Workers')}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer, 
                    [onclick], [onClick], select, input[type="button"],
                    input[type="submit"], input[type="reset"] { 
                        cursor: pointer !important; 
                    }
                    
                    .page-title {
                        color: #192341 !important;
                    }
                    
                    .text-default {
                        color: #192341 !important;
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    
                    .worker-card {
                        animation: fadeInUp 0.6s ease-out forwards;
                        opacity: 0;
                    }
                    
                    .worker-card:nth-child(1) { animation-delay: 0ms; }
                    .worker-card:nth-child(2) { animation-delay: 100ms; }
                    .worker-card:nth-child(3) { animation-delay: 200ms; }
                    .worker-card:nth-child(4) { animation-delay: 300ms; }
                    .worker-card:nth-child(5) { animation-delay: 400ms; }
                    .worker-card:nth-child(6) { animation-delay: 500ms; }
                    .worker-card:nth-child(7) { animation-delay: 600ms; }
                    .worker-card:nth-child(8) { animation-delay: 700ms; }
                    .worker-card:nth-child(9) { animation-delay: 800ms; }
                    .worker-card:nth-child(10) { animation-delay: 900ms; }
                    .worker-card:nth-child(11) { animation-delay: 1000ms; }
                    .worker-card:nth-child(12) { animation-delay: 1100ms; }
                `}</style>
            </Head>

            <div className="w-full px-6 py-8" style={{ backgroundColor: '#F6FBFD' }}>
                <div className="flex h-full flex-1 flex-col gap-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight page-title">
                            {t('employer.find_workers', 'Find Workers')}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {t('employer.find_workers_subtitle', 'Search and filter workers to find the perfect match for your job')}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <div className="w-full lg:w-80 flex-shrink-0">
                            <Card className="bg-white rounded-xl shadow-sm sticky top-4" style={{ borderTop: '0.5px solid #192341' }}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold flex items-center page-title">
                                            <Filter className="w-5 h-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('common.filters', 'Filters')}
                                        </h2>
                            {(search || selectedSkills.length > 0 || location || availability !== 'all') && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                    {t('common.clear', 'Clear')}
                                </Button>
                            )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Location Filter */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium" style={{color: '#192341'}}>{t('common.location', 'Location')}</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder={t('common.city_or_province', 'City or Province')}
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                onBlur={handleSearch}
                                                className="pl-9 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Hourly Rate Filter */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-sm font-medium" style={{color: '#192341'}}>{t('common.hourly_rate', 'Hourly Rate')}</Label>
                                            <span className="text-xs text-gray-500">
                                                ${rateRange[0]} - ${rateRange[1]}/hr
                                            </span>
                                        </div>
                                        <Slider
                                            value={rateRange}
                                            max={200}
                                            step={5}
                                            onValueChange={setRateRange}
                                            onValueCommit={() => {
                                                setIsLoading(true);
                                                handleSearch();
                                            }}
                                            className="py-4"
                                        />
                                    </div>

                                    {/* Availability Filter */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium" style={{color: '#192341'}}>{t('common.availability', 'Availability')}</Label>
                                        <Select value={availability} onValueChange={(val) => {
                                            setAvailability(val);
                                            setIsLoading(true);
                                            // Need to trigger search manually since Select doesn't have onBlur like Input
                                            setTimeout(() => {
                                                const params = new URLSearchParams();
                                                if (search) params.set('search', search);
                                                if (selectedSkills.length > 0) params.set('skills', selectedSkills.join(','));
                                                if (location) params.set('location', location);
                                                if (rateRange[0] > 0) params.set('min_rate', rateRange[0].toString());
                                                if (rateRange[1] < 100) params.set('max_rate', rateRange[1].toString());
                                                if (val !== 'all') params.set('availability', val);
                                                params.set('lang', locale);
                                                router.get(`/employer/employees?${params.toString()}`, {}, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    onFinish: () => setIsLoading(false)
                                                });
                                            }, 0);
                                        }}>
                                            <SelectTrigger className="cursor-pointer">
                                                <SelectValue placeholder={t('common.select_availability', 'Select availability')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all" className="cursor-pointer">{t('common.any_availability', 'Any Availability')}</SelectItem>
                                                <SelectItem value="available" className="cursor-pointer">{t('common.available_now', 'Available Now')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Skills Filter */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium" style={{color: '#192341'}}>{t('common.skills', 'Skills')}</Label>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                            {skillsList.map((skill) => (
                                                <div key={skill.id} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`skill-${skill.id}`}
                                                        checked={selectedSkills.includes(String(skill.id))}
                                                        onChange={(e) => {
                                                            const newSkills = e.target.checked
                                                                ? [...selectedSkills, String(skill.id)]
                                                                : selectedSkills.filter(id => id !== String(skill.id));
                                                            setSelectedSkills(newSkills);
                                                            setIsLoading(true);
                                                            // Trigger search
                                                            const params = new URLSearchParams();
                                                            if (search) params.set('search', search);
                                                            if (newSkills.length > 0) params.set('skills', newSkills.join(','));
                                                            if (location) params.set('location', location);
                                                            if (rateRange[0] > 0) params.set('min_rate', rateRange[0].toString());
                                                            if (rateRange[1] < 100) params.set('max_rate', rateRange[1].toString());
                                                            if (availability !== 'all') params.set('availability', availability);
                                                            params.set('lang', locale);
                                                            router.get(`/employer/employees?${params.toString()}`, {}, {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                                onFinish: () => setIsLoading(false)
                                                            });
                                                        }}
                                                        className="rounded border-gray-300 cursor-pointer text-primary focus:ring-primary"
                                                    />
                                                    <label htmlFor={`skill-${skill.id}`} className="text-sm cursor-pointer" style={{color: '#192341'}}>
                                                        {skill.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 space-y-6">
                            {/* Search Bar */}
                            <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                <CardContent className="pt-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#10B3D6'}} />
                                        <Input
                                            placeholder={t('employer.search_workers_placeholder', 'Search by name, title, or keywords...')}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10 cursor-pointer"
                                            style={{height: '2.7em'}}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Results Count */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    {t('common.showing_results', 'Showing :count results', { count: workersData.total })}
                                </p>
                            </div>

                            {/* Workers Grid */}
                            {isLoading ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {[...Array(6)].map((_, index) => (
                                        <WorkerCardSkeleton key={index} delay={index * 100} />
                                    ))}
                                </div>
                            ) : workersData.data.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {workersData.data.map((worker, index) => (
                                        <Card 
                                            key={worker.id} 
                                            className="worker-card bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]" 
                                            style={{ 
                                                borderTop: '0.5px solid #192341',
                                                animationDelay: `${index * 100}ms`
                                            }}
                                        >
                                        <CardHeader className="flex flex-row items-start gap-4 pb-2">
                                        {(() => {
                                            const getInitials = (name: string) => {
                                                const nameParts = name.trim().split(/\s+/);
                                                if (nameParts.length >= 2) {
                                                    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
                                                }
                                                return name.charAt(0).toUpperCase();
                                            };
                                            
                                            const getColorFromName = (name: string) => {
                                                const colors = [
                                                    { bg: 'linear-gradient(135deg, #10B3D6 0%, #0D8FA8 100%)', text: '#FFFFFF' },
                                                    { bg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', text: '#FFFFFF' },
                                                    { bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', text: '#FFFFFF' },
                                                    { bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', text: '#FFFFFF' },
                                                    { bg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', text: '#FFFFFF' },
                                                    { bg: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', text: '#FFFFFF' },
                                                    { bg: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', text: '#FFFFFF' },
                                                    { bg: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', text: '#FFFFFF' },
                                                ];
                                                let hash = 0;
                                                for (let i = 0; i < name.length; i++) {
                                                    hash = name.charCodeAt(i) + ((hash << 5) - hash);
                                                }
                                                return colors[Math.abs(hash) % colors.length];
                                            };
                                            
                                            const initials = getInitials(worker.name);
                                            const colorScheme = getColorFromName(worker.name);
                                            
                                            return (
                                                <div 
                                                    className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-white/50 relative"
                                                    style={{
                                                        width: '60px', 
                                                        height: '60px',
                                                        background: colorScheme.bg
                                                    }}
                                                >
                                                    {worker.employee_profile.profile_photo ? (
                                                        <img
                                                            src={(() => {
                                                                const photo = worker.employee_profile.profile_photo;
                                                                if (!photo || typeof photo !== 'string') return '';
                                                                
                                                                // If it's a CDN URL, try to extract local path as fallback
                                                                if (photo.startsWith('http://') || photo.startsWith('https://')) {
                                                                    // Check if it's a CDN URL that might fail
                                                                    if (photo.includes('cdn.skilloncall') || photo.includes('cdn.')) {
                                                                        // Try to extract filename and check local storage
                                                                        const urlParts = photo.split('/');
                                                                        const filename = urlParts[urlParts.length - 1];
                                                                        // Return CDN URL but onError will handle fallback
                                                                        return photo;
                                                                    }
                                                                    return photo;
                                                                }
                                                                
                                                                // Remove any existing /storage/ or storage/ prefix to avoid duplication
                                                                let cleanPath = photo;
                                                                if (cleanPath.startsWith('/storage/')) {
                                                                    cleanPath = cleanPath.substring('/storage/'.length);
                                                                } else if (cleanPath.startsWith('storage/')) {
                                                                    cleanPath = cleanPath.substring('storage/'.length);
                                                                }
                                                                
                                                                // Ensure the path doesn't start with a slash
                                                                cleanPath = cleanPath.replace(/^\/+/, '');
                                                                
                                                                // Return with /storage/ prefix
                                                                return `/storage/${cleanPath}`;
                                                            })()}
                                                            alt={worker.name}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                const img = e.target as HTMLImageElement;
                                                                const src = img.src;
                                                                
                                                                // If it's a CDN URL that failed, try to extract filename and use local storage
                                                                if (src.startsWith('http://') || src.startsWith('https://')) {
                                                                    const urlParts = src.split('/');
                                                                    const filename = urlParts[urlParts.length - 1];
                                                                    
                                                                    // Try local storage path
                                                                    if (filename) {
                                                                        // Check if filename contains path info
                                                                        let localPath = filename;
                                                                        if (src.includes('/profiles/')) {
                                                                            localPath = `profile_photos/${filename}`;
                                                                        } else if (src.includes('/portfolio/')) {
                                                                            localPath = `portfolio_photos/${filename}`;
                                                                        }
                                                                        
                                                                        // Try the local path
                                                                        img.src = `/storage/${localPath}`;
                                                                        return; // Let onError fire again if this also fails
                                                                    }
                                                                }
                                                                
                                                                // Hide image on error - fallback will show automatically
                                                                img.style.display = 'none';
                                                                const parent = (e.target as HTMLImageElement).parentElement;
                                                                if (parent) {
                                                                    const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                                                                    if (fallback) {
                                                                        fallback.style.display = 'flex';
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span 
                                                        className="avatar-fallback font-bold select-none absolute inset-0 flex items-center justify-center"
                                                        style={{
                                                            display: (worker.employee_profile.profile_photo ? 'none' : 'flex'),
                                                            color: colorScheme.text,
                                                            fontSize: '20px',
                                                            letterSpacing: '0.5px',
                                                            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        {initials}
                                                    </span>
                                                </div>
                                            );
                                        })()}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-bold truncate page-title">
                                                    {worker.name}
                                                </h3>
                                                <span className="font-semibold" style={{color: '#10B3D6'}}>
                                                    {formatCurrency(worker.employee_profile.hourly_rate_min)}/hr
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {worker.employee_profile.city}, {worker.employee_profile.province}
                                            </div>
                                            <div className="flex items-center mt-2">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="ml-1 font-medium text-default">
                                                    {worker.employee_profile.reviews.length > 0
                                                        ? (worker.employee_profile.reviews.reduce((acc, rev) => acc + rev.rating, 0) / worker.employee_profile.reviews.length).toFixed(1)
                                                        : 'New'
                                                    }
                                                </span>
                                                <span className="mx-2 text-gray-300">|</span>
                                                <span className="text-sm text-gray-600">
                                                    {worker.employee_profile.overall_experience} {t('common.years_exp', 'years exp')}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {worker.employee_profile.bio}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {worker.employee_profile.skills.slice(0, 4).map((skill) => (
                                                <Badge key={skill.id} variant="outline" className="cursor-pointer" style={{backgroundColor: '#FCF2F0', color: '#10B3D6', borderColor: '#10B3D6'}}>
                                                    {skill.name}
                                                </Badge>
                                            ))}
                                            {worker.employee_profile.skills.length > 4 && (
                                                <Badge variant="outline" className="text-gray-500">
                                                    +{worker.employee_profile.skills.length - 4} more
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Link
                                            href={`/employer/employees/${worker.id}?lang=${locale}`}
                                            className="w-full"
                                        >
                                            <Button className="w-full text-white cursor-pointer hover:opacity-90" style={{ backgroundColor: '#10B3D6', height: '2.7em' }}>
                                                {t('employer.view_profile', 'View Profile')}
                                            </Button>
                                        </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                                </div>
                            ) : (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardContent className="text-center py-12">
                                        <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                                            <Search className="h-full w-full" />
                                        </div>
                                        <h3 className="text-lg font-semibold page-title mb-2">{t('common.no_results', 'No workers found')}</h3>
                                        <p className="text-sm text-gray-600 mb-6">{t('common.try_adjusting_filters', 'Try adjusting your search or filters to find what you\'re looking for.')}</p>
                                        <Button 
                                            variant="outline" 
                                            onClick={clearFilters}
                                            className="cursor-pointer"
                                            style={{height: '2.7em'}}
                                        >
                                            {t('common.clear_filters', 'Clear all filters')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Pagination */}
                            {workersData.last_page > 1 && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex gap-1">
                                        {workersData.links.map((link, i) => (
                                            link.url ? (
                                                <Link
                                                    key={i}
                                                    href={`${link.url}${link.url.includes('?') ? '&' : '?'}lang=${locale}`}
                                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                                        link.active
                                                            ? 'bg-[#10B3D6] text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={i}
                                                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
