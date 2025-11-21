import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { SubscriptionBadge } from '@/components/subscription-badge';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useTranslations } from '@/hooks/useTranslations';
import { Book, Folder, Grid, Menu, Search, X, MessageCircle, Briefcase, Users, CreditCard, Settings, Clock, Shield, Activity } from 'react-feather';
import { useState } from 'react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

// Generate main nav items dynamically with language parameters
function getMainNavItems(locale: string): NavItem[] {
    return [
        {
            title: 'Dashboard',
            href: addLangParam('/dashboard', locale),
            icon: Grid,
        },
    ];
}

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: Book,
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

// Helper function to add language parameter to URLs
function addLangParam(href: string, locale: string): string {
    const urlObj = new URL(href, window.location.origin);
    urlObj.searchParams.set('lang', locale);
    return urlObj.pathname + urlObj.search;
}

// Get role-based navigation items
function getRoleBasedNavItems(userRole: string, locale: string): NavItem[] {
    const baseItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: addLangParam('/dashboard', locale),
            icon: Grid,
        },
    ];

    if (userRole === 'admin') {
        return [
            {
                title: 'Dashboard',
                href: addLangParam('/admin/dashboard', locale),
                icon: Grid,
            },
            {
                title: 'User Management',
                href: addLangParam('/admin/users', locale),
                icon: Users,
            },
            {
                title: 'Job Management',
                href: addLangParam('/admin/jobs', locale),
                icon: Briefcase,
            },
            {
                title: 'Payments & Billing',
                href: addLangParam('/admin/payments', locale),
                icon: CreditCard,
            },
            {
                title: 'Reports & Analytics',
                href: addLangParam('/admin/reports', locale),
                icon: Activity,
            },
            {
                title: 'System Settings',
                href: addLangParam('/admin/settings', locale),
                icon: Settings,
            },
        ];
    }

    if (userRole === 'employer') {
        const { t } = useTranslations();
        return [
            ...baseItems,
            {
                title: t('nav.post_jobs', 'Post Jobs'),
                href: addLangParam('/employer/jobs/create', locale),
                icon: Briefcase,
            },
            {
                title: t('nav.manage_jobs', 'Manage Jobs'),
                href: addLangParam('/employer/jobs', locale),
                icon: Settings,
            },
            {
                title: t('nav.applications', 'Applications'),
                href: addLangParam('/employer/applications', locale),
                icon: Users,
            },
            {
                title: t('nav.find_employee', 'Find Employee'),
                href: addLangParam('/employer/workers', locale),
                icon: Search,
            },
            {
                title: t('nav.messages', 'Messages'),
                href: addLangParam('/employer/messages', locale),
                icon: MessageCircle,
            },
            {
                title: t('nav.payments', 'Payments'),
                href: addLangParam('/employer/payments', locale),
                icon: CreditCard,
            },
            {
                title: t('nav.subscription', 'Subscription'),
                href: addLangParam('/subscriptions', locale),
                icon: Shield,
            },
        ];
    }

    if (userRole === 'employee') {
        return [
            ...baseItems,
            {
                title: 'Find Jobs',
                href: addLangParam('/employee/jobs', locale),
                icon: Briefcase,
            },
            {
                title: 'My Applications',
                href: addLangParam('/employee/applications', locale),
                icon: Users,
            },
            {
                title: 'Messages',
                href: addLangParam('/employee/messages', locale),
                icon: MessageCircle,
            },
            {
                title: 'Availability',
                href: addLangParam('/employee/availability', locale),
                icon: Clock,
            },
            {
                title: 'My Profile',
                href: addLangParam('/employee/profile', locale),
                icon: Settings,
            },
            {
                title: 'Subscription',
                href: addLangParam('/subscriptions', locale),
                icon: Shield,
            },
        ];
    }

    return baseItems;
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { locale } = useTranslations();
    const mainNavItems = getMainNavItems(locale);
    const { auth, subscription } = page.props;
    const getInitials = useInitials();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileNavItems = getRoleBasedNavItems(auth.user.role || 'admin', locale);

    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="flex h-16 items-center px-4 gap-2">
                    {/* Mobile Menu Button - ALWAYS FIRST, FIXED WIDTH */}
                    <div className="lg:hidden w-10 h-10 flex-shrink-0">
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-10 w-10 rounded-md hover:bg-gray-100"
                                >
                                    <Menu className="h-6 w-6 text-gray-700" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-72 flex-col bg-white p-0">
                                <SheetHeader className="flex h-16 items-center border-b border-gray-200 px-6 justify-between">
                                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black" />
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </SheetHeader>

                                {/* Mobile Navigation Items */}
                                <div className="flex-1 overflow-y-auto py-4">
                                    <nav className="space-y-1 px-2">
                                        {mobileNavItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={typeof item.href === 'string' ? item.href : item.href.url}
                                                className={cn(
                                                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                                                    page.url === (typeof item.href === 'string' ? item.href : item.href.url)
                                                        ? 'bg-cyan-50 text-cyan-700'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                )}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.icon && <item.icon size={20} className="flex-shrink-0" />}
                                                <span className="flex-1">{item.title}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                </div>

                                {/* Mobile Footer Section */}
                                <div className="border-t border-gray-200 px-2 py-4 space-y-2">
                                    <div className="px-2 text-xs font-semibold text-gray-500 uppercase">Resources</div>
                                    {rightNavItems.map((item) => (
                                        <a
                                            key={item.title}
                                            href={typeof item.href === 'string' ? item.href : item.href.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            {item.icon && <item.icon size={18} />}
                                            <span>{item.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    <Link href={addLangParam('/dashboard', locale)} prefetch className="items-center space-x-2 hidden lg:flex">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === (typeof item.href === 'string' ? item.href : item.href.url) && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.href && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right Side Controls */}
                    <div className="ml-auto flex items-center gap-1 lg:gap-2">
                        {/* Language Switcher */}
                        <LanguageSwitcher variant="compact" />
                        
                        {/* Subscription Badge */}
                        <SubscriptionBadge subscription={subscription} />
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9 hidden sm:flex">
                            <Search className="h-4 w-4 lg:h-5 lg:w-5 opacity-80 hover:opacity-100" />
                        </Button>

                        {/* Desktop Resources Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {rightNavItems.map((item) => (
                                <TooltipProvider key={item.title} delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a
                                                href={typeof item.href === 'string' ? item.href : item.href.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent text-sm font-medium text-accent-foreground transition-colors hover:bg-gray-100"
                                            >
                                                <span className="sr-only">{item.title}</span>
                                                {item.icon && <Icon iconNode={item.icon} className="h-5 w-5 opacity-80 group-hover:opacity-100" />}
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 lg:h-9 lg:w-9 rounded-full p-0">
                                    <Avatar className="h-7 w-7 lg:h-8 lg:w-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-xs text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-xs lg:text-sm text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
