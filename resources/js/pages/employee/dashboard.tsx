import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Briefcase, 
    DollarSign, 
    Star, 
    TrendingUp, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    User,
    FileText,
    Calendar,
    Mail,
    MessageSquare,
    Bell,
    Users,
    BookOpen,
    MapPin
} from 'react-feather';
import { useState, useEffect } from 'react';

interface DashboardStats {
    totalApplications: number;
    pendingApplications: number;
    acceptedApplications: number;
    completedJobs: number;
    activeBookings?: number; // Made optional for backward compatibility
    averageRating: number;
    totalReviews: number;
    profileCompletion: number;
    unreadMessages?: number; // Made optional for backward compatibility
    availabilityStatus?: 'available' | 'busy' | 'unavailable'; // Made optional for backward compatibility
}

interface Application {
    id: number;
    job_id: number;
    status: string;
    created_at: string;
    job: {
        id: number;
        title: string;
        budget: number;
        status: string;
        employer: {
            id: number;
            name: string;
        };
    };
}

interface Job {
    id: number;
    title: string;
    budget: number;
    category: string;
    employer_id: number;
    created_at: string;
    employer: {
        id: number;
        name: string;
    };
}

interface Message {
    id: number;
    from_employer: {
        id: number;
        name: string;
        company?: string;
    };
    subject: string;
    preview: string;
    created_at: string;
    is_read: boolean;
    priority: 'low' | 'normal' | 'high';
}

interface BookingRequest {
    id: number;
    employer: {
        id: number;
        name: string;
        company?: string;
    };
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    hourly_rate: number;
    total_hours: number;
    status: 'pending' | 'accepted' | 'declined';
    created_at: string;
}

interface AvailabilitySlot {
    date: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}

interface EmployeeDashboardProps {
    stats: DashboardStats;
    recentApplications: Application[];
    recentMessages?: Message[]; // Made optional for backward compatibility
    bookingRequests?: BookingRequest[]; // Made optional for backward compatibility
    activeJobs: Application[];
    upcomingAvailability?: AvailabilitySlot[]; // Made optional for backward compatibility
}

// Loading Skeleton Components
const StatCardSkeleton = () => (
    <Card className="bg-white rounded-xl shadow-sm animate-pulse" style={{borderTop: '.5px solid #192341'}}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="p-2 rounded-lg bg-gray-200 animate-pulse">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="h-8 bg-gray-300 rounded w-16 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
        </CardContent>
    </Card>
);

const ApplicationCardSkeleton = () => (
    <div className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 animate-pulse">
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
    </div>
);

const JobCardSkeleton = () => (
    <div className="p-3 border-b border-gray-100 last:border-b-0 animate-pulse">
        <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-36 animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
    </div>
);

const ActiveJobSkeleton = () => (
    <div className="p-4 border rounded-lg bg-gray-50 border-gray-200 animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>
        <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
        </div>
    </div>
);

const MessageCardSkeleton = () => (
    <div className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 animate-pulse">
        <div className="flex items-center gap-3 flex-1">
            <div className="h-3 w-3 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
    </div>
);

const BookingRequestSkeleton = () => (
    <div className="p-3 border-b border-gray-100 last:border-b-0 animate-pulse">
        <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded w-24 animate-pulse"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
    </div>
);

export default function EmployeeDashboard({ 
    stats, 
    recentApplications, 
    recentMessages, 
    bookingRequests, 
    activeJobs, 
    upcomingAvailability 
}: EmployeeDashboardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Faster initial loading
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
            // Quick content reveal
            setTimeout(() => setShowContent(true), 50);
        }, 800);

        return () => clearTimeout(loadingTimer);
    }, []);
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Provide safe defaults for new data
    const safeRecentMessages = recentMessages || [];
    const safeBookingRequests = bookingRequests || [];
    const safeUpcomingAvailability = upcomingAvailability || [];
    const safeStats = {
        totalApplications: stats?.totalApplications || 0,
        pendingApplications: stats?.pendingApplications || 0,
        acceptedApplications: stats?.acceptedApplications || 0,
        completedJobs: stats?.completedJobs || 0,
        activeBookings: stats?.activeBookings || 0,
        averageRating: stats?.averageRating || 0,
        totalReviews: stats?.totalReviews || 0,
        profileCompletion: stats?.profileCompletion || 0,
        unreadMessages: stats?.unreadMessages || 0,
        availabilityStatus: stats?.availabilityStatus || 'unavailable'
    };

    return (
        <AppLayout>
            <Head title="Employee Dashboard" />

            <div className="w-full px-6 py-8">
                <div className="flex h-full flex-1 flex-col gap-8">
                {/* Header */}
                <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 transition-all duration-400 ease-out ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                    {isLoading ? (
                        <>
                            <div className="space-y-2 w-full sm:w-auto">
                                <div className="h-6 sm:h-8 bg-gray-300 rounded w-40 sm:w-48 animate-pulse"></div>
                                <div className="h-4 sm:h-5 bg-gray-200 rounded w-48 sm:w-72 animate-pulse"></div>
                            </div>
                            <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-24 sm:w-28 animate-pulse"></div>
                        </>
                    ) : (
                        <>
                            <div className="animate-[slideInLeft_0.3s_ease-out]">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight" style={{color: '#192341'}}>
                                    Employee Dashboard
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 mt-1">
                                    Welcome back! Here's your activity overview.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 animate-[slideInRight_0.3s_ease-out]">
                                {safeStats.profileCompletion < 100 ? (
                                    <Badge className="text-orange-700 bg-orange-50 border-orange-200 text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1" variant="outline">
                                        <Clock className="h-3 w-3 sm:h-3 sm:w-3 mr-1" />
                                        <span className="hidden sm:inline">{safeStats.profileCompletion}% Complete</span>
                                        <span className="sm:hidden">{safeStats.profileCompletion}%</span>
                                    </Badge>
                                ) : (
                                    <Badge className="text-white text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1" style={{backgroundColor: '#16a34a'}}>
                                        <CheckCircle className="h-3 w-3 sm:h-3 sm:w-3 mr-1 text-white" />
                                        <span className="hidden sm:inline">Profile complete</span>
                                        <span className="sm:hidden">Complete</span>
                                    </Badge>
                                )}
                                <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1">
                                    <CheckCircle className="h-3 w-3 sm:h-3 sm:w-3 mr-1" />
                                    <span className="hidden sm:inline">Active Employee</span>
                                    <span className="sm:hidden">Active</span>
                                </Badge>
                            </div>
                        </>
                    )}
                </div>

                {/* Stats Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-400 ease-out ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                    {isLoading ? (
                        <>
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </>
                    ) : (
                        <>
                            <div className="animate-[fadeInUp_0.4s_ease-out_0.05s_both]">
                                <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105" style={{borderTop: '.5px solid #192341'}}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-semibold" style={{color: '#10B3D6'}}>Total Applications</CardTitle>
                                        <div className="p-2 rounded-lg animate-[float_3s_ease-in-out_infinite]" style={{backgroundColor: '#FCF2F0'}}>
                                            <FileText className="h-4 w-4" style={{color: '#10B3D6'}} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold animate-[countUp_0.4s_ease-out]" style={{color: '#192341'}}>{safeStats.totalApplications}</div>
                                        <div className="flex items-center space-x-1 text-xs text-gray-600 mt-1">
                                            <span style={{color: '#10B3D6'}} className="font-medium animate-[slideInLeft_0.3s_ease-out_0.1s_both]">+12%</span>
                                            <span>from last month</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="animate-[fadeInUp_0.4s_ease-out_0.1s_both]">
                                <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105" style={{borderTop: '.5px solid #192341'}}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-semibold" style={{color: '#10B3D6'}}>Completed Jobs</CardTitle>
                                        <div className="p-2 rounded-lg animate-[float_3s_ease-in-out_infinite_0.5s]" style={{backgroundColor: '#FCF2F0'}}>
                                            <CheckCircle className="h-4 w-4" style={{color: '#10B3D6'}} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold animate-[countUp_0.4s_ease-out_0.05s_both]" style={{color: '#192341'}}>{safeStats.completedJobs}</div>
                                        <div className="flex items-center space-x-1 text-xs text-gray-600 mt-1">
                                            <span style={{color: '#10B3D6'}} className="font-medium animate-[slideInLeft_0.3s_ease-out_0.15s_both]">+8%</span>
                                            <span>from last month</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="animate-[fadeInUp_0.4s_ease-out_0.15s_both]">
                                <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105" style={{borderTop: '.5px solid #192341'}}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-semibold" style={{color: '#10B3D6'}}>Active Bookings</CardTitle>
                                        <div className="p-2 rounded-lg animate-[float_3s_ease-in-out_infinite_1s]" style={{backgroundColor: '#FCF2F0'}}>
                                            <Calendar className="h-4 w-4" style={{color: '#10B3D6'}} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold animate-[countUp_0.4s_ease-out_0.1s_both]" style={{color: '#192341'}}>{safeStats.activeBookings}</div>
                                        <div className="flex items-center space-x-1 text-xs text-gray-600 mt-1">
                                            <span style={{color: '#10B3D6'}} className="font-medium animate-[slideInLeft_0.3s_ease-out_0.2s_both]">Current bookings</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="animate-[fadeInUp_0.4s_ease-out_0.2s_both]">
                                <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105" style={{borderTop: '.5px solid #192341'}}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-semibold" style={{color: '#10B3D6'}}>Average Rating</CardTitle>
                                        <div className="p-2 rounded-lg animate-[float_3s_ease-in-out_infinite_1.5s]" style={{backgroundColor: '#FCF2F0'}}>
                                            <Star className="h-4 w-4" style={{color: '#10B3D6'}} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2">
                                            <div className="text-2xl font-bold animate-[countUp_0.4s_ease-out_0.15s_both]" style={{color: '#192341'}}>
                                                {safeStats.averageRating > 0 ? safeStats.averageRating.toFixed(1) : 'N/A'}
                                            </div>
                                            {safeStats.averageRating > 0 && (
                                                <Star className="h-4 w-4 text-yellow-500 fill-current animate-[sparkle_2s_ease-in-out_infinite]" />
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-1 text-xs text-gray-600 mt-1">
                                            <span style={{color: '#10B3D6'}} className="font-medium animate-[slideInLeft_0.3s_ease-out_0.25s_both]">{safeStats.totalReviews} reviews</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-400 ease-out ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                    {/* Recent Applications */}
                    <div className="lg:col-span-2">
                        {isLoading ? (
                            <Card className="bg-white rounded-xl shadow-sm animate-pulse" style={{borderTop: '.5px solid #192341'}}>
                                <CardHeader>
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                        <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <ApplicationCardSkeleton />
                                        <ApplicationCardSkeleton />
                                        <ApplicationCardSkeleton />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="animate-[slideInLeft_0.4s_ease-out_0.35s_both]">
                                <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" style={{borderTop: '.5px solid #192341'}}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold flex items-center">
                                            <Clock className="h-5 w-5 mr-2 animate-[float_3s_ease-in-out_infinite]" style={{color: '#10B3D6'}} />
                                            Recent Applications
                                        </CardTitle>
                                    </CardHeader>
                                <CardContent>
                                    {recentApplications.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentApplications.map((application, index) => (
                                                <div key={application.id} className={`flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg transition-all duration-200 animate-[fadeInUp_0.3s_ease-out_${0.4 + index * 0.05}s_both]`}>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium" style={{color: '#192341'}}>{application.job.title}</h4>
                                                        <p className="text-xs text-gray-600">
                                                            {application.job.employer.name} • {formatCurrency(application.job.budget)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Applied {formatDate(application.created_at)}
                                                        </p>
                                                    </div>
                                                    <Badge className={`${getStatusColor(application.status)} animate-[fadeInUp_0.3s_ease-out_${0.45 + index * 0.05}s_both]`} style={{fontSize: '10px'}}>
                                                        {application.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        <div className="mt-4 pt-4 border-t border-gray-200 animate-[fadeInUp_0.3s_ease-out_0.6s_both]">
                                            <Button 
                                                variant="outline" 
                                                className="w-full hover:scale-105 transition-all duration-200 cursor-pointer"
                                                style={{height: '2.7em'}}
                                                onClick={() => window.location.href = '/employee/applications'}
                                            >
                                                View All Applications
                                            </Button>
                                        </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 animate-[fadeInUp_0.4s_ease-out_0.4s_both]">
                                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-[float_3s_ease-in-out_infinite]" />
                                            <p className="text-gray-600">No applications yet</p>
                                            <Button 
                                                className="mt-4 cursor-pointer text-white hover:scale-105 transition-all duration-200"
                                                style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                                onClick={() => window.location.href = '/employee/jobs'}
                                            >
                                                Browse Jobs
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Booking Requests */}
                    <div>
                        {isLoading ? (
                            <Card className="bg-white rounded-xl shadow-sm animate-pulse" style={{borderTop: '.5px solid #192341'}}>
                                <CardHeader>
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                        <div className="h-6 bg-gray-300 rounded w-36 animate-pulse"></div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <BookingRequestSkeleton />
                                        <BookingRequestSkeleton />
                                        <BookingRequestSkeleton />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="animate-[slideInRight_0.4s_ease-out_0.35s_both]">
                                <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" style={{borderTop: '.5px solid #192341'}}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold flex items-center">
                                            <Calendar className="h-5 w-5 mr-2 animate-[float_3s_ease-in-out_infinite_0.5s]" style={{color: '#10B3D6'}} />
                                            Booking Requests
                                        </CardTitle>
                                    </CardHeader>
                                <CardContent>
                                    {safeBookingRequests.length > 0 ? (
                                        <div className="space-y-4">
                                            {safeBookingRequests.map((booking, index) => (
                                                <div key={booking.id} className={`p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer rounded-lg transition-all duration-200 hover:scale-105 animate-[fadeInUp_0.3s_ease-out_${0.4 + index * 0.05}s_both]`}
                                                     onClick={() => window.location.href = `/employee/bookings/${booking.id}`}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-medium" style={{color: '#192341'}}>{booking.title}</h4>
                                                            <p className="text-xs text-gray-600">
                                                                {booking.employer.name} {booking.employer.company && `• ${booking.employer.company}`}
                                                            </p>
                                                            <p className="text-xs font-medium mt-1" style={{color: '#10B3D6'}}>
                                                                ${booking.hourly_rate}/hr • {booking.total_hours}h total
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {new Date(booking.start_date).toLocaleDateString('en-CA')} - {new Date(booking.end_date).toLocaleDateString('en-CA')}
                                                            </p>
                                                        </div>
                                                        <Badge variant={booking.status === 'pending' ? 'outline' : 'default'} className={`animate-[fadeInUp_0.3s_ease-out_${0.45 + index * 0.05}s_both]`} style={{fontSize: '10px'}}>
                                                            {booking.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        <div className="mt-4 pt-4 border-t border-gray-200 animate-[fadeInUp_0.6s_ease-out_1.2s_both]">
                                            <Button 
                                                variant="outline" 
                                                className="w-full hover:scale-105 transition-all duration-200 cursor-pointer"
                                                style={{height: '2.7em'}}
                                                onClick={() => window.location.href = '/employee/bookings'}
                                            >
                                                View All Requests
                                            </Button>
                                        </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 animate-[fadeInUp_0.8s_ease-out_0.8s_both]">
                                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-[float_3s_ease-in-out_infinite]" />
                                            <p className="text-gray-600">No booking requests yet</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Complete your profile and set your availability to receive booking requests
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Jobs */}
                {(activeJobs.length > 0 || isLoading) && (
                    <div className={`transition-all duration-400 ease-out ${
                        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        {isLoading ? (
                            <Card className="bg-white rounded-xl shadow-sm animate-pulse" style={{borderTop: '.5px solid #192341'}}>
                                <CardHeader>
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                        <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ActiveJobSkeleton />
                                        <ActiveJobSkeleton />
                                    </div>
                                </CardContent>
                            </Card>
                        ) : activeJobs.length > 0 ? (
                            <div className="animate-[fadeInUp_0.8s_ease-out_0.9s_both]">
                                <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01]" style={{borderTop: '.5px solid #192341'}}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold flex items-center">
                                            <Briefcase className="h-5 w-5 mr-2 animate-[float_3s_ease-in-out_infinite]" style={{color: '#10B3D6'}} />
                                            Active Jobs
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {activeJobs.map((application, index) => (
                                                <div key={application.id} className={`p-4 border rounded-lg bg-green-50 border-green-200 hover:bg-green-100 transition-all duration-200 hover:scale-105 animate-[fadeInUp_0.6s_ease-out_${1.0 + index * 0.1}s_both]`}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900">{application.job.title}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {application.job.employer.name}
                                                            </p>
                                                            <p className="text-sm font-medium text-green-600 mt-1">
                                                                {formatCurrency(application.job.budget)}
                                                            </p>
                                                        </div>
                                                        <Badge className={`bg-green-100 text-green-800 animate-[fadeInUp_0.6s_ease-out_${1.1 + index * 0.1}s_both]`}>
                                                            Active
                                                        </Badge>
                                                    </div>
                                                    <div className={`mt-4 flex gap-2 animate-[fadeInUp_0.6s_ease-out_${1.2 + index * 0.1}s_both]`}>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="cursor-pointer hover:scale-105 transition-all duration-200"
                                                            onClick={() => window.location.href = `/employee/applications/${application.id}`}
                                                        >
                                                            View Details
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            className="cursor-pointer text-white hover:scale-105 transition-all duration-200"
                                                            style={{ backgroundColor: '#10B3D6' }}
                                                            onClick={() => window.location.href = `/employee/applications/${application.id}`}
                                                        >
                                                            Mark Complete
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* Messages & Communication */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className={`transition-all duration-400 ease-out ${
                        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        {isLoading ? (
                            <Card className="bg-white rounded-xl shadow-sm animate-pulse" style={{borderTop: '.5px solid #192341'}}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-5 w-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                            <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                                        </div>
                                        <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <MessageCardSkeleton />
                                        <MessageCardSkeleton />
                                        <MessageCardSkeleton />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="animate-[fadeInUp_0.8s_ease-out_1.0s_both]">
                                <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01]" style={{borderTop: '.5px solid #192341'}}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg font-semibold flex items-center">
                                                <MessageSquare className="h-5 w-5 mr-2 animate-[float_3s_ease-in-out_infinite_0.5s]" style={{color: '#10B3D6'}} />
                                                Messages
                                            </CardTitle>
                                            {safeStats.unreadMessages > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Bell className="h-4 w-4 text-orange-500 animate-[float_2s_ease-in-out_infinite]" />
                                                    <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                                        {safeStats.unreadMessages} new
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {safeRecentMessages.length > 0 ? (
                                            <div className="space-y-3">
                                                {safeRecentMessages.slice(0, 4).map((message, index) => (
                                                    <div key={message.id} className={`flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer border-l-3 ${!message.is_read ? 'border-l-blue-400 bg-blue-50' : 'border-l-gray-200'} animate-[fadeInUp_0.6s_ease-out_${1.1 + index * 0.1}s_both]`}
                                                         onClick={() => window.location.href = `/employee/messages/${message.id}`}>
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div className={`h-3 w-3 rounded-full ${!message.is_read ? 'bg-blue-400 animate-pulse' : 'bg-gray-300'}`}></div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-sm font-medium truncate" style={{color: '#192341'}}>{message.from_employer.name}</p>
                                                                    <span className="text-xs text-gray-500 ml-2">
                                                                        {formatDate(message.created_at)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs font-medium text-gray-800 truncate">{message.subject}</p>
                                                                <p className="text-xs text-gray-600 truncate">{message.preview}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="mt-4 pt-4 border-t border-gray-200 animate-[fadeInUp_0.6s_ease-out_1.5s_both]">
                                                    <Button 
                                                        variant="outline" 
                                                        className="w-full hover:scale-105 transition-all duration-200 cursor-pointer"
                                                        style={{height: '2.7em'}}
                                                        onClick={() => window.location.href = '/employee/messages'}
                                                    >
                                                        View All Messages
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 animate-[fadeInUp_0.8s_ease-out_1.1s_both]">
                                                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-[float_3s_ease-in-out_infinite]" />
                                                <p className="text-gray-600">No messages yet</p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Employers will be able to contact you here
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Availability Overview */}
                    <div className={`transition-all duration-400 ease-out ${
                        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        {isLoading ? (
                            <Card className="bg-white rounded-xl shadow-sm animate-pulse" style={{borderTop: '.5px solid #192341'}}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-5 w-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                            <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                                        </div>
                                        <div className="h-6 bg-gray-300 rounded w-20 animate-pulse"></div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 bg-gray-100 rounded-lg animate-pulse">
                                            <div className="h-4 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
                                            <div className="h-6 bg-gray-400 rounded w-8 mx-auto"></div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-100 rounded-lg animate-pulse">
                                            <div className="h-4 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
                                            <div className="h-6 bg-gray-400 rounded w-8 mx-auto"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {[1,2,3].map((i) => (
                                            <div key={i} className="flex items-center justify-between py-2">
                                                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="animate-[fadeInUp_0.8s_ease-out_1.0s_both]">
                                <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01]" style={{borderTop: '.5px solid #192341'}}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg font-semibold flex items-center">
                                                <Calendar className="h-5 w-5 mr-2 animate-[float_3s_ease-in-out_infinite]" style={{color: '#10B3D6'}} />
                                                Availability
                                            </CardTitle>
                                            <Badge variant={
                                                safeStats.availabilityStatus === 'available' ? 'default' : 
                                                safeStats.availabilityStatus === 'busy' ? 'secondary' : 
                                                'outline'
                                            } className={`capitalize animate-[fadeInUp_0.6s_ease-out_1.1s_both] ${
                                                safeStats.availabilityStatus === 'available' ? 'bg-green-100 text-green-800' : 
                                                safeStats.availabilityStatus === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {safeStats.availabilityStatus}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="text-center p-3 bg-gray-50 rounded-lg animate-[fadeInUp_0.6s_ease-out_1.2s_both]">
                                                <p className="text-sm text-gray-600">This Week</p>
                                                <p className="text-2xl font-bold" style={{color: '#192341'}}>
                                                    {safeUpcomingAvailability.filter(slot => !slot.is_booked).length}
                                                </p>
                                                <p className="text-xs text-gray-500">Open Slots</p>
                                            </div>
                                            <div className="text-center p-3 bg-blue-50 rounded-lg animate-[fadeInUp_0.6s_ease-out_1.3s_both]">
                                                <p className="text-sm text-gray-600">Booked</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {safeUpcomingAvailability.filter(slot => slot.is_booked).length}
                                                </p>
                                                <p className="text-xs text-gray-500">This Week</p>
                                            </div>
                                        </div>
                                        
                                        {safeUpcomingAvailability.length > 0 ? (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-3 animate-[fadeInUp_0.6s_ease-out_1.4s_both]">Upcoming Schedule</h4>
                                                <div className="space-y-2">
                                                    {safeUpcomingAvailability.slice(0, 4).map((slot, index) => (
                                                        <div key={index} className={`flex items-center justify-between py-2 px-3 rounded-lg border transition-all duration-200 ${slot.is_booked ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} animate-[slideInLeft_0.4s_ease-out_${1.5 + index * 0.05}s_both]`}>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`h-2 w-2 rounded-full ${slot.is_booked ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {new Date(slot.date).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm text-gray-600">
                                                                {slot.start_time} - {slot.end_time}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-200 animate-[fadeInUp_0.6s_ease-out_1.8s_both]">
                                                    <Button 
                                                        variant="outline" 
                                                        className="w-full hover:scale-105 transition-all duration-200 cursor-pointer"
                                                        style={{height: '2.7em'}}
                                                        onClick={() => router.visit('/employee/availability')}
                                                    >
                                                        Manage Availability
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 animate-[fadeInUp_0.8s_ease-out_1.4s_both]">
                                                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-[float_3s_ease-in-out_infinite]" />
                                                <p className="text-gray-600">No availability set</p>
                                                <Button 
                                                    className="mt-3 cursor-pointer text-white hover:scale-105 transition-all duration-200"
                                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                                    onClick={() => window.location.href = '/employee/availability'}
                                                >
                                                    Set Availability
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </AppLayout>
    );
}
