import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Briefcase, CheckCircle, Clock, DollarSign, MapPin, Shield, Star, TrendingUp, Users } from 'react-feather';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/dashboard',
    },
];

export default function AdminDashboard() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger animations after component mounts
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Mock data - in real app, this would come from props/API
    const stats = [
        {
            title: 'Total Users',
            value: '2,847',
            change: '+12%',
            changeType: 'positive' as const,
            icon: Users,
            description: 'Active platform users',
        },
        {
            title: 'Active Jobs',
            value: '156',
            change: '+8%',
            changeType: 'positive' as const,
            icon: Briefcase,
            description: 'Currently posted jobs',
        },
        {
            title: 'Monthly Revenue',
            value: '$24,680',
            change: '+15%',
            changeType: 'positive' as const,
            icon: DollarSign,
            description: 'Subscription & credits',
        },
        {
            title: 'Success Rate',
            value: '94.2%',
            change: '+2.1%',
            changeType: 'positive' as const,
            icon: TrendingUp,
            description: 'Job completion rate',
        },
    ];

    const recentActivity = [
        {
            type: 'user_registered',
            message: 'New employer registered: Metro Foods Inc.',
            time: '2 minutes ago',
            status: 'info' as const,
        },
        {
            type: 'job_posted',
            message: 'Urgent job posted: Evening cashier needed',
            time: '15 minutes ago',
            status: 'success' as const,
        },
        {
            type: 'payment_received',
            message: 'Payment received: $49 monthly subscription',
            time: '1 hour ago',
            status: 'success' as const,
        },
        {
            type: 'dispute_reported',
            message: 'Dispute reported: Worker no-show incident',
            time: '2 hours ago',
            status: 'warning' as const,
        },
        {
            type: 'verification_pending',
            message: '3 worker ID verifications pending review',
            time: '4 hours ago',
            status: 'warning' as const,
        },
    ];

    const topPerformers = [
        {
            name: 'Sarah Chen',
            role: 'Cashier',
            rating: 4.9,
            completedJobs: 47,
            location: 'Toronto, ON',
        },
        {
            name: 'Mike Rodriguez',
            role: 'Cook',
            rating: 4.8,
            completedJobs: 52,
            location: 'Vancouver, BC',
        },
        {
            name: 'Emma Thompson',
            role: 'Retail Associate',
            rating: 4.9,
            completedJobs: 38,
            location: 'Montreal, QC',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard">
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer { cursor: pointer !important; }
                    
                    .admin-title {
                        color: #192341 !important;
                    }
                    
                    .text-default {
                        color: #192341 !important;
                    }
                    
                    .card-with-border {
                        border-top: .5px solid #192341 !important;
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes slideInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes slideInRight {
                        from {
                            opacity: 0;
                            transform: translateX(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.7;
                        }
                    }
                    
                    .animate-fade-in-up {
                        animation: fadeInUp 0.6s ease-out forwards;
                    }
                    
                    .animate-slide-in-left {
                        animation: slideInLeft 0.6s ease-out forwards;
                    }
                    
                    .animate-slide-in-right {
                        animation: slideInRight 0.6s ease-out forwards;
                    }
                    
                    .hover\\:scale-102:hover {
                        transform: scale(1.02);
                    }
                    
                `}</style>
            </Head>

            <div className="w-full px-6 py-8">
                <div className="flex h-full flex-1 flex-col gap-8">
                    {/* Header */}
                    <div
                        className={`flex items-center justify-between transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
                    >
                        <div>
                            <h1 className="admin-title text-2xl leading-tight font-bold md:text-3xl">Admin Dashboard</h1>
                            <p className="mt-1 text-lg leading-relaxed text-gray-600">Manage users, jobs, payments, and platform analytics</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="animate-pulse border-green-200 bg-green-50 text-green-700">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                System Healthy
                            </Badge>
                            <Button
                                className="text-white transition-all duration-200 hover:scale-105 hover:opacity-90"
                                style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                            >
                                Generate Report
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className={`card-with-border transform rounded-xl bg-white shadow-sm transition-all duration-500 hover:scale-105 hover:shadow-lg ${
                                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                }`}
                                style={{
                                    transitionDelay: `${index * 150}ms`,
                                }}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold" style={{ color: '#10B3D6' }}>
                                        {stat.title}
                                    </CardTitle>
                                    <stat.icon className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-default text-2xl font-bold">{stat.value}</div>
                                    <div className="mt-1 flex items-center space-x-1 text-xs text-gray-600">
                                        <span style={{ color: '#10B3D6' }} className="font-medium">
                                            {stat.change}
                                        </span>
                                        <span>from last month</span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Recent Activity */}
                        <div
                            className={`transition-all duration-700 lg:col-span-2 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                            style={{ transitionDelay: '600ms' }}
                        >
                            <Card className="card-with-border rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg font-semibold">
                                        <Clock className="mr-2 h-5 w-5" style={{ color: '#10B3D6' }} />
                                        Recent Activity
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-600">Latest platform events and notifications</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-start space-x-3 rounded-lg p-3 transition-all duration-300 hover:scale-102 ${
                                                    isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                                                }`}
                                                style={{
                                                    backgroundColor: '#FCF2F0',
                                                    transitionDelay: `${700 + index * 100}ms`,
                                                }}
                                            >
                                                <div
                                                    className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${
                                                        activity.status === 'success'
                                                            ? 'bg-green-500'
                                                            : activity.status === 'warning'
                                                              ? 'bg-yellow-500'
                                                              : 'bg-blue-500'
                                                    }`}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-default text-sm">{activity.message}</p>
                                                    <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full transition-all duration-200 hover:scale-105"
                                            style={{ height: '2.7em' }}
                                        >
                                            View All Activity
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top Performers */}
                        <div
                            className={`transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                            style={{ transitionDelay: '800ms' }}
                        >
                            <Card className="card-with-border rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg font-semibold">
                                        <Star className="mr-2 h-5 w-5" style={{ color: '#10B3D6' }} />
                                        Top Performers
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-600">Highest rated workers this month</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topPerformers.map((performer, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center space-x-3 rounded-lg p-3 transition-all duration-300 hover:scale-102 ${
                                                    isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                                }`}
                                                style={{
                                                    backgroundColor: '#FCF2F0',
                                                    transitionDelay: `${900 + index * 100}ms`,
                                                }}
                                            >
                                                <div
                                                    className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white"
                                                    style={{ backgroundColor: '#10B3D6', width: '30px', height: '30px', fontSize: '12px' }}
                                                >
                                                    {performer.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-default text-sm font-semibold">{performer.name}</p>
                                                    <p className="text-xs text-gray-500">{performer.role}</p>
                                                    <div className="mt-1 flex items-center space-x-2">
                                                        <div className="flex items-center">
                                                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                                                            <span className="ml-1 text-xs text-gray-600">{performer.rating}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-600">{performer.completedJobs} jobs</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center">
                                                        <MapPin className="h-3 w-3 text-gray-400" />
                                                        <span className="ml-1 text-xs text-gray-500">{performer.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full transition-all duration-200 hover:scale-105"
                                            style={{ height: '2.7em' }}
                                        >
                                            View All Workers
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="card-with-border cursor-pointer rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg p-2" style={{ backgroundColor: '#FCF2F0' }}>
                                        <Users className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                    </div>
                                    <div>
                                        <p className="text-default text-sm font-semibold">Manage Users</p>
                                        <p className="text-xs text-gray-500">View & verify accounts</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-with-border cursor-pointer rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg p-2" style={{ backgroundColor: '#FCF2F0' }}>
                                        <Briefcase className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                    </div>
                                    <div>
                                        <p className="text-default text-sm font-semibold">Job Oversight</p>
                                        <p className="text-xs text-gray-500">Monitor job postings</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-with-border cursor-pointer rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg p-2" style={{ backgroundColor: '#FCF2F0' }}>
                                        <Shield className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                    </div>
                                    <div>
                                        <p className="text-default text-sm font-semibold">Security Center</p>
                                        <p className="text-xs text-gray-500">Review disputes & fraud</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-with-border cursor-pointer rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg p-2" style={{ backgroundColor: '#FCF2F0' }}>
                                        <DollarSign className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                    </div>
                                    <div>
                                        <p className="text-default text-sm font-semibold">Revenue Reports</p>
                                        <p className="text-xs text-gray-500">Financial analytics</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
