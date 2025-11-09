import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useTranslations } from '@/hooks/useTranslations';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { locale } = useTranslations();

    const currentPath = (page.url || '').split('?')[0];
    const normalizedItems = items.map((item) => {
        const href = typeof item.href === 'string' ? item.href : item.href.url;
        const path = href.split('?')[0];
        return { item, path };
    });

    const activeMatch = normalizedItems
        .filter(({ path }) => {
            if (!path) return false;
            if (currentPath === path) return true;
            return currentPath.startsWith(`${path}/`);
        })
        .sort((a, b) => b.path.length - a.path.length)[0];
    
    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarMenu>
                {normalizedItems.map(({ item, path }) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={activeMatch?.path === path}
                            style={{ height: '2.7em' }}
                            className="mb-1 rounded-md hover:bg-white/10 cursor-pointer"
                        >
                            <Link 
                                href={typeof item.href === 'string' ? item.href : item.href.url} 
                                className="sidebar-nav-link flex w-full items-center gap-3 rounded-md px-3 py-2 cursor-pointer"
                                title={item.title}
                            >
                                {item.icon && <item.icon size={18} color="#FFFFFF" />}
                                <span className="force-white-text flex-1 text-left" style={{ fontWeight: '500', fontSize: '14px' }}>
                                    {item.title}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
