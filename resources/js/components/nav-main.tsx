import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useTranslations } from '@/hooks/useTranslations';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { locale } = useTranslations();
    
    // Helper function to check if a URL matches the item href
    const isItemActive = (itemHref: string, currentUrl: string): boolean => {
        const cleanHref = itemHref.split('?')[0];
        const cleanUrl = currentUrl.split('?')[0];
        
        // Exact match - always active
        if (cleanUrl === cleanHref) {
            return true;
        }
        
        // Check if URL starts with href
        if (cleanUrl.startsWith(cleanHref)) {
            const nextChar = cleanUrl[cleanHref.length];
            
            // If URL ends exactly at href (nextChar is undefined), it's a match
            if (nextChar === undefined) {
                return true;
            }
            
            // If next character is '/', it's a child path
            if (nextChar === '/') {
                // Special case: prevent /employer/jobs from matching /employer/jobs/create
                // If the href ends with a specific route like '/create', only exact matches
                // Otherwise, allow child paths (like /employer/jobs/123 for /employer/jobs)
                
                // Check if cleanHref ends with a specific action route
                const specificRoutes = ['/create', '/edit', '/new'];
                const hasSpecificRoute = specificRoutes.some(route => cleanHref.endsWith(route));
                
                if (hasSpecificRoute) {
                    // For specific routes like /create, only exact matches
                    return false;
                }
                
                // For general routes like /employer/jobs, allow child paths
                // But exclude specific routes that shouldn't match
                const remainingPath = cleanUrl.substring(cleanHref.length + 1);
                const firstSegment = remainingPath.split('/')[0];
                
                // Don't match if the first segment is a specific route action
                if (specificRoutes.includes(`/${firstSegment}`)) {
                    return false;
                }
                
                // Otherwise, it's a valid child path (like /employer/jobs/123)
                return true;
            }
        }
        
        return false;
    };
    
    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarMenu>
                {items.map((item) => {
                    const itemHref = typeof item.href === 'string' ? item.href : item.href.url;
                    const isActive = isItemActive(itemHref, page.url);
                    
                    return (
                        <SidebarMenuItem key={item.title} style={{ cursor: 'pointer' }} className="cursor-pointer">
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                style={{ height: '2.7em', cursor: 'pointer' }}
                                className="mb-1 rounded-md hover:bg-white/10 cursor-pointer"
                            >
                                <Link 
                                    href={itemHref} 
                                    className="sidebar-nav-link flex w-full items-center gap-3 rounded-md px-3 py-2 cursor-pointer"
                                    style={{ cursor: 'pointer' }}
                                    title={item.title}
                                >
                                    {item.icon && <item.icon size={18} color="#FFFFFF" />}
                                    <span className="force-white-text flex-1 text-left cursor-pointer" style={{ fontWeight: '500', fontSize: '14px' }}>
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
