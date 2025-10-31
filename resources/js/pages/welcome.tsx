// Temporarily using simple route strings to fix import issues
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { PrivacyPolicyModal } from '@/components/privacy-policy-modal';
import { TermsModal } from '@/components/terms-modal';
import { ContactModal } from '@/components/contact-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Users, 
    MapPin, 
    Clock, 
    Star, 
    Coffee,
    Tool,
    Shield,
    TrendingUp,
    MessageSquare,
    Heart,
    Search,
    Bell,
    Plus,
    Triangle,
    ShoppingCart
} from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

export default function Welcome() {
    const { auth, isProfileComplete } = usePage<SharedData>().props as any;
    const { t, locale } = useTranslations();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleCategoryClick = (categoryName: string) => {
        if (auth.user) {
            // User is logged in, redirect to category page
            window.location.href = `/categories/${categoryName.toLowerCase().replace(' ', '-')}`;
        } else {
            // User not logged in, show auth modal
            setSelectedCategory(categoryName);
            setShowAuthModal(true);
        }
    };

    const handleNewsletterSubscribe = async () => {
        if (!email.trim()) {
            alert('Please enter your email address');
            return;
        }

        setIsSubscribing(true);
        
        try {
            // Send newsletter subscription email
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    name: 'Newsletter Subscriber',
                    email: email,
                    phone: '',
                    message: 'Newsletter Subscription Request - Please add me to the SkillOnCall.ca newsletter to receive updates about new job opportunities, platform features, and industry news.'
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Thank you for subscribing to our newsletter!\n\nYou\'ll receive updates about new job opportunities and platform features.');
                setEmail('');
            } else {
                alert('Failed to subscribe. Please try again.');
            }
        } catch (error) {
            alert('Failed to subscribe. Please try again.');
        } finally {
            setIsSubscribing(false);
        }
    };

    const skillCategories = [
        { name: 'Food Service', icon: Coffee, count: '453 Workers', color: 'text-white', bgColor: '#10B3D6', image: '/images/sprites/com_1.png' },
        { name: 'Retail', icon: ShoppingCart, count: '324 Workers', color: 'text-gray-800', bgColor: '#FCF2F0', image: '/images/sprites/com_2.png' },
        { name: 'Grocery', icon: ShoppingCart, count: '267 Workers', color: 'text-white', bgColor: '#10B3D6', image: '/images/sprites/com_3.png' },
        { name: 'Hospitality', icon: Coffee, count: '189 Workers', color: 'text-gray-800', bgColor: '#FCF2F0', image: '/images/sprites/com_sm.png' },
        { name: 'Maintenance', icon: Tool, count: '145 Workers', color: 'text-white', bgColor: '#10B3D6', image: '/images/sprites/com_1.png' },
        { name: 'Security', icon: Shield, count: '98 Workers', color: 'text-gray-800', bgColor: '#FCF2F0', image: '/images/sprites/com_2.png' },
    ];

    const statistics = [
        { label: t('stats.active_workers', 'Active Workers'), value: '2,450', change: '+12%', color: 'text-green-600' },
        { label: t('stats.jobs_posted', 'Jobs Posted'), value: '1,230', change: '+8%', color: 'text-blue-600' },
        { label: t('stats.successful_matches', 'Successful Matches'), value: '980', change: '+15%', color: 'text-purple-600' },
        { label: t('stats.verified_employers', 'Verified Employers'), value: '340', change: '+5%', color: 'text-orange-600' },
    ];

    const recentPosts = [
        {
            title: 'Urgent: Evening shift cashier needed at downtown grocery store',
            author: 'Metro Foods',
            time: '2 hours ago',
            responses: 12,
            likes: 8,
            type: 'Urgent'
        },
        {
            title: 'Weekend barista position available - flexible hours',
            author: 'Bean There Coffee',
            time: '4 hours ago', 
            responses: 6,
            likes: 15,
            type: 'Flexible'
        },
        {
            title: 'Part-time retail associate for clothing store',
            author: 'Style Central',
            time: '6 hours ago',
            responses: 9,
            likes: 11,
            type: 'Part-time'
        }
    ];

    const floatingAvatars = [
        // Spread left → right following the wave arc (responsive positioning)
        { id: 1, src: '/images/sprites/bn5.jpg', initials: 'KW', position: 'bottom-[20%] left-[3%] xl:bottom-[25%] xl:left-[2%]', size: 'h-16 w-16 xl:h-18 xl:w-18', decoration: 'bg-purple-300', decorationSize: 'w-7 h-7 xl:w-8 xl:h-8' },
        { id: 2, src: '/images/sprites/bn4.jpg', initials: 'AL', position: 'bottom-[15%] left-[16%] xl:bottom-[18%] xl:left-[14%]', size: 'h-16 w-16 xl:h-18 xl:w-18', decoration: 'bg-green-300', decorationSize: 'w-7 h-7 xl:w-8 xl:h-8' },
        { id: 3, src: '/images/sprites/bn1.jpg', initials: 'SA', position: 'bottom-[25%] left-[28%] xl:bottom-[30%] xl:left-[26%]', size: 'h-20 w-20 xl:h-24 xl:w-24', decoration: 'bg-pink-300', decorationSize: 'w-8 h-8 xl:w-10 xl:h-10' },
        { id: 4, src: '/images/sprites/bn8.jpg', initials: 'CN', position: 'bottom-[12%] left-[42%] xl:bottom-[15%] xl:left-[40%]', size: 'h-15 w-15 xl:h-17 xl:w-17', decoration: 'bg-teal-300', decorationSize: 'w-6 h-6 xl:w-7 xl:h-7' },
        { id: 5, src: '/images/sprites/bn3.jpg', initials: 'MR', position: 'bottom-[35%] left-1/2 -translate-x-1/2 xl:bottom-[40%]', size: 'h-28 w-28 xl:h-36 xl:w-36', decoration: 'bg-cyan-300', decorationSize: 'w-12 h-12 xl:w-16 xl:h-16' },
        { id: 6, src: '/images/sprites/bn6.jpg', initials: 'TR', position: 'bottom-[12%] left-[58%] xl:bottom-[15%] xl:left-[60%]', size: 'h-15 w-15 xl:h-17 xl:w-17', decoration: 'bg-yellow-300', decorationSize: 'w-6 h-6 xl:w-7 xl:h-7' },
        { id: 7, src: '/images/sprites/bn2.jpg', initials: 'JM', position: 'bottom-[25%] left-[68%] xl:bottom-[30%] xl:left-[70%]', size: 'h-20 w-20 xl:h-24 xl:w-24', decoration: 'bg-cyan-300', decorationSize: 'w-8 h-8 xl:w-10 xl:h-10' },
        { id: 8, src: '/images/sprites/bn7.jpg', initials: 'BM', position: 'bottom-[15%] left-[84%] xl:bottom-[18%] xl:left-[86%]', size: 'h-16 w-16 xl:h-18 xl:w-18', decoration: 'bg-orange-300', decorationSize: 'w-7 h-7 xl:w-8 xl:h-8' },
        { id: 9, src: '/images/sprites/bn9.jpg', initials: 'DL', position: 'bottom-[25%] left-[92%] xl:bottom-[30%] xl:left-[94%]', size: 'h-16 w-16 xl:h-18 xl:w-18', decoration: 'bg-indigo-300', decorationSize: 'w-7 h-7 xl:w-8 xl:h-8' },
        { id: 10, src: '/images/sprites/bn10.jpg', initials: 'EM', position: 'bottom-[5%] right-[0.1%] xl:bottom-[8%] xl:right-[0.05%]', size: 'h-12 w-12 xl:h-14 xl:w-14', decoration: 'bg-rose-300', decorationSize: 'w-5 h-5 xl:w-6 xl:h-6' },
    ];

    const floatingShapes = [
        { type: 'dot', color: 'bg-green-400', size: 'w-3 h-3', position: 'bottom-[18%] left-[10%]' },
        { type: 'dot', color: 'bg-pink-400', size: 'w-2 h-2', position: 'bottom-[8%] right-[15%]' },
        { type: 'dot', color: 'bg-blue-400', size: 'w-4 h-4', position: 'bottom-[14%] left-[12%]' },
        { type: 'dot', color: 'bg-yellow-400', size: 'w-3 h-3', position: 'bottom-[10%] right-[12%]' },
        { type: 'dot', color: 'bg-purple-400', size: 'w-2 h-2', position: 'bottom-[16%] right-[18%]' },
        { type: 'dot', color: 'bg-cyan-400', size: 'w-3 h-3', position: 'bottom-[12%] left-[35%]' },
        { type: 'plus', color: 'text-green-500', size: 'w-6 h-6', position: 'bottom-[14%] left-[18%]' },
        { type: 'star', color: 'text-purple-500', size: 'w-4 h-4', position: 'bottom-[8%] right-[10%]' },
        { type: 'triangle', color: 'text-blue-500', size: 'w-5 h-5', position: 'bottom-[12%] right-[25%]' },
        { type: 'dot', color: 'bg-orange-400', size: 'w-2 h-2', position: 'bottom-[10%] left-[8%]' },
        { type: 'dot', color: 'bg-indigo-400', size: 'w-3 h-3', position: 'bottom-[16%] left-[20%]' },
        { type: 'dot', color: 'bg-rose-400', size: 'w-4 h-4', position: 'bottom-[8%] right-[8%]' },
    ];

    const switchLang = (next: 'en' | 'fr') => {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        window.location.href = url.toString();
    };

    const queryLang = `?lang=${locale}`;

    return (
        <>
            <Head title="Welcome to SkillOnCall.ca">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer, 
                    [onclick], [onClick], .group, .hover\\:shadow-md,
                    .hover\\:text-white, .hover\\:opacity-90,
                    .transition-colors, .transition-transform { cursor: pointer !important; }
                    
                    /* Ensure entire card area has pointer cursor */
                    .group[onclick], .group[onClick] { cursor: pointer !important; }
                    .group[onclick] *, .group[onClick] * { cursor: inherit !important; }
                    
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        33% { transform: translateY(-10px) rotate(1deg); }
                        66% { transform: translateY(-5px) rotate(-1deg); }
                    }
                    
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0px) scale(1); }
                        50% { transform: translateY(-5px) scale(1.05); }
                    }
                `}</style>
            </Head>

            <div className="min-h-screen" style={{backgroundColor: '#F6FBFD'}}>
                {/* Header */}
                <header style={{backgroundColor: '#192341'}} className="shadow-sm border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <img 
                                        src="/logo-white.png" 
                                        alt="SkillOnCall Logo" 
                                        className="w-8 h-8 mr-3"
                                    />
                                    <span className="text-xl font-bold text-white">SkillOnCall</span>
                                    <span className="ml-1" style={{color: '#10B3D6'}}>.ca</span>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="hidden md:flex space-x-8">
                                <a href={`/${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.find_employees')}</a>
                                <a href={`/${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.post_jobs')}</a>
                                <a href={`/${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.how_it_works')}</a>
                                <a href={`/${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.pricing')}</a>
                            </nav>

                            {/* User Menu */}
                            <div className="flex items-center space-x-3 md:space-x-4">
                                {/* Language Switcher - Always Visible */}
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
                        {auth.user ? (
                                    <div className="flex items-center space-x-3">
                                        <Bell className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                                        <Avatar className="h-8 w-8 cursor-pointer">
                                            <AvatarImage src="" />
                                            <AvatarFallback className="text-white text-xs" style={{backgroundColor: '#10B3D6'}}>
                                                {auth.user.name?.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        {isProfileComplete ? (
                                            <Link href={`/dashboard${queryLang}`}>
                                                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400">{t('auth.dashboard', 'Dashboard')}</Button>
                                            </Link>
                                        ) : (
                                            <Link href={`/worker/onboarding${queryLang}`}>
                                                <Button size="sm" style={{backgroundColor: '#10B3D6'}} className="hover:opacity-90 text-white">{t('auth.complete_profile', 'Complete Profile')}</Button>
                                            </Link>
                                        )}
                            </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link href={`/login${queryLang}`}>
                                            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">{t('auth.sign_in', 'Sign In')}</Button>
                                </Link>
                                        <Link href={`/register${queryLang}`}>
                                            <Button size="sm" style={{backgroundColor: '#10B3D6'}} className="hover:opacity-90 text-white">{t('auth.get_started', 'Get Started')}</Button>
                                </Link>
                                    </div>
                        )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative pt-24 md:pt-32 pb-0 overflow-visible min-h-[90vh] h-[90vh]" style={{background: 'linear-gradient(135deg, #f8f4f0 0%, #f0ece8 50%, #ede6e0 100%)'}}>
                    {/* Background Shape - At Bottom Edge of Hero */}
                    <div 
                        className="absolute bottom-0 left-0 right-0 h-32 bg-no-repeat bg-center bg-cover z-30 border-0"
                        style={{
                            backgroundImage: `url('/images/sprites/banner-bottom-shape.png')`,
                            backgroundSize: '100% 100%',
                            border: '0px solid transparent',
                            outline: '0px solid transparent',
                            boxShadow: 'none',
                            filter: 'none'
                        }}
                    ></div>
                    
                    {/* Bottom Overlay for Floating Elements (confined to lower two-thirds of hero) */}
                    <div className="absolute inset-x-0 bottom-0 h-3/4 z-40 pointer-events-none">
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                            {/* Floating Decorative Shapes */}
                            {floatingShapes.map((shape, index) => (
                                <div key={`shape-${index}`} className={`absolute hidden lg:block ${shape.position} z-20`} style={{
                                    animation: `bounce 3s ease-in-out infinite`,
                                    animationDelay: `${index * 0.2}s`
                                }}>
                                    {shape.type === 'dot' && (
                                        <div className={`rounded-full ${shape.color} ${shape.size} opacity-80`}></div>
                                    )}
                                    {shape.type === 'plus' && (
                                        <Plus className={`${shape.color} ${shape.size} drop-shadow-lg`} />
                                    )}
                                    {shape.type === 'star' && (
                                        <Star className={`${shape.color} ${shape.size} fill-current drop-shadow-lg`} />
                                    )}
                                    {shape.type === 'triangle' && (
                                        <Triangle className={`${shape.color} ${shape.size} fill-current drop-shadow-lg`} />
                                    )}
                                </div>
                            ))}

                            {/* Floating Avatars with Decorations */}
                            {floatingAvatars.map((avatar, index) => (
                                <div key={`avatar-${avatar.id ?? index}`} data-avatar-id={avatar.id ?? index} className={`absolute hidden lg:block ${avatar.position} z-20`} style={{
                                    animation: `float 6s ease-in-out infinite`,
                                    animationDelay: `${index * 0.5}s`
                                }}>
                                    <div className="relative group">
                                        {/* Decorative colored circle behind avatar */}
                                        <div className={`absolute -bottom-3 -right-2 ${avatar.decorationSize ?? 'w-8 h-8'} rounded-full ${avatar.decoration} opacity-70 group-hover:scale-110 transition-transform duration-300`}></div>
                                        <Avatar className={`${avatar.size ?? 'h-20 w-20'} border-4 border-white shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-300`}>
                                            <AvatarImage src={avatar.src} alt="Worker" className="object-cover" />
                                            <AvatarFallback className="text-white text-sm font-semibold" style={{backgroundColor: '#10B3D6'}}>
                                                {avatar.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
                        {/* Main Content - Centered in Upper-Middle Area */}
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center relative z-20 max-w-4xl mx-auto">
                                <div className="mb-6 flex justify-center">
                                    <img 
                                        src="/images/mapple-leaf.png" 
                                        alt="Canadian Maple Leaf" 
                                        className="w-24 h-24 md:w-32 md:h-32 object-contain"
                                    />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{color: '#192341'}}>
                                    {t('hero.title', 'SkillOnCall — Where Skills Meet Opportunity')}
                                </h1>
                                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                    {t('hero.subtitle', 'Find answers, ask questions, and connect with our community of skilled workers from around Canada.')}
                                </p>
                                
                                {/* Prominent Search Bar - KbDoc Style - HIDDEN FOR NOW */}
                                {/* <div className="mb-12 max-w-2xl mx-auto">
                                    <div className="relative group">
                                        <Input 
                                            type="text" 
                                            placeholder="Search or ask a question..." 
                                            className="w-full h-12 md:h-14 pl-6 pr-20 text-lg md:text-xl rounded-full border-0 transition-all duration-200"
                                            style={{
                                                backgroundColor: '#FFFFFF', 
                                                boxShadow: '0 15px 40px rgba(16, 179, 214, 0.15)'
                                            }}
                                        />
                                        <Button 
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 md:h-10 md:w-10 flex items-center justify-center hover:opacity-90 transition-all duration-200 cursor-pointer"
                                            style={{backgroundColor: '#10B3D6'}}
                                        >
                                            <Search className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                        </Button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Subscription CTA Section */}
                <section className="py-12" style={{backgroundColor: '#192341'}}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                                Ready to Take Your Career to the Next Level?
                            </h2>
                            <p className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto">
                                Join thousands of professionals who've upgraded their SkillOnCall experience with our premium plans.
                            </p>
                        </div>
                        
                        {/* Feature Grid */}
                        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-8 max-w-6xl mx-auto">
                            {/* Employers Column */}
                            <div className="flex items-center justify-center">
                                <div className="text-left">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" 
                                             style={{backgroundColor: '#10B3D6'}}>
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-white">
                                            {t('employers.title', 'For Employers')}
                                        </h3>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-center">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0" 
                                                 style={{backgroundColor: '#10B3D6'}}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                            </div>
                                            <span className="text-gray-200 text-sm md:text-base">{t('employers.unlimited_posts', 'Unlimited job postings')}</span>
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0" 
                                                 style={{backgroundColor: '#10B3D6'}}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                            </div>
                                            <span className="text-gray-200 text-sm md:text-base">{t('employers.featured', 'Featured listings & priority placement')}</span>
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0" 
                                                 style={{backgroundColor: '#10B3D6'}}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                            </div>
                                            <span className="text-gray-200 text-sm md:text-base">{t('employers.analytics', 'Advanced analytics & reporting')}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            {/* Workers Column */}
                            <div className="flex items-center justify-center">
                                <div className="text-left">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" 
                                             style={{backgroundColor: '#10B3D6'}}>
                                            <Star className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-white">
                                            {t('workers.title', 'For Workers')}
                                        </h3>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-center">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0" 
                                                 style={{backgroundColor: '#10B3D6'}}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                            </div>
                                            <span className="text-gray-200 text-sm md:text-base">{t('workers.unlimited_apps', 'Unlimited job applications')}</span>
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0" 
                                                 style={{backgroundColor: '#10B3D6'}}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                            </div>
                                            <span className="text-gray-200 text-sm md:text-base">{t('workers.featured', 'Featured profile & priority visibility')}</span>
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0" 
                                                 style={{backgroundColor: '#10B3D6'}}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                            </div>
                                            <span className="text-gray-200 text-sm md:text-base">{t('workers.portfolio', 'Advanced portfolio tools')}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                            <Link href={`/subscriptions${queryLang}`} className="w-full sm:w-auto">
                                <Button 
                                    size="lg" 
                                    className="w-full sm:w-auto text-white hover:opacity-90 px-10 py-6 text-base font-semibold cursor-pointer transition-all shadow-lg hover:shadow-xl"
                                    style={{backgroundColor: '#10B3D6', height: '2.7em'}}
                                >
                                    {t('cta.view_plans', 'View Subscription Plans')}
                                </Button>
                            </Link>
                            <Button 
                                variant="outline" 
                                size="lg" 
                                className="w-full sm:w-auto border-2 bg-white/10 hover:bg-white/20 px-10 py-6 text-base font-medium cursor-pointer transition-all"
                                style={{borderColor: '#10B3D6', color: 'white', height: '2.7em'}}
                            >
                                {t('cta.learn_more', 'Learn More')}
                            </Button>
                        </div>
                        
                        {/* Footer Note */}
                        <div className="text-center">
                            <p className="text-xs md:text-sm text-gray-400">
                                Start with our free plan • Upgrade anytime • Cancel anytime
                            </p>
                        </div>
                    </div>
                </section>

                {/* Skills Categories Section */}
                <section className="pt-16 pb-12" style={{backgroundColor: '#FFFFFF'}}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4" style={{color: '#192341'}}>
                                {t('sections.find_sector', 'Find your employment sector')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {skillCategories.map((category, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => handleCategoryClick(category.name)}
                                    className="group relative cursor-pointer rounded-2xl border-0 bg-white p-8 shadow-[0_12px_28px_rgba(16,179,214,0.10)] transition-all hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(16,179,214,0.18)]"
                                    style={{cursor: 'pointer'}}
                                >
                                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-[#10B3D6] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    <div className="flex flex-col items-center text-center gap-4">
                                        <div className="h-16 w-16 rounded-full flex items-center justify-center shadow-sm" style={{backgroundColor: category.bgColor}}>
                                            <category.icon className={`h-7 w-7 ${category.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                                            <p className="mt-1 text-sm text-gray-600">{category.count}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Button size="lg" className="text-white hover:opacity-90 cursor-pointer" style={{backgroundColor: '#10B3D6'}}>
                                {t('cta.view_all_categories', 'View All Categories')}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="py-16" style={{backgroundColor: '#FCF2F0'}}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4" style={{color: '#192341'}}>
                                {t('sections.platform_performance', 'Platform Performance')}
                            </h2>
                            <p className="text-lg text-gray-600">
                                {t('sections.trusted', 'Trusted by businesses and workers across Canada')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {statistics.map((stat, index) => (
                                <Card 
                                    key={index} 
                                    className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2"
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                        border: '1px solid rgba(16, 179, 214, 0.1)'
                                    }}
                                >
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div 
                                                className="text-3xl font-bold transition-colors duration-300 group-hover:scale-110 transform"
                                                style={{color: '#10B3D6'}}
                                            >
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1 transition-colors duration-300 group-hover:text-gray-800">
                                                {stat.label}
                                            </div>
                                            <div className="text-sm font-medium mt-2 transition-all duration-300 group-hover:scale-105" style={{color: '#10B3D6'}}>
                                                <TrendingUp className="inline h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
                                                {stat.change}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recent Community Posts */}
                <section className="py-16" style={{backgroundColor: '#FFFFFF'}}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4" style={{color: '#192341'}}>
                                {t('sections.latest_jobs', 'Latest Job Opportunities')}
                            </h2>
                            <p className="text-lg text-gray-600">
                                {t('sections.recent_postings', 'Recent postings from employers across Canada')}
                            </p>
                        </div>

                        <div className="space-y-4 max-w-4xl mx-auto">
                            {recentPosts.map((post, index) => (
                                <Card 
                                    key={index} 
                                    className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2"
                                    style={{
                                        backgroundColor: '#F6FBFD', 
                                        borderColor: '#10B3D6', 
                                        borderWidth: '1px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Badge 
                                                        variant="secondary" 
                                                        className="transition-all duration-300 group-hover:scale-105"
                                                        style={{
                                                            backgroundColor: post.type === 'Urgent' ? '#FCF2F0' : 
                                                                            post.type === 'Flexible' ? '#10B3D6' : '#FCF2F0',
                                                            color: post.type === 'Urgent' ? '#10B3D6' :
                                                                   post.type === 'Flexible' ? '#FFFFFF' : '#10B3D6'
                                                        }}
                                                    >
                                                        {post.type}
                                                    </Badge>
                                                    <span className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-700">{post.time}</span>
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2 transition-colors duration-300 group-hover:opacity-90" style={{color: '#192341'}}>
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-3 transition-colors duration-300 group-hover:text-gray-800">Posted by {post.author}</p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <div className="flex items-center transition-all duration-300 group-hover:scale-105">
                                                        <MessageSquare className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110" style={{color: '#192341'}} />
                                                        <span className="transition-colors duration-300 group-hover:text-gray-700">{post.responses} responses</span>
                                                    </div>
                                                    <div className="flex items-center transition-all duration-300 group-hover:scale-105">
                                                        <Heart className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110" style={{color: '#ef4444'}} />
                                                        <span className="transition-colors duration-300 group-hover:text-gray-700">{post.likes} likes</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Button size="lg" className="text-white hover:opacity-90 cursor-pointer" style={{backgroundColor: '#10B3D6'}}>
                                {t('cta.view_all_jobs', 'View All Job Posts')}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="py-16" style={{backgroundColor: '#FCF2F0'}}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="mb-8">
                                <Avatar className="h-40 w-40 mx-auto mb-4">
                                    <AvatarImage src="/images/sprites/journalism.png" alt="CEO" />
                                    <AvatarFallback className="text-white text-4xl" style={{backgroundColor: '#10B3D6'}}>CM</AvatarFallback>
                                </Avatar>
                            </div>
                            <blockquote className="text-xl font-bold mb-6" style={{color: '#10B3D6'}}>
                                "SkillOnCall.ca has revolutionized how we connect Canadian businesses with skilled workers. 
                                The platform's focus on local communities and instant connectivity makes it invaluable for 
                                supporting Canada's workforce ecosystem."
                            </blockquote>
                            <div className="text-gray-600">
                                <p className="font-semibold" style={{color: '#192341'}}>Catherine Moreau</p>
                                <p>CEO, SkillOnCall.ca</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer with Newsletter */}
                <footer className="text-white py-12" style={{backgroundColor: '#10B3D6'}}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-2">
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0 flex items-center">
                                        <img 
                                            src="/logo-white.png" 
                                            alt="SkillOnCall Logo" 
                                            className="w-8 h-8 mr-3"
                                        />
                                        <span className="text-xl font-bold text-white">SkillOnCall</span>
                                        <span className="ml-1" style={{color: '#FCF2F0'}}>.ca</span>
                                    </div>
                                </div>
                                <p className="text-gray-100 mb-6 max-w-md">
                                    Canada's premier platform for connecting skilled workers with local businesses. 
                                    Built for Canadians, by Canadians.
                                </p>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">📧 {t('footer.newsletter', 'Newsletter Signup')}</h3>
                                    <p className="text-gray-200 text-sm mb-3">{t('footer.newsletter_hint', 'Get updates on new jobs, platform features, and industry news')}</p>
                                    <div className="flex space-x-3">
                                        <Input 
                                            type="email" 
                                            placeholder={t('footer.enter_email', 'Enter your email')} 
                                            className="flex-1 text-gray-900" 
                                            style={{backgroundColor: '#FFFFFF', borderColor: '#F6FBFD'}}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSubscribe()}
                                        />
                                        <Button 
                                            className="text-white hover:opacity-90 cursor-pointer" 
                                            style={{backgroundColor: '#FCF2F0', color: '#10B3D6'}}
                                            onClick={handleNewsletterSubscribe}
                                            disabled={isSubscribing}
                                        >
                                            {isSubscribing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                                    {t('footer.subscribing', 'Subscribing...')}
                                                </>
                                            ) : (
                                                t('footer.subscribe', 'Subscribe')
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">{t('footer.for_employers', 'For Employers')}</h3>
                                <ul className="space-y-2 text-gray-100">
                                    <li><a href="#" className="hover:text-white cursor-pointer">Post Jobs</a></li>
                                    <li><a href="#" className="hover:text-white cursor-pointer">Find Workers</a></li>
                                    <li><Link href={`/subscriptions${queryLang}`} className="hover:text-white cursor-pointer font-semibold text-yellow-300">💎 {t('cta.view_plans', 'Subscription Plans')}</Link></li>
                                    <li><a href="#" className="hover:text-white cursor-pointer">Success Stories</a></li>
                            </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">{t('footer.for_employees', 'For Employees')}</h3>
                                <ul className="space-y-2 text-gray-100">
                                    <li><a href="#" className="hover:text-white cursor-pointer">Create Profile</a></li>
                                    <li><a href="#" className="hover:text-white cursor-pointer">Browse Jobs</a></li>
                                    <li><Link href="/subscriptions" className="hover:text-white cursor-pointer font-semibold text-yellow-300">Pro Plans</Link></li>
                                    <li><a href="#" className="hover:text-white cursor-pointer">Help Center</a></li>
                            </ul>
                        </div>
                        </div>

                        <div className="mt-8 pt-8" style={{borderTop: '1px solid #FFFFFF'}}>
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <p className="text-gray-100 text-sm">
                                    © 2025 SkillOnCall.ca. {t('footer.copyright', 'All rights reserved. Made with 🍁 in Canada.')}
                                </p>
                                <div className="flex space-x-6 mt-4 md:mt-0">
                                    <button 
                                        onClick={() => setShowContactModal(true)}
                                        className="text-gray-100 hover:text-white text-sm cursor-pointer transition-colors"
                                    >
                                        {t('footer.contact', 'Contact')}
                                    </button>
                                    <button 
                                        onClick={() => setShowPrivacyModal(true)}
                                        className="text-gray-100 hover:text-white text-sm cursor-pointer transition-colors"
                                    >
                                        {t('footer.privacy', 'Privacy')}
                                    </button>
                                    <button 
                                        onClick={() => setShowTermsModal(true)}
                                        className="text-gray-100 hover:text-white text-sm cursor-pointer transition-colors"
                                    >
                                        {t('footer.terms', 'Terms')}
                                    </button>
                                </div>
                            </div>
                        </div>
                </div>
                </footer>

                {/* Auth Modal */}
                {showAuthModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAuthModal(false)}>
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#10B3D6'}}>
                                    <span className="text-white text-2xl font-bold">S</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Join SkillOnCall.ca</h2>
                                <p className="text-gray-600 mb-6">
                                    Sign up or log in to explore <strong>{selectedCategory}</strong> opportunities and connect with employers in your area.
                                </p>
                                
                                <div className="space-y-3">
                                    <Link href={`/register${queryLang}`} className="block">
                                        <Button className="w-full text-white hover:opacity-90" style={{backgroundColor: '#10B3D6'}}>
                                            Create Free Account
                                        </Button>
                                    </Link>
                                    <Link href={`/login${queryLang}`} className="block">
                                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                                            {t('auth.sign_in', 'Sign In')}
                                        </Button>
                                    </Link>
                                </div>
                                
                                <button 
                                    onClick={() => setShowAuthModal(false)}
                                    className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Privacy Policy Modal */}
                <PrivacyPolicyModal 
                    isOpen={showPrivacyModal} 
                    onClose={() => setShowPrivacyModal(false)} 
                />

                {/* Terms of Service Modal */}
                <TermsModal
                    isOpen={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                />

                {/* Contact Modal */}
                <ContactModal
                    isOpen={showContactModal}
                    onClose={() => setShowContactModal(false)}
                />
            </div>
        </>
    );
}
