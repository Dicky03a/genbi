import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, Compass, GraduationCap, Info, LayoutGrid, Newspaper, Tags, UserCog, Users } from 'lucide-react';
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
        {
            title: 'Jelajahi GenBI',
            url: '#',
            icon: Compass,
            items: [
                {
                    title: 'Tentang Kami',
                    url: '/profile',
                    icon: Info,
                },
                {
                    title: 'Berita',
                    url: '/berita',
                    icon: Newspaper,
                },
                {
                    title: 'Info Beasiswa',
                    url: '/beasiswa',
                    icon: GraduationCap,
                },
                {
                    title: 'Divisi',
                    url: '/divisi',
                    icon: Building2,
                },
            ],
        },
    ];

    if (isAdmin) {
        mainNavItems.push(
            {
                title: 'Kelola Konten Publik',
                url: '#',
                icon: Newspaper,
                items: [
                    {
                        title: 'Tentang Kami',
                        url: '/dashboard/abouts',
                        icon: Info,
                    },
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
                    {
                        title: 'Info Beasiswa',
                        url: '/dashboard/beasiswas',
                        icon: GraduationCap,
                    },
                ],
            },
            {
                title: 'Divisi',
                url: '/dashboard/divisions',
                icon: Users,
            },
            {
                title: 'Kelola User',
                url: '/dashboard/users',
                icon: UserCog,
            },
        );
    }

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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
