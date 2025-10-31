import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useSidebar } from '@/components/ui/sidebar';
import { SubscriptionBadge } from '@/components/subscription-badge';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';
// Temporarily using simple route strings to fix import issues
import { type BreadcrumbItem as BreadcrumbItemType, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Activity, Bell, Bookmark, Briefcase, ChevronDown, Clock, CreditCard, Grid, LogOut, Menu, MessageCircle, Settings, Shield, Users } from 'react-feather';
import AppLogoIcon from './app-logo-icon';

// Helper function to add language parameter to URLs
function addLangParam(href: string, locale: string): string {
    const urlObj = new URL(href, window.location.origin);
    urlObj.searchParams.set('lang', locale);
    return urlObj.pathname + urlObj.search;
}

// Get role-based navigation items for mobile menu
function getRoleBasedNavItems(userRole: string, t: (key: string) => string, locale: string): NavItem[] {
    const baseItems: NavItem[] = [
        {
            title: t('nav.dashboard'),
            href: addLangParam('/dashboard', locale),
            icon: Grid,
        },
    ];

    if (userRole === 'admin') {
        return [
            ...baseItems,
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
        return [
            ...baseItems,
            {
                title: 'Post Jobs',
                href: addLangParam('/employer/jobs/create', locale),
                icon: Briefcase,
            },
            {
                title: 'Manage Jobs',
                href: addLangParam('/employer/jobs', locale),
                icon: Settings,
            },
            {
                title: 'Applications',
                href: addLangParam('/employer/applications', locale),
                icon: Users,
            },
            {
                title: 'Payments',
                href: addLangParam('/employer/payments', locale),
                icon: CreditCard,
            },
            {
                title: 'Subscription',
                href: addLangParam('/subscriptions', locale),
                icon: Shield,
            },
        ];
    }

    if (userRole === 'worker') {
        return [
            ...baseItems,
            {
                title: t('nav.find_jobs'),
                href: addLangParam('/worker/jobs', locale),
                icon: Briefcase,
            },
            {
                title: t('nav.saved_jobs'),
                href: addLangParam('/worker/saved-jobs', locale),
                icon: Bookmark,
            },
            {
                title: t('nav.my_applications'),
                href: addLangParam('/worker/applications', locale),
                icon: Users,
            },
            {
                title: t('nav.messages'),
                href: addLangParam('/worker/messages', locale),
                icon: MessageCircle,
            },
            {
                title: t('nav.availability'),
                href: addLangParam('/worker/availability', locale),
                icon: Clock,
            },
            {
                title: t('nav.my_profile'),
                href: addLangParam('/worker/profile', locale),
                icon: Settings,
            },
            {
                title: t('nav.subscription'),
                href: addLangParam('/subscriptions', locale),
                icon: Shield,
            },
        ];
    }

    return baseItems;
}

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { locale } = useTranslations();
    const page = usePage<SharedData>();
    const { auth, subscription } = page.props;
    const { toggleSidebar } = useSidebar();
    const { t } = useTranslations();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileNavItems = getRoleBasedNavItems(auth.user.role || 'admin', t, locale);

    // Notification state - in real app, this would come from props/context/API
    const [notifications] = useState([
        { id: 1, message: 'New employer registered: Metro Foods Inc.', time: '2 minutes ago', read: false },
        { id: 2, message: 'Urgent job posted: Evening cashier needed', time: '15 minutes ago', read: false },
        { id: 3, message: 'Payment received: $49 monthly subscription', time: '1 hour ago', read: true },
    ]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 bg-white px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:px-6">
            {/* Left side - Mobile Menu, Sidebar Toggle, Language Switcher and Breadcrumbs */}
            <div className="flex items-center gap-2">
                {/* Mobile Menu Button - Only on mobile */}
                <div className="lg:hidden">
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md hover:bg-gray-100">
                                <Menu className="h-5 w-5 text-gray-700" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex h-full w-80 flex-col bg-gradient-to-b from-white to-gray-50 p-0">
                            <SheetHeader className="flex h-20 items-center border-b border-gray-200 bg-white px-6 shadow-sm">
                                <SheetTitle className="flex w-full items-center gap-3">
                                    <AppLogoIcon className="h-8 w-8 fill-current text-cyan-600" />
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold" style={{ color: '#192341' }}>
                                            SkillOnCall
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {auth.user.role === 'admin' ? 'Administrator' : auth.user.role === 'employer' ? 'Employer' : 'Worker'}{' '}
                                            Menu
                                        </span>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>

                            {/* Mobile Navigation Items */}
                            <div className="flex-1 overflow-y-auto px-3 py-4">
                                <nav className="space-y-1">
                                    {mobileNavItems.map((item, index) => (
                                        <Link
                                            key={item.title}
                                            href={typeof item.href === 'string' ? item.href : item.href.url}
                                            className={cn(
                                                'group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                                                page.url === (typeof item.href === 'string' ? item.href : item.href.url)
                                                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                                                    : 'text-gray-700 hover:translate-x-1 hover:bg-white hover:shadow-md',
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{
                                                animationDelay: `${index * 50}ms`,
                                                animation: 'slideInLeft 0.3s ease-out forwards',
                                            }}
                                        >
                                            {/* Hover effect background */}
                                            <div
                                                className={cn(
                                                    'absolute inset-0 -translate-x-full transform bg-gradient-to-r from-cyan-50 to-cyan-100 transition-transform duration-300 group-hover:translate-x-0',
                                                    page.url === (typeof item.href === 'string' ? item.href : item.href.url) && 'hidden',
                                                )}
                                            />

                                            <div
                                                className={cn(
                                                    'relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6',
                                                    page.url === (typeof item.href === 'string' ? item.href : item.href.url)
                                                        ? 'bg-white/20'
                                                        : 'bg-cyan-50 group-hover:bg-cyan-100',
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon
                                                        size={18}
                                                        className={cn(
                                                            'relative flex-shrink-0 transition-all duration-300',
                                                            page.url === (typeof item.href === 'string' ? item.href : item.href.url)
                                                                ? 'text-white'
                                                                : 'text-cyan-600 group-hover:text-cyan-700',
                                                        )}
                                                    />
                                                )}
                                            </div>
                                            <span className="relative flex-1 font-medium transition-all duration-300 group-hover:font-semibold">
                                                {item.title}
                                            </span>
                                            {page.url === (typeof item.href === 'string' ? item.href : item.href.url) && (
                                                <div className="relative h-2 w-2 animate-pulse rounded-full bg-white"></div>
                                            )}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 bg-white px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white"
                                        style={{ backgroundColor: auth.user.avatar ? 'transparent' : '#10B3D6' }}
                                    >
                                        {auth.user.avatar ? (
                                            <img src={auth.user.avatar} alt={auth.user.display_name || auth.user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            auth.user.display_name || auth.user.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .toUpperCase()
                                                .slice(0, 2)
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">{auth.user.display_name || auth.user.name}</p>
                                        <p className="text-xs text-gray-500">{auth.user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                
                {/* Sidebar Toggle - Only on desktop */}
                <div className="hidden lg:block">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 cursor-pointer hover:bg-gray-100"
                        onClick={toggleSidebar}
                    >
                        <Menu className="h-5 w-5 text-gray-700" />
                    </Button>
                </div>
                
                {/* Language Switcher */}
                <LanguageSwitcher variant="compact" />
                
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right side - Subscription Badge, Notification Bell and User Avatar */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:gap-4">
                {/* Subscription Badge */}
                <SubscriptionBadge subscription={subscription} />
                
                {/* Notification Bell - Hidden on mobile */}
                <div className="relative hidden sm:block">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer border border-gray-200 transition-transform duration-200 hover:scale-110 hover:border-gray-300 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                        onClick={() => console.log('Show notifications')}
                    >
                        <Bell style={{ color: '#192341', width: '18px', height: '18px' }} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-xs text-[10px] font-bold text-white sm:h-5 sm:w-5 sm:text-xs">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Button>
                </div>

                {/* User Avatar Dropdown - Compact on mobile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="group flex h-8 items-center gap-1 rounded-md border border-gray-200 px-1 py-1 text-sidebar-accent-foreground hover:border-gray-300 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-sidebar-accent sm:h-9 sm:gap-2 sm:px-2 lg:h-10 lg:px-3"
                        >
                            <div
                                className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white sm:h-7 sm:w-7 sm:text-sm lg:h-8 lg:w-8"
                                style={{ backgroundColor: auth.user.avatar ? 'transparent' : '#10B3D6' }}
                            >
                                {auth.user.avatar ? (
                                    <img src={auth.user.avatar} alt={auth.user.display_name || auth.user.name} className="h-full w-full object-cover" />
                                ) : (
                                    auth.user.display_name || auth.user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2)
                                )}
                            </div>
                            <div className="hidden flex-col items-start text-left sm:flex">
                                <span className="max-w-20 truncate text-xs font-medium text-gray-900 sm:max-w-24 sm:text-sm dark:text-white">
                                    {auth.user.display_name || auth.user.name}
                                </span>
                            </div>
                            <ChevronDown className="ml-1 hidden size-3 sm:block sm:size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 min-w-64 rounded-lg" align="end" side="bottom" sideOffset={8}>
                        <div className="flex items-center gap-3 border-b p-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full font-semibold text-white"
                                style={{ backgroundColor: auth.user.avatar ? 'transparent' : '#10B3D6' }}
                            >
                                {auth.user.avatar ? (
                                    <img src={auth.user.avatar} alt={auth.user.display_name || auth.user.name} className="h-full w-full object-cover" />
                                ) : (
                                    auth.user.display_name || auth.user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2)
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {auth.user.display_name || auth.user.name}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{auth.user.email}</span>
                            </div>
                        </div>
                        <div className="py-1">
                            <DropdownMenuItem asChild>
                                <Link
                                    className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    href="/settings/profile"
                                    prefetch
                                >
                                    <Settings className="mr-3 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    href="/logout"
                                    method="post"
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    Logout
                                </Link>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
