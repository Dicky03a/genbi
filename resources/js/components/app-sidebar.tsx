import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Newspaper, Info, Tags, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const isAdmin = user?.roles?.some((role) => ['Superadmin', 'admin'].includes(role));
    const dashboardUrl = isAdmin ? '/dashboard' : '/user/dashboard';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: dashboardUrl,
            icon: LayoutGrid,
        },
    ];

    if (isAdmin) {
        mainNavItems.push(
            {
                title: 'Tentang Kami',
                url: '/dashboard/abouts',
                icon: Info,
            },
            {
                title: 'Postingan',
                url: '#',
                icon: Newspaper,
                items: [
                    {
                        title: 'Berita',
                        url: '/dashboard/news',
                        icon: Newspaper,
                    },
                    {
                        title: 'Kategori',
                        url: '/dashboard/categories',
                        icon: Tags,
                    },
                ],
            },
            {
                title: 'Divisi',
                url: '/dashboard/divisions',
                icon: Users,
            }
        );
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            url: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            url: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
