import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useTranslations } from '@/hooks/useTranslations';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { locale } = useTranslations();
    
    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(typeof item.href === 'string' ? item.href.split('?')[0] : item.href.url.split('?')[0])}
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
