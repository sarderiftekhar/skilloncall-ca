import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    return (
        <SidebarGroup {...props} className={`px-2 group-data-[collapsible=icon]:p-0 ${className || ''}`}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className="mb-1 rounded-md hover:bg-white/10" style={{ height: '2.7em' }}>
                                <a
                                    href={typeof item.href === 'string' ? item.href : item.href.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="sidebar-nav-link flex w-full items-center gap-3 rounded-md px-3 py-2"
                                >
                                    {item.icon && <item.icon size={18} color="#FFFFFF" />}
                                    <span className="force-white-text flex-1 text-left" style={{ fontWeight: '500', fontSize: '14px' }}>
                                        {item.title}
                                    </span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
