import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
    MapPin,
    Star,
    Clock,
    Briefcase,
    Award,
    Globe,
    Phone,
    Mail,
    CheckCircle,
    Calendar,
    DollarSign,
    ChevronLeft,
    User,
    FileText,
    Shield,
    Truck,
    Tool,
    Users,
    MessageCircle,
    TrendingUp,
    Award as AwardIcon,
    BookOpen,
    Navigation,
    AlertCircle,
    XCircle
} from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';
import { type BreadcrumbItem } from '@/types';

interface Skill {
    id: number;
    name: string;
    pivot: {
        proficiency_level: string;
        is_primary_skill: boolean;
    };
}

interface Language {
    id: number;
    name: string;
    pivot: {
        proficiency_level: string;
        is_primary_language: boolean;
    };
}

interface WorkExperience {
    id: number;
    job_title: string;
    company_name: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string;
    skill?: {
        id: number;
        name: string;
    };
    industry?: {
        id: number;
        name: string;
    };
    supervisor_name?: string;
    supervisor_contact?: string;
}

interface Certification {
    id: number;
    certificate_number?: string;
    issued_date: string;
    expiry_date?: string;
    verification_status: string;
    certification?: {
        id: number;
        name: string;
    };
}

interface Reference {
    id: number;
    reference_name: string;
    reference_phone: string;
    reference_email?: string;
    relationship: string;
    company_name?: string;
    notes?: string;
    permission_to_contact: boolean;
}

interface Portfolio {
    id: number;
    title: string;
    description: string;
    image_path: string;
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    reviewer?: {
        name: string;
    };
}

interface Availability {
    id: number;
    day_of_week: number | string; // Can be integer (0-6) or string
    start_time: string;
    end_time: string;
    is_available: boolean;
}

interface ServiceArea {
    id: number;
    postal_code: string;
    city?: string;
    province?: string;
    radius_km?: number;
}

interface Worker {
    id: number;
    name: string;
    email: string;
    employee_profile: {
        first_name?: string;
        last_name?: string;
        phone?: string;
        bio: string;
        hourly_rate_min: number;
        hourly_rate_max?: number;
        city: string;
        province: string;
        postal_code?: string;
        address_line_1?: string;
        address_line_2?: string;
        country?: string;
        overall_experience: string;
        profile_photo: string | null;
        date_of_birth?: string;
        work_authorization?: string;
        work_permit_expiry?: string;
        has_criminal_background_check?: boolean;
        background_check_date?: string;
        travel_distance_max?: number;
        has_vehicle?: boolean;
        has_tools_equipment?: boolean;
        is_insured?: boolean;
        has_wcb_coverage?: boolean;
        emergency_contact_name?: string;
        emergency_contact_phone?: string;
        emergency_contact_relationship?: string;
        social_media_links?: Record<string, string> | string;
        work_preferences?: Record<string, any> | string;
        portfolio_photos?: Array<{
            path: string;
            caption?: string;
            description?: string;
        }>;
        skills: Skill[];
        languages: Language[];
        work_experiences: WorkExperience[];
        certifications: Certification[];
        references: Reference[];
        portfolios: Portfolio[];
        reviews: Review[];
        availability: Availability[];
        service_areas?: ServiceArea[];
    };
}

interface Props {
    worker: Worker;
}

// Helper function to get initials with color
const getInitials = (name: string | null | undefined) => {
    if (!name || typeof name !== 'string') return '?';
    const trimmed = name.trim();
    if (!trimmed) return '?';
    const nameParts = trimmed.split(/\s+/);
    if (nameParts.length >= 2) {
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    return trimmed.charAt(0).toUpperCase();
};

const getColorFromName = (name: string | null | undefined) => {
    if (!name || typeof name !== 'string') {
        name = 'Anonymous';
    }
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

export default function WorkerShow({ worker }: Props) {
    const { t, locale } = useTranslations();

    // Safety checks
    if (!worker) {
        return (
            <AppLayout>
                <Head title={t('employer.worker_profile', 'Worker Profile')} />
                <div className="container mx-auto px-4 py-8">
                    <p className="text-center text-gray-500">{t('employer.worker_not_found', 'Worker not found')}</p>
                </div>
            </AppLayout>
        );
    }

    if (!worker.employee_profile) {
        return (
            <AppLayout>
                <Head title={`${worker.name || 'Worker'} - ${t('employer.worker_profile', 'Worker Profile')}`} />
                <div className="container mx-auto px-4 py-8">
                    <p className="text-center text-gray-500">{t('employer.profile_not_found', 'Profile not found')}</p>
                </div>
            </AppLayout>
        );
    }

    const workerName = worker.name || 'Unknown Worker';
    const employeeProfile = worker.employee_profile || {};

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('employer.title', 'Employer Dashboard'),
            href: `/employer/dashboard?lang=${locale}`,
        },
        {
            title: t('employer.find_workers', 'Find Workers'),
            href: `/employer/employees?lang=${locale}`,
        },
        {
            title: workerName,
            href: `#`,
        },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getProficiencyColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'expert':
            case 'native':
                return 'bg-green-100 text-green-800';
            case 'advanced':
            case 'fluent':
                return 'bg-blue-100 text-blue-800';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'beginner':
            case 'basic':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getVerificationStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'verified':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'expired':
                return 'bg-red-100 text-red-800';
            case 'invalid':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const calculateAverageRating = () => {
        if (!employeeProfile.reviews || employeeProfile.reviews.length === 0) {
            return '0.0';
        }
        const sum = employeeProfile.reviews.reduce((acc: number, review: Review) => acc + (review.rating || 0), 0);
        return (sum / employeeProfile.reviews.length).toFixed(1);
    };

    const initials = getInitials(workerName);
    const colorScheme = getColorFromName(workerName);
    const avgRating = calculateAverageRating();

    // Map day names to numbers (0=Sunday, 1=Monday, etc.)
    const dayNameToNumber: Record<string, number> = {
        'Sunday': 0,
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
    };
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${workerName} - ${t('employer.worker_profile', 'Worker Profile')}`}>
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
                `}</style>
            </Head>

            <div className="w-full px-6 py-8" style={{ backgroundColor: '#F6FBFD' }}>
                <div className="flex h-full flex-1 flex-col gap-8">
                    {/* Back Button */}
                    <Link
                        href={`/employer/employees?lang=${locale}`}
                        className="inline-flex items-center text-gray-600 hover:text-[#10B3D6] transition-colors cursor-pointer mb-2"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        {t('common.back', 'Back')} {t('employer.to_search', 'to Search')}
                    </Link>

                    {/* Header Section */}
                    <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                        <CardContent className="pt-8 pb-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                {/* Profile Photo/Initials */}
                                <div 
                                    className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg ring-4 ring-white"
                                    style={{
                                        width: '120px', 
                                        height: '120px',
                                        background: colorScheme.bg
                                    }}
                                >
                                    {employeeProfile.profile_photo ? (
                                        <img
                                            src={(() => {
                                                const photo = employeeProfile.profile_photo;
                                                if (!photo || typeof photo !== 'string') return '';
                                                
                                                // If already a full URL, use it
                                                if (photo.startsWith('http://') || photo.startsWith('https://')) {
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
                                            alt={workerName}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                console.error('Profile photo failed to load:', employeeProfile.profile_photo);
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <span 
                                            className="font-bold select-none"
                                            style={{
                                                color: colorScheme.text,
                                                fontSize: '48px',
                                                letterSpacing: '1px',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {initials}
                                        </span>
                                    )}
                                </div>

                                {/* Name and Basic Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-bold leading-tight page-title mb-2">
                                                {workerName}
                                            </h1>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{employeeProfile.city || ''}, {employeeProfile.province || ''}</span>
                                                </div>
                                                {worker.email && (
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-4 w-4" />
                                                        <span>{worker.email}</span>
                                                    </div>
                                                )}
                                                {employeeProfile.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{employeeProfile.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex flex-wrap gap-6">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold page-title">
                                                    {formatCurrency(employeeProfile.hourly_rate_min || 0)}
                                                    {employeeProfile.hourly_rate_max && employeeProfile.hourly_rate_max !== employeeProfile.hourly_rate_min && (
                                                        <span className="text-lg text-gray-500"> - {formatCurrency(employeeProfile.hourly_rate_max)}</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">{t('common.hourly_rate', 'Hourly Rate')}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold page-title flex items-center justify-center gap-1">
                                                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                                    {avgRating}
                                                </div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                                                    {employeeProfile.reviews?.length || 0} {t('common.reviews', 'Reviews')}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold page-title">
                                                    {employeeProfile.overall_experience || '0'}
                                                </div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">{t('common.years_exp', 'Years Exp')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Quick Info */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Quick Stats */}
                            <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold page-title flex items-center">
                                        <TrendingUp className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                        {t('employer.quick_stats', 'Quick Stats')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{t('employer.total_skills', 'Total Skills')}</span>
                                        <span className="font-semibold page-title">{employeeProfile.skills?.length || 0}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{t('employer.languages', 'Languages')}</span>
                                        <span className="font-semibold page-title">{employeeProfile.languages?.length || 0}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{t('employer.experience_entries', 'Experience')}</span>
                                        <span className="font-semibold page-title">{employeeProfile.work_experiences?.length || 0}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{t('employer.certifications', 'Certifications')}</span>
                                        <span className="font-semibold page-title">{employeeProfile.certifications?.length || 0}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Skills */}
                            {employeeProfile.skills && employeeProfile.skills.length > 0 && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <Briefcase className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('common.skills', 'Skills')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {employeeProfile.skills.map((skill) => (
                                                <Badge 
                                                    key={skill.id} 
                                                    variant="outline" 
                                                    className="cursor-pointer" 
                                                    style={{
                                                        backgroundColor: '#FCF2F0', 
                                                        color: '#10B3D6', 
                                                        borderColor: '#10B3D6'
                                                    }}
                                                >
                                                    {skill.name}
                                                    {skill.pivot?.proficiency_level && (
                                                        <span className="ml-1 text-xs opacity-75">
                                                            ({skill.pivot.proficiency_level})
                                                        </span>
                                                    )}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Languages */}
                            {employeeProfile.languages && employeeProfile.languages.length > 0 && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <Globe className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('common.languages', 'Languages')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {employeeProfile.languages.map((lang) => (
                                                <div key={lang.id} className="flex justify-between items-center">
                                                    <span className="font-medium text-default">{lang.name}</span>
                                                    <Badge className={getProficiencyColor(lang.pivot?.proficiency_level || '')} style={{fontSize: '11px'}}>
                                                        {lang.pivot?.proficiency_level || 'N/A'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Availability */}
                            {employeeProfile.availability && employeeProfile.availability.length > 0 && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <Clock className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('common.availability', 'Availability')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {daysOfWeek.map((day) => {
                                                const dayNumber = dayNameToNumber[day];
                                                const dayAvailability = employeeProfile.availability.find((a) => {
                                                    // Handle both integer and string day_of_week
                                                    const aDay = typeof a.day_of_week === 'number' 
                                                        ? a.day_of_week 
                                                        : (typeof a.day_of_week === 'string' 
                                                            ? dayNameToNumber[a.day_of_week] 
                                                            : null);
                                                    return aDay === dayNumber;
                                                });
                                                return (
                                                    <div key={day} className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-600">{day.substring(0, 3)}</span>
                                                        {dayAvailability && dayAvailability.is_available ? (
                                                            <span className="text-green-600 font-medium">
                                                                {formatTime(dayAvailability.start_time)} - {formatTime(dayAvailability.end_time)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">{t('common.unavailable', 'Unavailable')}</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Additional Info */}
                            {(employeeProfile.has_vehicle || 
                              employeeProfile.has_tools_equipment || 
                              employeeProfile.is_insured || 
                              employeeProfile.has_wcb_coverage || 
                              employeeProfile.has_criminal_background_check || 
                              employeeProfile.travel_distance_max) && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <Shield className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.additional_info', 'Additional Info')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {employeeProfile.has_vehicle && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Truck className="h-4 w-4 text-green-600" />
                                                <span className="text-default">{t('employer.has_vehicle', 'Has Vehicle')}</span>
                                            </div>
                                        )}
                                        {employeeProfile.has_tools_equipment && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Tool className="h-4 w-4 text-green-600" />
                                                <span className="text-default">{t('employer.has_tools', 'Has Tools & Equipment')}</span>
                                            </div>
                                        )}
                                        {employeeProfile.is_insured && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Shield className="h-4 w-4 text-green-600" />
                                                <span className="text-default">{t('employer.insured', 'Insured')}</span>
                                            </div>
                                        )}
                                        {employeeProfile.has_wcb_coverage && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-default">{t('employer.wcb_coverage', 'WCB Coverage')}</span>
                                            </div>
                                        )}
                                        {employeeProfile.has_criminal_background_check && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-default">{t('employer.background_check', 'Background Check')}</span>
                                                {employeeProfile.background_check_date && (
                                                    <span className="text-xs text-gray-500">
                                                        ({formatDate(employeeProfile.background_check_date)})
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {employeeProfile.travel_distance_max && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Navigation className="h-4 w-4" style={{color: '#10B3D6'}} />
                                                <span className="text-default">
                                                    {t('employer.max_travel', 'Max Travel')}: {employeeProfile.travel_distance_max} km
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Detailed Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            {(employeeProfile.first_name || 
                              employeeProfile.last_name || 
                              employeeProfile.date_of_birth || 
                              employeeProfile.work_authorization || 
                              employeeProfile.work_permit_expiry || 
                              employeeProfile.address_line_1 || 
                              employeeProfile.postal_code || 
                              employeeProfile.country) && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <User className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.personal_information', 'Personal Information')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {employeeProfile.first_name && (
                                                <div>
                                                    <Label className="text-xs text-gray-500 uppercase tracking-wide">{t('employer.first_name', 'First Name')}</Label>
                                                    <p className="text-default font-medium mt-1">{employeeProfile.first_name}</p>
                                                </div>
                                            )}
                                            {employeeProfile.last_name && (
                                                <div>
                                                    <Label className="text-xs text-gray-500 uppercase tracking-wide">{t('employer.last_name', 'Last Name')}</Label>
                                                    <p className="text-default font-medium mt-1">{employeeProfile.last_name}</p>
                                                </div>
                                            )}
                                            {employeeProfile.date_of_birth && (
                                                <div>
                                                    <Label className="text-xs text-gray-500 uppercase tracking-wide">{t('employer.date_of_birth', 'Date of Birth')}</Label>
                                                    <p className="text-default font-medium mt-1">{formatDate(employeeProfile.date_of_birth)}</p>
                                                </div>
                                            )}
                                            {employeeProfile.work_authorization && (
                                                <div>
                                                    <Label className="text-xs text-gray-500 uppercase tracking-wide">{t('employer.work_authorization', 'Work Authorization')}</Label>
                                                    <p className="text-default font-medium mt-1 capitalize">
                                                        {employeeProfile.work_authorization.replace(/_/g, ' ')}
                                                    </p>
                                                </div>
                                            )}
                                            {employeeProfile.work_permit_expiry && (
                                                <div>
                                                    <Label className="text-xs text-gray-500 uppercase tracking-wide">{t('employer.work_permit_expiry', 'Work Permit Expiry')}</Label>
                                                    <p className="text-default font-medium mt-1">{formatDate(employeeProfile.work_permit_expiry)}</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Full Address */}
                                        {(employeeProfile.address_line_1 || employeeProfile.postal_code || employeeProfile.country) && (
                                            <div className="pt-4 border-t">
                                                <Label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">{t('employer.address', 'Address')}</Label>
                                                <div className="text-default space-y-1">
                                                    {employeeProfile.address_line_1 && <p>{employeeProfile.address_line_1}</p>}
                                                    {employeeProfile.address_line_2 && <p>{employeeProfile.address_line_2}</p>}
                                                    <p>
                                                        {employeeProfile.city && `${employeeProfile.city}, `}
                                                        {employeeProfile.province && `${employeeProfile.province} `}
                                                        {employeeProfile.postal_code && employeeProfile.postal_code}
                                                    </p>
                                                    {employeeProfile.country && <p>{employeeProfile.country}</p>}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* About Section */}
                            {employeeProfile.bio && employeeProfile.bio.trim() && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <FileText className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.about', 'About')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                            {employeeProfile.bio}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Work Experience */}
                            {employeeProfile.work_experiences && employeeProfile.work_experiences.length > 0 && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <Briefcase className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.work_experience', 'Work Experience')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {employeeProfile.work_experiences.map((exp) => (
                                                <div key={exp.id} className="border-l-4 pl-4" style={{borderColor: '#10B3D6'}}>
                                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-lg page-title">{exp.job_title}</h3>
                                                            <p className="font-medium" style={{color: '#10B3D6'}}>{exp.company_name}</p>
                                                            {exp.skill && (
                                                                <Badge variant="outline" className="mt-1" style={{backgroundColor: '#FCF2F0', color: '#10B3D6', borderColor: '#10B3D6', fontSize: '11px'}}>
                                                                    {exp.skill.name}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>
                                                                {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : t('common.present', 'Present')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {exp.description && (
                                                        <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>
                                                    )}
                                                    {exp.supervisor_name && (
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            {t('employer.supervisor', 'Supervisor')}: {exp.supervisor_name}
                                                            {exp.supervisor_contact && ` (${exp.supervisor_contact})`}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Certifications */}
                            {employeeProfile.certifications && employeeProfile.certifications.length > 0 && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <AwardIcon className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.certifications', 'Certifications')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {employeeProfile.certifications.map((cert) => (
                                                <div key={cert.id} className="p-4 rounded-lg border" style={{backgroundColor: '#FCF2F0', borderColor: '#10B3D6'}}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold page-title">
                                                                {cert.certification?.name || t('employer.certification', 'Certification')}
                                                            </h4>
                                                            {cert.certificate_number && (
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {t('employer.cert_number', 'Cert #')}: {cert.certificate_number}
                                                                </p>
                                                            )}
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {cert.issued_date && (
                                                                    <span className="text-xs text-gray-600">
                                                                        {t('employer.issued', 'Issued')}: {formatDate(cert.issued_date)}
                                                                    </span>
                                                                )}
                                                                {cert.expiry_date && (
                                                                    <span className="text-xs text-gray-600">
                                                                        {t('employer.expires', 'Expires')}: {formatDate(cert.expiry_date)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Badge className={getVerificationStatusColor(cert.verification_status)} style={{fontSize: '11px'}}>
                                                            {cert.verification_status || 'Pending'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Portfolio */}
                            {employeeProfile.portfolios && employeeProfile.portfolios.length > 0 && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <BookOpen className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.portfolio', 'Portfolio')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {employeeProfile.portfolios.map((item) => (
                                                <div key={item.id} className="rounded-lg overflow-hidden border hover:shadow-md transition-shadow" style={{borderColor: '#E5E7EB'}}>
                                                    <div className="h-48 overflow-hidden bg-gray-100">
                                                        <img
                                                            src={(() => {
                                                                const imgPath = item.image_path;
                                                                if (!imgPath || typeof imgPath !== 'string') return '';
                                                                // If already a full URL, use it
                                                                if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
                                                                    return imgPath;
                                                                }
                                                                // If already starts with /storage/, use it
                                                                if (imgPath.startsWith('/storage/')) {
                                                                    return imgPath;
                                                                }
                                                                // Otherwise, prepend /storage/
                                                                return `/storage/${imgPath}`;
                                                            })()}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="font-semibold page-title mb-1">{item.title}</h4>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Portfolio Photos - From portfolio_photos Array */}
                            {employeeProfile.portfolio_photos && Array.isArray(employeeProfile.portfolio_photos) && employeeProfile.portfolio_photos.length > 0 && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <BookOpen className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.portfolio_photos', 'Portfolio Photos')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {employeeProfile.portfolio_photos.map((photo, index) => {
                                                if (!photo || typeof photo !== 'object') return null;
                                                const photoPath = photo.path || photo;
                                                const caption = photo.caption || photo.description || '';
                                                
                                                // Helper function to get correct image URL
                                                const getImageUrl = (path: string): string => {
                                                    if (!path || typeof path !== 'string') return '';
                                                    
                                                    // If already a full URL, use it
                                                    if (path.startsWith('http://') || path.startsWith('https://')) {
                                                        return path;
                                                    }
                                                    
                                                    // Remove any existing /storage/ or storage/ prefix to avoid duplication
                                                    let cleanPath = path;
                                                    if (cleanPath.startsWith('/storage/')) {
                                                        cleanPath = cleanPath.substring('/storage/'.length);
                                                    } else if (cleanPath.startsWith('storage/')) {
                                                        cleanPath = cleanPath.substring('storage/'.length);
                                                    }
                                                    
                                                    // Ensure the path doesn't start with a slash
                                                    cleanPath = cleanPath.replace(/^\/+/, '');
                                                    
                                                    // Return with /storage/ prefix
                                                    return `/storage/${cleanPath}`;
                                                };
                                                
                                                return (
                                                    <div key={index} className="group relative rounded-lg overflow-hidden border hover:shadow-lg transition-all cursor-pointer" style={{borderColor: '#E5E7EB'}}>
                                                        <div className="aspect-square overflow-hidden bg-gray-100">
                                                            <img
                                                                src={getImageUrl(photoPath)}
                                                                alt={caption || `Portfolio photo ${index + 1}`}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                onError={(e) => {
                                                                    console.error('Portfolio photo failed to load:', getImageUrl(photoPath), photoPath);
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                        {caption && (
                                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <p className="line-clamp-2">{caption}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* References */}
                            {employeeProfile.references && employeeProfile.references.length > 0 && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <Users className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.references', 'References')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {employeeProfile.references.map((ref) => (
                                                <div key={ref.id} className="p-4 rounded-lg border" style={{backgroundColor: '#FCF2F0', borderColor: '#10B3D6'}}>
                                                    <h4 className="font-semibold page-title">{ref.reference_name}</h4>
                                                    <p className="text-sm text-gray-600 capitalize">{ref.relationship}</p>
                                                    {ref.company_name && (
                                                        <p className="text-sm text-gray-600">{ref.company_name}</p>
                                                    )}
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="h-3 w-3" />
                                                            <span>{ref.reference_phone}</span>
                                                        </div>
                                                        {ref.reference_email && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Mail className="h-3 w-3" />
                                                                <span>{ref.reference_email}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {ref.notes && (
                                                        <p className="text-sm text-gray-600 mt-2 italic">{ref.notes}</p>
                                                    )}
                                                    {ref.permission_to_contact && (
                                                        <Badge className="mt-2 bg-green-100 text-green-800" style={{fontSize: '10px'}}>
                                                            {t('employer.permission_to_contact', 'Permission to Contact')}
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Service Areas */}
                            {employeeProfile.service_areas && employeeProfile.service_areas.length > 0 && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <MapPin className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.service_areas', 'Service Areas')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {employeeProfile.service_areas.map((area) => (
                                                <Badge key={area.id} variant="outline" style={{backgroundColor: '#FCF2F0', color: '#10B3D6', borderColor: '#10B3D6'}}>
                                                    {area.postal_code}
                                                    {area.city && ` - ${area.city}`}
                                                    {area.radius_km && ` (${area.radius_km}km)`}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Reviews */}
                            {employeeProfile.reviews && employeeProfile.reviews.length > 0 && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <Star className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.reviews', 'Reviews')} ({employeeProfile.reviews.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {employeeProfile.reviews.map((review) => (
                                                <div key={review.id} className="p-4 rounded-lg border" style={{borderColor: '#E5E7EB'}}>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div 
                                                                className="rounded-full flex items-center justify-center text-white font-semibold"
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    background: getColorFromName(review.reviewer?.name || 'Anonymous').bg
                                                                }}
                                                            >
                                                                {(review.reviewer?.name || 'A').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold page-title">
                                                                    {review.reviewer?.name || t('jobs.anonymous', 'Anonymous')}
                                                                </h4>
                                                                <div className="flex items-center gap-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Emergency Contact */}
                            {(employeeProfile.emergency_contact_name || employeeProfile.emergency_contact_phone) && (
                                <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold page-title flex items-center">
                                            <Phone className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                            {t('employer.emergency_contact', 'Emergency Contact')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {employeeProfile.emergency_contact_name && (
                                                <div>
                                                    <Label className="text-xs text-gray-500 uppercase tracking-wide">{t('employer.name', 'Name')}</Label>
                                                    <p className="text-default font-medium mt-1">{employeeProfile.emergency_contact_name}</p>
                                                </div>
                                            )}
                                            {employeeProfile.emergency_contact_phone && (
                                                <div>
                                                    <Label className="text-xs text-gray-500 uppercase tracking-wide">{t('employer.phone', 'Phone')}</Label>
                                                    <p className="text-default font-medium mt-1">{employeeProfile.emergency_contact_phone}</p>
                                                </div>
                                            )}
                                            {employeeProfile.emergency_contact_relationship && (
                                                <div>
                                                    <Label className="text-xs text-gray-500 uppercase tracking-wide">{t('employer.relationship', 'Relationship')}</Label>
                                                    <p className="text-default font-medium mt-1 capitalize">
                                                        {employeeProfile.emergency_contact_relationship.replace(/_/g, ' ')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Work Preferences */}
                            {(() => {
                                try {
                                    if (!employeeProfile.work_preferences) return null;
                                    
                                    const preferences = typeof employeeProfile.work_preferences === 'string' 
                                        ? JSON.parse(employeeProfile.work_preferences) 
                                        : employeeProfile.work_preferences;
                                    
                                    if (preferences && typeof preferences === 'object' && Object.keys(preferences).length > 0) {
                                        return (
                                            <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                                <CardHeader>
                                                    <CardTitle className="text-lg font-semibold page-title flex items-center">
                                                        <Briefcase className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                                        {t('employer.work_preferences', 'Work Preferences')}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {Object.entries(preferences).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-600 capitalize">
                                                                    {key.replace(/_/g, ' ')}
                                                                </span>
                                                                <span className="text-sm font-medium text-default">
                                                                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    }
                                } catch (e) {
                                    // If parsing fails, check if it's a non-empty string
                                    if (typeof employeeProfile.work_preferences === 'string' && employeeProfile.work_preferences.trim()) {
                                        return (
                                            <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                                <CardHeader>
                                                    <CardTitle className="text-lg font-semibold page-title flex items-center">
                                                        <Briefcase className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                                        {t('employer.work_preferences', 'Work Preferences')}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-gray-600">
                                                        {employeeProfile.work_preferences}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        );
                                    }
                                }
                                return null;
                            })()}

                            {/* Social Media Links */}
                            {(() => {
                                try {
                                    if (!employeeProfile.social_media_links) return null;
                                    
                                    const links = typeof employeeProfile.social_media_links === 'string' 
                                        ? JSON.parse(employeeProfile.social_media_links) 
                                        : employeeProfile.social_media_links;
                                    
                                    if (links && typeof links === 'object') {
                                        const socialPlatforms: Record<string, string> = {
                                            'linkedin': 'LinkedIn',
                                            'facebook': 'Facebook',
                                            'twitter': 'Twitter',
                                            'instagram': 'Instagram',
                                            'github': 'GitHub',
                                            'portfolio': 'Portfolio',
                                            'website': 'Website',
                                        };
                                        
                                        // Check if there are any non-empty URLs
                                        const hasLinks = Object.entries(links).some(([_, url]) => url && typeof url === 'string' && url.trim());
                                        
                                        if (!hasLinks) return null;
                                        
                                        return (
                                            <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                                                <CardHeader>
                                                    <CardTitle className="text-lg font-semibold page-title flex items-center">
                                                        <Globe className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                                                        {t('employer.social_media', 'Social Media')}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {Object.entries(links).map(([platform, url]) => (
                                                            url && typeof url === 'string' && url.trim() && (
                                                                <div key={platform} className="flex items-center gap-2">
                                                                    <span className="text-sm text-gray-600 w-24">
                                                                        {socialPlatforms[platform.toLowerCase()] || platform.charAt(0).toUpperCase() + platform.slice(1)}:
                                                                    </span>
                                                                        <a 
                                                                            href={String(url).startsWith('http') ? String(url) : `https://${url}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-sm text-[#10B3D6] hover:underline cursor-pointer"
                                                                        >
                                                                            {String(url)}
                                                                        </a>
                                                                    </div>
                                                                )
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        }
                                    } catch (e) {
                                        return null;
                                    }
                                    return null;
                                })()}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
