import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { 
    Coffee,
    Tool,
    Shield,
    ShoppingCart,
    Briefcase,
    Home,
    Heart,
    Book,
    Truck,
    Activity,
    ChevronLeft,
    Users,
    Calendar,
    Star,
    MapPin,
    Camera,
} from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

export default function Categories() {
    const { auth } = usePage<SharedData>().props as any;
    const { t, locale } = useTranslations();
    const isFrench = locale === 'fr';
    const queryLang = `?lang=${locale}`;

    const handleCategoryClick = (categorySlug: string, categoryLabel: string) => {
        // Always redirect to register page when clicking on any category card
        router.visit(`/register${queryLang}`);
    };

    const allCategories = [
        {
            slug: 'food-service',
            name: isFrench ? 'Services alimentaires' : 'Food Service',
            icon: Coffee,
            count: isFrench ? '453 employés' : '453 Employees',
            color: 'text-white',
            bgColor: '#10B3D6',
        },
        {
            slug: 'retail',
            name: isFrench ? 'Commerce de détail' : 'Retail',
            icon: ShoppingCart,
            count: isFrench ? '324 employés' : '324 Employees',
            color: 'text-gray-800',
            bgColor: '#FCF2F0',
        },
        {
            slug: 'grocery',
            name: isFrench ? 'Épicerie' : 'Grocery',
            icon: ShoppingCart,
            count: isFrench ? '267 employés' : '267 Employees',
            color: 'text-white',
            bgColor: '#10B3D6',
        },
        {
            slug: 'hospitality',
            name: isFrench ? 'Hôtellerie' : 'Hospitality',
            icon: Coffee,
            count: isFrench ? '189 employés' : '189 Employees',
            color: 'text-gray-800',
            bgColor: '#FCF2F0',
        },
        {
            slug: 'maintenance',
            name: isFrench ? 'Entretien' : 'Maintenance',
            icon: Tool,
            count: isFrench ? '145 employés' : '145 Employees',
            color: 'text-white',
            bgColor: '#10B3D6',
        },
        {
            slug: 'security',
            name: isFrench ? 'Sécurité' : 'Security',
            icon: Shield,
            count: isFrench ? '98 employés' : '98 Employees',
            color: 'text-gray-800',
            bgColor: '#FCF2F0',
        },
        {
            slug: 'healthcare',
            name: isFrench ? 'Soins de santé' : 'Healthcare',
            icon: Heart,
            count: isFrench ? '312 employés' : '312 Employees',
            color: 'text-white',
            bgColor: '#10B3D6',
        },
        {
            slug: 'education',
            name: isFrench ? 'Éducation' : 'Education',
            icon: Book,
            count: isFrench ? '178 employés' : '178 Employees',
            color: 'text-gray-800',
            bgColor: '#FCF2F0',
        },
        {
            slug: 'construction',
            name: isFrench ? 'Construction' : 'Construction',
            icon: Briefcase,
            count: isFrench ? '256 employés' : '256 Employees',
            color: 'text-white',
            bgColor: '#10B3D6',
        },
        {
            slug: 'transportation',
            name: isFrench ? 'Transport' : 'Transportation',
            icon: Truck,
            count: isFrench ? '201 employés' : '201 Employees',
            color: 'text-gray-800',
            bgColor: '#FCF2F0',
        },
        {
            slug: 'automotive',
            name: isFrench ? 'Automobile' : 'Automotive',
            icon: Truck,
            count: isFrench ? '134 employés' : '134 Employees',
            color: 'text-white',
            bgColor: '#10B3D6',
        },
        {
            slug: 'beauty',
            name: isFrench ? 'Beauté' : 'Beauty',
            icon: Star,
            count: isFrench ? '167 employés' : '167 Employees',
            color: 'text-gray-800',
            bgColor: '#FCF2F0',
        },
        {
            slug: 'cleaning',
            name: isFrench ? 'Nettoyage' : 'Cleaning',
            icon: Home,
            count: isFrench ? '289 employés' : '289 Employees',
            color: 'text-white',
            bgColor: '#10B3D6',
        },
        {
            slug: 'catering',
            name: isFrench ? 'Traiteur' : 'Catering',
            icon: Coffee,
            count: isFrench ? '156 employés' : '156 Employees',
            color: 'text-gray-800',
            bgColor: '#FCF2F0',
        },
        {
            slug: 'warehouse',
            name: isFrench ? 'Entrepôt' : 'Warehouse',
            icon: Briefcase,
            count: isFrench ? '223 employés' : '223 Employees',
            color: 'text-white',
            bgColor: '#10B3D6',
        },
        {
            slug: 'event-staff',
            name: isFrench ? 'Personnel d\'événement' : 'Event Staff',
            icon: Calendar,
            count: isFrench ? '112 employés' : '112 Employees',
            color: 'text-gray-800',
            bgColor: '#FCF2F0',
        },
        {
            slug: 'photography',
            name: isFrench ? 'Photographie' : 'Photography',
            icon: Camera,
            count: isFrench ? '89 employés' : '89 Employees',
            color: 'text-white',
            bgColor: '#10B3D6',
        },
        {
            slug: 'electrical',
            name: isFrench ? 'Électricité' : 'Electrical',
            icon: Activity,
            count: isFrench ? '145 employés' : '145 Employees',
            color: 'text-gray-800',
            bgColor: '#FCF2F0',
        },
        {
            slug: 'plumbing',
            name: isFrench ? 'Plomberie' : 'Plumbing',
            icon: Tool,
            count: isFrench ? '98 employés' : '98 Employees',
            color: 'text-white',
            bgColor: '#10B3D6',
        },
        {
            slug: 'fitness',
            name: isFrench ? 'Fitness' : 'Fitness',
            icon: Activity,
            count: isFrench ? '76 employés' : '76 Employees',
            color: 'text-gray-800',
            bgColor: '#FCF2F0',
        },
    ];

    return (
        <>
            <Head title={isFrench ? 'Toutes les catégories - SkillOnCall.ca' : 'All Categories - SkillOnCall.ca'}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer, 
                    [onclick], [onClick], .group, .hover\\:shadow-md,
                    .hover\\:text-white, .hover\\:opacity-90,
                    .transition-colors, .transition-transform,
                    .category-card { cursor: pointer !important; }
                    
                    /* Ensure entire card area has pointer cursor */
                    .group[onclick], .group[onClick], .category-card { cursor: pointer !important; }
                    .group[onclick] *, .group[onClick] *, .category-card * { cursor: inherit !important; }
                `}</style>
            </Head>

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
                                <Link href={`/register${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.find_employees', 'Find Employees')}</Link>
                                <Link href={`/register${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.post_jobs', 'Post Jobs')}</Link>
                                <Link href={`/how-it-works${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.how_it_works', 'How it Works')}</Link>
                                <Link href={`/pricing${queryLang}`} className="text-gray-300 hover:text-white cursor-pointer transition-colors">{t('nav.pricing', 'Pricing')}</Link>
                            </nav>

                            {/* User Menu */}
                            <div className="flex items-center space-x-3 md:space-x-4">
                                {/* Language Switcher */}
                                <div className="flex items-center space-x-1 border border-gray-600 rounded-md overflow-hidden">
                                    <button 
                                        onClick={() => router.visit(`/categories?lang=en`)} 
                                        className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                                            locale === 'en' 
                                                ? 'bg-white text-gray-900' 
                                                : 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        EN
                                    </button>
                                    <button 
                                        onClick={() => router.visit(`/categories?lang=fr`)} 
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
                                        className="px-4 py-2 text-sm font-medium text-white bg-[#10B3D6] rounded-md hover:opacity-90 cursor-pointer transition-all"
                                    >
                                        {t('auth.dashboard', 'Dashboard')}
                                    </Link>
                                ) : (
                                    <>
                                        <Link 
                                            href={`/login${queryLang}`}
                                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white cursor-pointer transition-colors"
                                        >
                                            {t('auth.sign_in', 'Sign In')}
                                        </Link>
                                        <Link 
                                            href={`/register${queryLang}`}
                                            className="px-4 py-2 text-sm font-medium text-white bg-[#10B3D6] rounded-md hover:opacity-90 cursor-pointer transition-all"
                                        >
                                            {t('auth.get_started', 'Get Started')}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main>
                    {/* Page Header Section */}
                    <section className="pt-12 pb-8" style={{backgroundColor: '#FFFFFF'}}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="mb-6">
                                <Link 
                                    href={`/${queryLang}`}
                                    className="inline-flex items-center text-gray-600 hover:text-[#10B3D6] cursor-pointer transition-colors mb-4"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    {isFrench ? 'Retour à l\'accueil' : 'Back to Home'}
                                </Link>
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{color: '#192341'}}>
                                    {t('categories.title', isFrench ? 'Toutes les catégories d\'emploi' : 'All Employment Categories')}
                                </h1>
                                <p className="text-base text-gray-600 md:text-lg max-w-2xl mx-auto">
                                    {t('categories.subtitle', isFrench ? 'Explorez tous les secteurs d\'emploi disponibles sur SkillOnCall.ca' : 'Explore all available employment sectors on SkillOnCall.ca')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Categories Grid Section */}
                    <section className="pt-8 pb-16" style={{backgroundColor: '#FFFFFF'}}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {allCategories.map((category, index) => (
                                    <div 
                                        key={index} 
                                        onClick={() => handleCategoryClick(category.slug, category.name)}
                                        className="group relative category-card cursor-pointer rounded-2xl border-0 bg-white p-8 shadow-[0_12px_28px_rgba(16,179,214,0.10)] transition-all hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(16,179,214,0.18)]"
                                        style={{cursor: 'pointer'}}
                                    >
                                        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-[#10B3D6] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        <div className="flex flex-col items-center text-center gap-4">
                                            <div className="h-16 w-16 rounded-full flex items-center justify-center shadow-sm" style={{backgroundColor: category.bgColor}}>
                                                <category.icon className={`h-7 w-7 ${category.color}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold" style={{color: '#192341'}}>{category.name}</h3>
                                                <p className="mt-1 text-sm text-gray-600">{category.count}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer style={{backgroundColor: '#10B3D6'}} className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mb-6">
                                <img 
                                    src="/logo-white.png" 
                                    alt="SkillOnCall Logo" 
                                    className="w-12 h-12 mx-auto mb-4"
                                />
                                <h3 className="text-xl font-bold text-white mb-2">SkillOnCall.ca</h3>
                                <p className="text-gray-100 text-sm">
                                    {t('footer.copyright', isFrench ? 'Tous droits réservés. Fait avec 🍁 au Canada.' : 'All rights reserved. Made with 🍁 in Canada.')}
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

