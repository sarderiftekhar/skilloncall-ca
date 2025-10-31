import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, Briefcase, CheckCircle, Calendar } from 'react-feather';
import { Link } from '@inertiajs/react';

export default function ApplicationsComingSoon() {
    const { t } = useTranslations();

    return (
        <AppLayout>
            <Head title={t('nav.my_applications')} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    {/* Coming Soon Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="px-8 py-12 text-center" style={{ background: 'linear-gradient(to right, #10B3D6, #0891b2)' }}>
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                                <Briefcase className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                {t('nav.my_applications')}
                            </h1>
                            <p className="text-cyan-100 text-lg">
                                Track and manage your job applications
                            </p>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-12">
                            {/* Coming Soon Badge */}
                            <div className="flex items-center justify-center mb-8">
                                <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-full px-6 py-3">
                                    <Clock className="w-5 h-5 text-amber-600" />
                                    <span className="text-amber-800 font-semibold text-lg">
                                        Coming Soon
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    We're Building Something Amazing!
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
                                    The My Applications feature is currently under development. 
                                    Soon you'll be able to track all your job applications in one place.
                                </p>
                            </div>

                            {/* Features Preview */}
                            <div className="grid md:grid-cols-2 gap-6 mb-10">
                                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e0f7fa' }}>
                                        <CheckCircle className="w-5 h-5" style={{ color: '#10B3D6' }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Application Status
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Track the status of all your job applications in real-time
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e0f2fe' }}>
                                        <Calendar className="w-5 h-5" style={{ color: '#0284c7' }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Interview Schedule
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Manage interview schedules and important dates
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/employee/jobs">
                                    <Button 
                                        className="text-white px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] w-full sm:w-auto"
                                        style={{ 
                                            background: 'linear-gradient(to right, #10B3D6, #0891b2)',
                                            '&:hover': { background: 'linear-gradient(to right, #0e9bb8, #0e7490)' }
                                        }}
                                    >
                                        <Briefcase className="w-5 h-5 mr-2" />
                                        Browse Jobs
                                    </Button>
                                </Link>
                                
                                <Link href="/employee/dashboard">
                                    <Button 
                                        variant="outline" 
                                        className="border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Back to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center mt-8">
                        <p className="text-gray-500 text-sm">
                            In the meantime, you can continue browsing and applying for jobs.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
