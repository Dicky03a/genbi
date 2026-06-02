import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Home, Info, LayoutGrid, Menu, Newspaper, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogoIcon from './app-logo-icon';

// Design System Constants
const PRIMARY_ACCENT = '#3B5BDB';
const TEXT_PRIMARY = '#1a1a2e';
const TEXT_SECONDARY = '#64748b';

interface NavItemData {
    id: string;
    label: string;
    url: string;
    icon: React.ElementType;
    metadata?: string | number | React.ReactNode;
}

export function PublicNavbar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const page = usePage();
    const currentPath = page.url;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when navigating
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [currentPath]);

    const navItems: NavItemData[] = [
        { id: 'home', label: 'Home', url: '/', icon: Home },
        { id: 'Profile', label: 'Profile', url: '/profile', icon: User },
        { id: 'beasiswa', label: 'Informasi Beasiswa', url: '/beasiswa', icon: Info },
        { id: 'berita', label: 'Berita', url: '/berita', icon: Newspaper },
        { id: 'divisi', label: 'Divisi', url: '/divisi', icon: Users },
    ];

    // Placeholder items for the mobile dropdown
    const dropdownMenuItems: NavItemData[] = [
        { id: 'home', label: 'Home', url: '/', icon: Home },
        {
            id: 'dashboard',
            label: 'Dashboard',
            url: user?.roles?.some((r) => ['Superadmin', 'admin'].includes(r as string)) ? '/dashboard' : '/user/dashboard',
            icon: LayoutGrid,
        },
    ];

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <>
            {/* DESKTOP NAVBAR (≥ 768px) */}
            <header
                className={cn(
                    'fixed top-0 right-0 left-0 z-50 mx-90 my-10 hidden h-[64px] items-center justify-between rounded-3xl px-6 transition-all duration-300 md:flex lg:px-12',
                    'border-b border-[rgba(0,0,0,0.16)] bg-[rgba(255,255,255,0.75)] backdrop-blur-[16px]',
                    scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.06)]' : '',
                )}
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.6)', borderLeft: '1px solid rgba(255, 255, 255, 0.6)' }}
            >
                {/* Left: Logo */}
                <div className="flex items-center">
                    <Link href="/" className="group flex items-center gap-2">
                        <AppLogoIcon className="h-7 w-7 fill-current text-[#1a1a2e]" />
                    </Link>
                </div>

                {/* Center: Navigation */}
                <nav className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = currentPath === item.url;
                        return (
                            <Link
                                key={item.id}
                                href={item.url}
                                className={cn(
                                    'relative rounded-full px-4 py-1.5 text-[14px] font-medium transition-all duration-150',
                                    'hover:bg-[rgba(0,0,0,0.04)]',
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <Link
                            href={user?.roles?.some((r) => ['Superadmin', 'admin'].includes(r as string)) ? '/dashboard' : '/user/dashboard'}
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium text-[#1a1a2e] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                        >
                            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-[10px]">
                                {user.name.charAt(0)}
                            </div>
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="flex items-center rounded-full bg-[#3B5BDB] px-5 py-2 text-[14px] font-medium text-white shadow-[0_4px_12px_rgba(59,91,219,0.2)] transition-all hover:brightness-110 active:scale-95"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </header>

            {/* MOBILE BOTTOM NAVIGATION PILL (< 768px) */}
            <div className="fixed bottom-3 left-1/2 z-50 w-[90%] max-w-[400px] -translate-x-1/2 md:hidden">
                <nav
                    className={cn(
                        'flex h-[68px] items-center justify-between rounded-3xl px-2',
                        'bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px]',
                        'border border-[rgba(255,255,255,0.7)] shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
                    )}
                >
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = currentPath === item.url && !mobileMenuOpen;
                        const Icon = item.icon;
                        return (
                            <Link key={item.id} href={item.url} className="relative flex h-[54px] w-[54px] flex-col items-center justify-center">
                                <div
                                    className={cn(
                                        'flex h-11 w-11 items-center justify-center rounded-[14px] transition-all duration-200',
                                        isActive ? 'bg-[#1a1a2e]' : 'bg-transparent',
                                    )}
                                >
                                    <Icon
                                        className={cn('h-[22px] w-[22px] transition-colors', isActive ? 'text-white' : 'text-[#64748b]')}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        fill={isActive ? 'currentColor' : 'none'}
                                    />
                                </div>
                            </Link>
                        );
                    })}

                    {/* Menu Toggle / More Button */}
                    <button onClick={toggleMobileMenu} className="relative flex h-[54px] w-[54px] flex-col items-center justify-center">
                        <div
                            className={cn(
                                'flex h-11 w-11 items-center justify-center rounded-[14px] transition-all duration-200',
                                mobileMenuOpen ? 'bg-[#3B5BDB]' : 'bg-transparent',
                            )}
                        >
                            {mobileMenuOpen ? (
                                <Menu className="h-[22px] w-[22px] text-white" strokeWidth={2.5} />
                            ) : user ? (
                                <User className="h-[22px] w-[22px] text-[#64748b]" strokeWidth={2} />
                            ) : (
                                <LayoutGrid className="h-[22px] w-[22px] text-[#64748b]" strokeWidth={2} />
                            )}
                        </div>
                    </button>
                </nav>
            </div>

            {/* MOBILE DROPDOWN PANEL (Slide up) */}
            <div
                className={cn(
                    'fixed inset-0 z-40 transition-all duration-300 md:hidden',
                    mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
                )}
            >
                {/* Backdrop overlay */}
                <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

                {/* Upward sliding card */}
                <div
                    className={cn(
                        'absolute bottom-[88px] left-1/2 w-[92%] max-w-[400px] -translate-x-1/2',
                        'bg-[rgba(255,255,255,0.92)] backdrop-blur-[24px]',
                        'rounded-[20px] border border-[rgba(200,200,210,0.5)]',
                        'overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,0.10)] transition-all duration-300 ease-out',
                        mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
                    )}
                >
                    {/* User Info Row */}
                    {user ? (
                        <div className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.06)] p-5">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#3B5BDB] to-[#5c7cfa] text-lg font-semibold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] leading-tight font-semibold text-[#1a1a2e]">{user.name}</p>
                                <p className="mt-0.5 text-[12px] leading-tight text-[#64748b]">{user.email}</p>
                            </div>
                            <div className="rounded-full border border-[#3B5BDB]/20 bg-[#3B5BDB]/5 px-2.5 py-1 text-[10px] font-bold text-[#3B5BDB]">
                                {user.roles?.[0]?.toString().toUpperCase() || 'MEMBER'}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] p-5">
                            <div className="flex-1">
                                <p className="text-[16px] font-semibold text-[#1a1a2e]">Selamat Datang</p>
                                <p className="mt-0.5 text-[12px] text-[#64748b]">Silahkan login untuk masuk</p>
                            </div>
                            <Link
                                href={route('login')}
                                className="rounded-[10px] bg-[#1a1a2e] px-4 py-2 text-[13px] font-medium text-white transition-transform active:scale-95"
                            >
                                Login
                            </Link>
                        </div>
                    )}

                    {/* Menu Rows */}
                    <div className="p-2.5">
                        {dropdownMenuItems.map((item) => {
                            const isActive = currentPath === item.url;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    className={cn(
                                        'group mb-0.5 flex h-[52px] items-center justify-between rounded-[12px] px-3 transition-all duration-150 last:mb-0',
                                        isActive ? 'bg-[#3B5BDB]/8 text-[#3B5BDB]' : 'text-[#1a1a2e] hover:bg-[rgba(0,0,0,0.04)]',
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            className={cn(
                                                'h-5 w-5 transition-colors',
                                                isActive ? 'text-[#3B5BDB]' : 'text-[#64748b] group-hover:text-[#1a1a2e]',
                                            )}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                        <span className={cn('text-[15px] font-medium', isActive ? 'text-[#3B5BDB]' : 'text-[#1a1a2e]')}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.metadata && <div className="flex items-center">{item.metadata}</div>}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Bottom Padding for iOS Home Indicator */}
                    <div className="h-4" />
                </div>
            </div>
        </>
    );
}
