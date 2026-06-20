import { LucideIcon } from 'lucide-react';

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

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    nim?: string;
    prodi?: string;
    angkatan?: string;
    alamat?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: string[];
    division?: { id: number; name: string } | null;
    [key: string]: unknown;
}
