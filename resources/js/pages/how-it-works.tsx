import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
    UserPlus, 
    FileText, 
    Search, 
    MessageCircle, 
    CheckCircle,
    Shield,
    Zap,
    Calendar,
    Headphones
} from 'react-feather';
import { useState } from 'react';

export default function HowItWorks() {
    const { auth } = usePage<SharedData>().props as any;
    const { t, locale } = useTranslations();
    const isFrench = locale === 'fr';
    const queryLang = `?lang=${locale}`;

    const [activeTab, setActiveTab] = useState<'employers' | 'employees'>('employers');

    const switchLang = (newLocale: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', newLocale);
        window.location.href = url.toString();
    };

    const employerSteps = [
        {
            icon: UserPlus,
            title: t('how_it_works.employers.step1.title', 'Create Your Account'),
            description: t('how_it_works.employers.step1.description', 'Sign up as an employer and complete your business profile. Verify your business to build trust with workers.'),
        },
        {
            icon: FileText,
            title: t('how_it_works.employers.step2.title', 'Post Your Job'),
            description: t('how_it_works.employers.step2.description', 'Create a detailed job posting with requirements, location, budget, and schedule. Your first job posting is free!'),
        },
        {
            icon: Search,
            title: t('how_it_works.employers.step3.title', 'Review Applications'),
            description: t('how_it_works.employers.step3.description', 'Receive applications from qualified workers. Review their profiles, skills, ratings, and availability.'),
        },
        {
            icon: MessageCircle,
            title: t('how_it_works.employers.step4.title', 'Connect & Interview'),
            description: t('how_it_works.employers.step4.description', 'Message workers directly through our platform to discuss details, negotiate terms, and schedule interviews.'),
        },
        {
            icon: CheckCircle,
            title: t('how_it_works.employers.step5.title', 'Hire & Get Started'),
            description: t('how_it_works.employers.step5.description', 'Select the best candidate and mark them as hired. Start working together and build your team!'),
        },
    ];

    const employeeSteps = [
        {
            icon: UserPlus,
            title: t('how_it_works.employees.step1.title', 'Create Your Profile'),
            description: t('how_it_works.employees.step1.description', 'Sign up as an employee and build your professional profile. Add your skills, experience, certifications, and availability.'),
        },
        {
            icon: Search,
            title: t('how_it_works.employees.step2.title', 'Browse Jobs'),
            description: t('how_it_works.employees.step2.description', 'Search and filter job opportunities by location, category, skills, and schedule. Find jobs that match your expertise.'),
        },
        {
            icon: FileText,
            title: t('how_it_works.employees.step3.title', 'Apply to Jobs'),
            description: t('how_it_works.employees.step3.description', 'Express interest in jobs that fit your skills. Employers will see your profile and can contact you directly.'),
        },
        {
            icon: MessageCircle,
            title: t('how_it_works.employees.step4.title', 'Get Contacted'),
            description: t('how_it_works.employees.step4.description', 'Receive messages from interested employers. Discuss job details, rates, and schedules through our secure messaging system.'),
        },
        {
            icon: CheckCircle,
            title: t('how_it_works.employees.step5.title', 'Get Hired & Work'),
            description: t('how_it_works.employees.step5.description', 'Once hired, complete the work and build your reputation. Get paid directly by employers and grow your career!'),
        },
    ];

    const features = [
        {
            icon: Shield,
            title: t('how_it_works.features.secure.title', 'Secure & Verified'),
            description: t('how_it_works.features.secure.description', 'All users are verified with identity checks. Secure messaging keeps your information private.'),
        },
        {
            icon: Zap,
            title: t('how_it_works.features.fast.title', 'Fast Matching'),
            description: t('how_it_works.features.fast.description', 'Connect with local workers or employers quickly. Our platform makes finding the right match easy.'),
        },
        {
            icon: Calendar,
            title: t('how_it_works.features.flexible.title', 'Flexible Work'),
            description: t('how_it_works.features.flexible.description', 'Choose your schedule and work on your terms. Perfect for gig work, part-time, and contract opportunities.'),
        },
        {
            icon: Headphones,
            title: t('how_it_works.features.support.title', '24/7 Support'),
            description: t('how_it_works.features.support.description', 'Our Canadian support team is here to help you succeed. Get assistance whenever you need it.'),
        },
    ];

    return (
        <>
            <Head title={t('how_it_works.title', 'How It Works')} />

            <div className="min-h-screen" style={{backgroundColor: '#F6FBFD'}}>
                {/* Header */}
                <header style={{backgroundColor: '#192341'}} className="shadow-sm border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex items-center">
                                <Link href={`/${queryLang}`} className="flex-shrink-0 flex items-center cursor-pointer">
                                    <img 
                                        src="/logo-white.png" 
                                        alt="SkillOnCall Logo" 
                                        className="w-8 h-8 mr-3"
                                    />
                                    <span className="text-xl font-bold text-white">SkillOnCall</span>
                                    <span className="ml-1" style={{color: '#10B3D6'}}>.ca</span>
                                </Link>
                            </div>

                            {/* Navigation */}
                            <nav className="hidden md:flex space-x-8">
                                <Link href={`/${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.find_employees')}</Link>
                                <Link href={`/${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.post_jobs')}</Link>
                                <Link href={`/how-it-works${queryLang}`} className="text-white font-semibold cursor-pointer transition-colors">{t('nav.how_it_works')}</Link>
                                <Link href={`/${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.pricing')}</Link>
                            </nav>

                            {/* User Menu */}
                            <div className="flex items-center space-x-3 md:space-x-4">
                                {/* Language Switcher */}
                                <div className="flex items-center space-x-1 border border-gray-600 rounded-md overflow-hidden">
                                    <button 
                                        onClick={() => switchLang('en')} 
                                        className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                                            locale === 'en' 
                                                ? 'bg-white text-gray-900' 
                                                : 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        EN
                                    </button>
                                    <button 
                                        onClick={() => switchLang('fr')} 
                                        className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                                            locale === 'fr' 
                                                ? 'bg-white text-gray-900' 
                                                : 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        FR
                                    </button>
                                </div>

                                {auth?.user ? (
                                    <Link 
                                        href={`/dashboard${queryLang}`}
                                        className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                                    >
                                        {t('auth.dashboard')}
                                    </Link>
                                ) : (
                                    <>
                                        <Link 
                                            href={`/login${queryLang}`}
                                            className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                                        >
                                            {t('auth.sign_in')}
                                        </Link>
                                        <Link 
                                            href={`/register${queryLang}`}
                                            className="text-white px-4 py-2 rounded-md cursor-pointer transition-all hover:opacity-90"
                                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                        >
                                            {t('auth.get_started')}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main>
                    {/* Hero Section */}
                    <section className="py-16 md:py-24">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4" style={{color: '#192341'}}>
                                    {t('how_it_works.title', 'How It Works')}
                                </h1>
                                <p className="text-lg font-semibold mb-4" style={{color: '#10B3D6'}}>
                                    {t('how_it_works.subtitle', 'Canada\'s premier platform for finding and recruiting skilled workers')}
                                </p>
                                <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    {t('how_it_works.intro', 'SkillOnCall.ca is specifically designed to connect Canadian businesses with skilled workers. Whether you\'re an employer looking to recruit talented professionals or a skilled worker seeking extra shifts and opportunities in your field, we make the connection simple and efficient.')}
                                </p>
                            </div>

                            {/* Tab Switcher */}
                            <div className="flex justify-center mb-12">
                                <div className="inline-flex rounded-lg p-1 bg-white shadow-sm border border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('employers')}
                                        className={`px-6 py-3 rounded-md font-semibold transition-all cursor-pointer ${
                                            activeTab === 'employers'
                                                ? 'text-white'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                        style={{
                                            backgroundColor: activeTab === 'employers' ? '#10B3D6' : 'transparent',
                                            height: '2.7em'
                                        }}
                                    >
                                        {t('how_it_works.for_employers', 'For Employers')}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('employees')}
                                        className={`px-6 py-3 rounded-md font-semibold transition-all cursor-pointer ${
                                            activeTab === 'employees'
                                                ? 'text-white'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                        style={{
                                            backgroundColor: activeTab === 'employees' ? '#10B3D6' : 'transparent',
                                            height: '2.7em'
                                        }}
                                    >
                                        {t('how_it_works.for_employees', 'For Employees')}
                                    </button>
                                </div>
                            </div>

                            {/* Steps Section */}
                            <div className="mb-16">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{color: '#192341'}}>
                                        {activeTab === 'employers' 
                                            ? t('how_it_works.employers.title', 'Find & Recruit Skilled Workers in 5 Simple Steps')
                                            : t('how_it_works.employees.title', 'Find Extra Shifts & Work in Your Field in 5 Simple Steps')
                                        }
                                    </h2>
                                    <p className="text-base text-gray-600 max-w-2xl mx-auto">
                                        {activeTab === 'employers'
                                            ? t('how_it_works.employers.description', 'Post your job openings and connect with qualified skilled workers who match your requirements. Recruit the talent you need quickly and efficiently.')
                                            : t('how_it_works.employees.description', 'Discover opportunities in your line of work. Find extra shifts, part-time work, and contract opportunities that match your skills and expertise.')
                                        }
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                    {(activeTab === 'employers' ? employerSteps : employeeSteps).map((step, index) => {
                                        const Icon = step.icon;
                                        return (
                                            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                                <div className="absolute inset-x-0 top-0 h-1.5 bg-[#10B3D6]"></div>
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col items-center text-center">
                                                        <div className="mb-4 p-4 rounded-full" style={{backgroundColor: '#F6FBFD'}}>
                                                            <Icon className="h-8 w-8" style={{color: '#10B3D6'}} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm" style={{backgroundColor: '#10B3D6'}}>
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-semibold mb-2" style={{color: '#192341'}}>
                                                            {step.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* CTA Section */}
                            <div className="text-center">
                                <Link href={`/register${queryLang}`}>
                                    <Button 
                                        className="text-white hover:opacity-90 cursor-pointer"
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em', paddingLeft: '2rem', paddingRight: '2rem' }}
                                    >
                                        {activeTab === 'employers'
                                            ? t('how_it_works.cta.employers', 'Start Recruiting Skilled Workers')
                                            : t('how_it_works.cta.employees', 'Start Finding Extra Shifts')
                                        }
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-16" style={{backgroundColor: '#FCF2F0'}}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{color: '#192341'}}>
                                {t('how_it_works.features.title', 'Why Choose SkillOnCall.ca?')}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                                            <CardContent className="p-6">
                                                <div className="mb-4 flex justify-center">
                                                    <div className="p-4 rounded-full" style={{backgroundColor: '#F6FBFD'}}>
                                                        <Icon className="h-7 w-7" style={{color: '#10B3D6'}} />
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2" style={{color: '#192341'}}>
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="w-full py-12 text-white" style={{ backgroundColor: '#10B3D6' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-sm mb-2">
                                {t('footer.copyright', 'All rights reserved. Made with 🍁 in Canada.')}
                            </p>
                            <p className="text-xs opacity-90">
                                {t('footer.platform_description', 'Canada\'s premier platform for connecting skilled employees with local businesses. Built for Canadians, by Canadians.')}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

