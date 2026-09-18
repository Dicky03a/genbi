import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    CalendarDays,
    ClipboardCheck,
    FileCheck2,
    Info,
    LayoutGrid,
    Newspaper,
    Percent,
    Settings2,
    Tags,
    TicketCheck,
    UserCog,
    Users,
    WalletCards,
    HelpCircle,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const adminRoles = ['superadmin', 'admin_korkom', 'admin_komisariat', 'Superadmin', 'admin'];
    const isAdmin = user?.roles?.some((role) => adminRoles.includes(role));
    const isKorkomOrSuperadmin = user?.roles?.some((role) => ['superadmin', 'admin_korkom', 'Superadmin', 'admin'].includes(role));
    const dashboardUrl = '/dashboard';

    const mainNavItems: NavItem[] = isAdmin
        ? [
              { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
              {
                  title: 'Operasional',
                  url: '#',
                  icon: ClipboardCheck,
                  items: [
                      { title: 'Acara', url: '/admin/acara', icon: CalendarDays },
                      { title: 'Verifikasi Absensi', url: '/admin/absensi', icon: TicketCheck },
                      { title: 'Verifikasi Pengajuan', url: '/admin/pengajuan', icon: FileCheck2 },
                      { title: 'Rekap Poin', url: '/admin/rekap', icon: BarChart3 },
                  ],
              },
              {
                  title: 'Master Poin',
                  url: '#',
                  icon: WalletCards,
                  items: [
                      { title: 'Periode', url: '/admin/periode', icon: CalendarDays },
                      { title: 'Kategori Poin', url: '/admin/kategori-poin', icon: Tags },
                      { title: 'Tarif Poin', url: '/admin/tarif-poin', icon: Percent },
                      ...(isKorkomOrSuperadmin ? [{ title: 'Kategori Acara', url: '/admin/komisariat', icon: Tags }] : []),
                  ],
              },
              {
                  title: 'Konten Publik',
                  url: '#',
                  icon: Newspaper,
                  items: [
                      { title: 'Tentang Kami', url: '/dashboard/abouts', icon: Info },
                      { title: 'Berita', url: '/dashboard/news', icon: Newspaper },
                      { title: 'Kategori Berita', url: '/dashboard/categories', icon: Tags },
                      { title: 'Info Beasiswa', url: '/dashboard/beasiswas', icon: Info },
                      { title: 'FAQ Beasiswa', url: '/dashboard/beasiswa-faqs', icon: HelpCircle },
                  ],
              },
              { title: 'Divisi', url: '/dashboard/divisions', icon: Users },
              { title: 'Kelola User', url: '/dashboard/users', icon: UserCog },
          ]
        : [
              { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
              { title: 'Acara', url: '/acara', icon: CalendarDays },
              { title: 'Pengajuan Poin', url: '/pengajuan', icon: FileCheck2 },
              { title: 'Riwayat Poin', url: '/poin', icon: WalletCards },
              { title: 'Profil Saya', url: '/settings/profile', icon: Settings2 },
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
