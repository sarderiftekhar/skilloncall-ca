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
    Bookmark
} from 'react-feather';
import AppLogo from './app-logo';

// Navigation items - role-based navigation
function getNavItems(userRole: string, t: (key: string) => string): NavItem[] {
    const baseItems: NavItem[] = [
        {
            title: t('nav.dashboard'),
            href: '/dashboard',
            icon: Grid,
        },
    ];

    if (userRole === 'admin') {
        return [
            ...baseItems,
            {
                title: 'User Management',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'Job Management',
                href: '/admin/jobs',
                icon: Briefcase,
            },
            {
                title: 'Payments & Billing',
                href: '/admin/payments',
                icon: CreditCard,
            },
            {
                title: 'Reports & Analytics',
                href: '/admin/reports',
                icon: Activity,
            },
            {
                title: 'Subscriptions',
                href: '/subscriptions',
                icon: CreditCard,
            },
            {
                title: 'System Settings',
                href: '/admin/settings',
                icon: Settings,
            },
        ];
    }

    if (userRole === 'employer') {
        return [
            ...baseItems,
            {
                title: 'Post Jobs',
                href: '/employer/jobs/create',
                icon: Briefcase,
            },
            {
                title: 'Manage Jobs',
                href: '/employer/jobs',
                icon: Settings,
            },
            {
                title: 'Applications',
                href: '/employer/applications',
                icon: Users,
            },
            {
                title: 'Payments',
                href: '/employer/payments',
                icon: CreditCard,
            },
            {
                title: 'Subscription',
                href: '/subscriptions',
                icon: Shield,
            },
        ];
    }

    if (userRole === 'worker') {
        return [
            ...baseItems,
            {
                title: t('nav.find_jobs'),
                href: '/worker/jobs',
                icon: Briefcase,
            },
            {
                title: t('nav.saved_jobs'),
                href: '/worker/saved-jobs',
                icon: Bookmark,
            },
            {
                title: t('nav.my_applications'),
                href: '/worker/applications',
                icon: Users,
            },
            {
                title: t('nav.messages'),
                href: '/worker/messages',
                icon: MessageCircle,
            },
            {
                title: t('nav.availability'),
                href: '/worker/availability',
                icon: Clock,
            },
            {
                title: t('nav.my_profile'),
                href: '/worker/profile',
                icon: Settings,
            },
            {
                title: t('nav.subscription'),
                href: '/subscriptions',
                icon: Shield,
            },
        ];
    }

    return baseItems;
}

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslations();
    const navItems = getNavItems(auth.user.role || 'admin', t);

    return (
        <Sidebar variant="inset" className="hidden lg:flex w-64 min-w-64" style={{width: '256px', minWidth: '256px'}}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild style={{height: '2.7em', width: '100%', justifyContent: 'flex-start'}}>
                            <Link href="/dashboard" className="flex items-center gap-2 px-2 w-full">
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
