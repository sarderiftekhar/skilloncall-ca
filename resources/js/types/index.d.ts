import { InertiaLinkProps } from '@inertiajs/react';
import { ComponentType } from 'react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

interface FeatherIconProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: ComponentType<FeatherIconProps> | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    subscription: SubscriptionInfo | null;
    locale: string;
    translations: Record<string, any>;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface SubscriptionInfo {
    plan_name: string;
    plan_type: string;
    status: string;
    ends_at: string | null;
    days_until_expiration: number | null;
    is_cancelled: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'employer' | 'employee';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

declare global {
    function route(name: string, params?: any, absolute?: boolean): string;
}
