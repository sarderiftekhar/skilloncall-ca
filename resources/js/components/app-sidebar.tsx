import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useTranslations } from '@/hooks/useTranslations';
// Temporarily using simple route strings to fix import issues
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    Grid, 
    Users, 
    Briefcase, 
    CreditCard, 
    Activity, 
    Settings, 
    Shield,
    MessageCircle,
    Calendar,
    Clock,
    Bookmark,
    Search,
    AlertTriangle
} from 'react-feather';
import AppLogo from './app-logo';

// Helper function to add language parameter to URLs
function addLangParam(href: string, locale: string): string {
    const urlObj = new URL(href, window.location.origin);
    urlObj.searchParams.set('lang', locale);
    return urlObj.pathname + urlObj.search;
}

// Navigation items - role-based navigation
function getNavItems(userRole: string, t: (key: string) => string, locale: string): NavItem[] {
    const baseItems: NavItem[] = [
        {
            title: t('nav.dashboard'),
            href: addLangParam('/dashboard', locale),
            icon: Grid,
        },
    ];

    if (userRole === 'admin') {
        return [
            {
                title: t('nav.dashboard', 'Dashboard'),
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
            {
                title: t('nav.error_logs', 'Error Logs'),
                href: addLangParam('/admin/logs/exceptions', locale),
                icon: AlertTriangle,
            },
        ];
    }

    if (userRole === 'employer') {
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
                href: addLangParam('/employer/employees', locale),
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
                title: t('nav.find_jobs'),
                href: addLangParam('/employee/jobs', locale),
                icon: Briefcase,
            },
            {
                title: t('nav.saved_jobs'),
                href: addLangParam('/employee/saved-jobs', locale),
                icon: Bookmark,
            },
            {
                title: t('nav.my_applications'),
                href: addLangParam('/employee/applications', locale),
                icon: Users,
            },
            {
                title: t('nav.messages'),
                href: addLangParam('/employee/messages', locale),
                icon: MessageCircle,
            },
            {
                title: t('nav.availability'),
                href: addLangParam('/employee/availability', locale),
                icon: Clock,
            },
            {
                title: t('nav.my_profile'),
                href: addLangParam('/employee/profile', locale),
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

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const { t, locale } = useTranslations();
    const navItems = getNavItems(auth.user.role || 'admin', t, locale);

    return (
        <Sidebar variant="inset" className="hidden lg:flex w-64 min-w-64" style={{width: '256px', minWidth: '256px'}}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild style={{height: '2.7em', width: '100%', justifyContent: 'flex-start'}}>
                            <Link href={addLangParam("/dashboard", locale)} className="flex items-center gap-2 px-2 w-full cursor-pointer">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-0" style={{backgroundColor: 'transparent'}}>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
