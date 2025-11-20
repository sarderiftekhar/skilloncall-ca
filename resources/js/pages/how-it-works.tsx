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

                                {/* Flowing Infographic Design */}
                                <div className="relative w-full max-w-6xl mx-auto py-12 px-4 min-h-[1400px] md:min-h-[950px]">
                                    {/* SVG Wave Path Background */}
                                    <svg 
                                        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" 
                                        viewBox="0 0 1200 950" 
                                        preserveAspectRatio="xMidYMid meet"
                                    >
                                        <defs>
                                            <linearGradient id="pathGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: '#14B8A6', stopOpacity: 0.5 }} />
                                                <stop offset="25%" style={{ stopColor: '#F59E0B', stopOpacity: 0.5 }} />
                                                <stop offset="50%" style={{ stopColor: '#EF4444', stopOpacity: 0.5 }} />
                                                <stop offset="75%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.5 }} />
                                                <stop offset="100%" style={{ stopColor: '#10B3D6', stopOpacity: 0.5 }} />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M 1000 40 Q 900 30, 800 60 Q 650 100, 500 80 Q 350 60, 200 100 Q 100 140, 80 220 Q 60 300, 100 390 Q 150 480, 280 540 Q 400 600, 600 580 Q 750 560, 900 620 Q 1000 660, 1100 740 Q 1150 800, 1150 900"
                                            fill="none"
                                            stroke="url(#pathGradient1)"
                                            strokeWidth="70"
                                            strokeLinecap="round"
                                            opacity="0.3"
                                        />
                                    </svg>

                                    {/* Step Containers */}
                                    <div className="relative z-10 space-y-8 md:space-y-0" style={{ height: '100%', minHeight: '900px' }}>
                                        {(activeTab === 'employers' ? employerSteps : employeeSteps).map((step, index) => {
                                            const Icon = step.icon;
                                            
                                            // Colors for each step matching the sample
                                            const colors = [
                                                { bg: '#14B8A6', shadow: 'rgba(20, 184, 166, 0.3)', light: '#5EEAD4' }, // Teal
                                                { bg: '#F59E0B', shadow: 'rgba(245, 158, 11, 0.3)', light: '#FCD34D' }, // Amber
                                                { bg: '#EF4444', shadow: 'rgba(239, 68, 68, 0.3)', light: '#FCA5A5' }, // Red/Orange
                                                { bg: '#8B5CF6', shadow: 'rgba(139, 92, 246, 0.3)', light: '#C4B5FD' }, // Purple
                                                { bg: '#10B3D6', shadow: 'rgba(16, 179, 214, 0.3)', light: '#67E8F9' }, // Cyan
                                            ];
                                            
                                            const color = colors[index];
                                            
                                            // Positioning for flowing layout - All 5 steps visible, no overlaps
                                            // Steps 3, 4, 5 moved down more for better visibility
                                            const positionStyles = [
                                                { top: '0%', right: '25%', zIndex: 15 },     // Step 1 - top right (moved more left)
                                                { top: '12%', left: '8%', zIndex: 14 },      // Step 2 - upper left  
                                                { top: '28%', right: '10%', zIndex: 13 },   // Step 3 - middle right (moved down)
                                                { top: '44%', left: '6%', zIndex: 12 },      // Step 4 - lower left (moved down)
                                                { top: '60%', right: '12%', zIndex: 11 },   // Step 5 - bottom right (moved down)
                                            ];
                                            
                                            const pos = positionStyles[index];
                                            
                                            return (
                                                <div
                                                    key={index}
                                                    className="md:absolute md:w-[280px]"
                                                    style={{
                                                        top: pos.top,
                                                        left: pos.left || 'auto',
                                                        right: pos.right || 'auto',
                                                        zIndex: pos.zIndex,
                                                        animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
                                                        willChange: 'transform'
                                                    }}
                                                >
                                                    {/* Flowing wave-shaped container */}
                                                    <div 
                                                        className="relative p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${color.bg} 0%, ${color.light} 100%)`,
                                                            boxShadow: `0 10px 30px ${color.shadow}, 0 0 0 4px rgba(255, 255, 255, 0.6)`,
                                                            border: '3px solid rgba(255, 255, 255, 0.9)'
                                                        }}
                                                    >
                                                        {/* Step Number Badge */}
                                                        <div 
                                                            className="absolute -top-5 -left-5 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                                                            style={{
                                                                backgroundColor: '#192341',
                                                                border: '4px solid white'
                                                            }}
                                                        >
                                                            {String(index + 1).padStart(2, '0')}
                                                        </div>
                                                        
                                                        {/* Icon Badge */}
                                                        <div 
                                                            className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                                                            style={{
                                                                backgroundColor: 'white',
                                                                border: `3px solid ${color.bg}`
                                                            }}
                                                        >
                                                            <Icon className="h-6 w-6" style={{color: color.bg}} />
                                                        </div>
                                                        
                                                        {/* Content */}
                                                        <div className="pt-6 pb-4">
                                                            <h3 className="text-lg md:text-xl font-bold mb-3 text-white drop-shadow-md">
                                                                {step.title}
                                                            </h3>
                                                            <p className="text-sm text-white/95 leading-relaxed">
                                                                {step.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Decorative connecting dots */}
                                                    {index < 4 && (
                                                        <div className="hidden md:block absolute" 
                                                            style={{
                                                                top: '50%',
                                                                left: index % 2 === 0 ? '-10%' : 'auto',
                                                                right: index % 2 === 1 ? '-10%' : 'auto',
                                                            }}
                                                        >
                                                            <div className={`flex gap-2 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                                                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: color.bg, opacity: 0.7}}></div>
                                                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: color.bg, opacity: 0.5}}></div>
                                                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: color.bg, opacity: 0.3}}></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Conclusion Badge */}
                                    <div className="relative z-10 mt-12 md:mt-0 md:absolute md:top-[78%] md:left-1/2 md:-translate-x-1/2 flex flex-col items-center gap-24">
                                        <div 
                                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full shadow-xl"
                                            style={{
                                                background: 'linear-gradient(135deg, #192341 0%, #2D3E6F 100%)',
                                                border: '3px solid white'
                                            }}
                                        >
                                            <CheckCircle className="h-6 w-6 text-[#10B3D6]" />
                                            <span className="text-white font-bold text-lg">
                                                {t('how_it_works.conclusion', 'Conclusion')}
                                            </span>
                                        </div>
                                        
                                        {/* CTA Button - Moved closer to conclusion */}
                                        <Link href={auth?.user ? `/dashboard${queryLang}` : `/register${queryLang}`}>
                                            <Button 
                                                className="text-white hover:opacity-90 cursor-pointer"
                                                style={{ backgroundColor: '#10B3D6', height: '2.7em', paddingLeft: '2rem', paddingRight: '2rem' }}
                                            >
                                                {activeTab === 'employers'
                                                    ? t('how_it_works.cta.employers', 'Start Recruiting Skilled Employees')
                                                    : t('how_it_works.cta.employees', 'Start Finding Extra Shifts')
                                                }
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                
                                <style jsx>{`
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
                                `}</style>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="pt-8 pb-16" style={{backgroundColor: '#FCF2F0'}}>
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

