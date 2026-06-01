import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Home, 
    User, 
    Users, 
    Info, 
    Newspaper, 
    ChevronRight, 
    LayoutGrid, 
    Bell,
    Settings,
    FileText,
    LogOut,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
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
        { id: 'dashboard', label: 'Dashboard', url: user?.roles?.some(r => ['Superadmin', 'admin'].includes(r as string)) ? '/dashboard' : '/user/dashboard', icon: LayoutGrid },
    ];

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <>
            {/* DESKTOP NAVBAR (≥ 768px) */}
            <header 
                className={cn(
                    "hidden mx-80 my-8 rounded-3xl md:flex fixed top-0 left-0 right-0 h-[64px] z-50 items-center justify-between px-6 lg:px-12 transition-all duration-300",
                    "bg-[rgba(255,255,255,0.75)] backdrop-blur-[16px] border-b border-[rgba(0,0,0,0.16)]",
                    scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.06)]" : ""
                )}
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.6)', borderLeft: '1px solid rgba(255, 255, 255, 0.6)' }}
            >
                {/* Left: Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <AppLogoIcon className="h-7 w-7 fill-current text-[#1a1a2e]" />
                        <span className="font-semibold text-[17px] tracking-tight text-[#1a1a2e]">GenBI</span>
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
                                    "relative px-4 py-1.5 rounded-full text-[14px] font-medium transition-all duration-150",
                                    "hover:bg-[rgba(0,0,0,0.04)]",
                                    isActive ? "text-[#3B5BDB]" : "text-[#1a1a2e]"
                                )}
                            >
                                {item.label}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-[#3B5BDB]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <Link
                            href={user?.roles?.some(r => ['Superadmin', 'admin'].includes(r as string)) ? '/dashboard' : '/user/dashboard'}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium text-[#1a1a2e] hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                        >
                            <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] overflow-hidden">
                                {user.name.charAt(0)}
                            </div>
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="flex items-center px-5 py-2 rounded-full bg-[#3B5BDB] text-white text-[14px] font-medium hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_12px_rgba(59,91,219,0.2)]"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </header>

            {/* MOBILE BOTTOM NAVIGATION PILL (< 768px) */}
            <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50">
                <nav 
                    className={cn(
                        "flex items-center justify-between px-2 h-[68px] rounded-3xl",
                        "bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px]",
                        "border border-[rgba(255,255,255,0.7)] shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                    )}
                >
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = currentPath === item.url && !mobileMenuOpen;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                href={item.url}
                                className="relative flex flex-col items-center justify-center w-[54px] h-[54px]"
                            >
                                <div className={cn(
                                    "flex items-center justify-center w-11 h-11 rounded-[14px] transition-all duration-200",
                                    isActive ? "bg-[#1a1a2e]" : "bg-transparent"
                                )}>
                                    <Icon 
                                        className={cn(
                                            "h-[22px] w-[22px] transition-colors",
                                            isActive ? "text-white" : "text-[#64748b]"
                                        )} 
                                        strokeWidth={isActive ? 2.5 : 2}
                                        fill={isActive ? "currentColor" : "none"}
                                    />
                                </div>
                            </Link>
                        );
                    })}
                    
                    {/* Menu Toggle / More Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="relative flex flex-col items-center justify-center w-[54px] h-[54px]"
                    >
                        <div className={cn(
                            "flex items-center justify-center w-11 h-11 rounded-[14px] transition-all duration-200",
                            mobileMenuOpen ? "bg-[#3B5BDB]" : "bg-transparent"
                        )}>
                            {mobileMenuOpen ? (
                                <Menu className="h-[22px] w-[22px] text-white" strokeWidth={2.5} />
                            ) : (
                                user ? (
                                    <User className="h-[22px] w-[22px] text-[#64748b]" strokeWidth={2} />
                                ) : (
                                    <LayoutGrid className="h-[22px] w-[22px] text-[#64748b]" strokeWidth={2} />
                                )
                            )}
                        </div>
                    </button>
                </nav>
            </div>

            {/* MOBILE DROPDOWN PANEL (Slide up) */}
            <div 
                className={cn(
                    "md:hidden fixed inset-0 z-40 transition-all duration-300",
                    mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                {/* Backdrop overlay */}
                <div 
                    className="absolute inset-0 bg-black/5 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
                
                {/* Upward sliding card */}
                <div 
                    className={cn(
                        "absolute bottom-[88px] left-1/2 -translate-x-1/2 w-[92%] max-w-[400px]",
                        "bg-[rgba(255,255,255,0.92)] backdrop-blur-[24px]",
                        "border border-[rgba(200,200,210,0.5)] rounded-[20px]",
                        "shadow-[0_-8px_40px_rgba(0,0,0,0.10)] overflow-hidden transition-all duration-300 ease-out",
                        mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    )}
                >
                    {/* User Info Row */}
                    {user ? (
                        <div className="p-5 flex items-center gap-3 border-b border-[rgba(0,0,0,0.06)]">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#3B5BDB] to-[#5c7cfa] text-white flex items-center justify-center text-lg font-semibold overflow-hidden">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-semibold text-[#1a1a2e] leading-tight">{user.name}</p>
                                <p className="text-[12px] text-[#64748b] leading-tight mt-0.5">{user.email}</p>
                            </div>
                            <div className="px-2.5 py-1 rounded-full border border-[#3B5BDB]/20 bg-[#3B5BDB]/5 text-[#3B5BDB] text-[10px] font-bold">
                                {user.roles?.[0]?.toString().toUpperCase() || 'MEMBER'}
                            </div>
                        </div>
                    ) : (
                        <div className="p-5 flex items-center justify-between border-b border-[rgba(0,0,0,0.06)]">
                            <div className="flex-1">
                                <p className="text-[16px] font-semibold text-[#1a1a2e]">Selamat Datang</p>
                                <p className="text-[12px] text-[#64748b] mt-0.5">Silahkan login untuk masuk</p>
                            </div>
                            <Link 
                                href={route('login')}
                                className="px-4 py-2 bg-[#1a1a2e] text-white rounded-[10px] text-[13px] font-medium active:scale-95 transition-transform"
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
                                        "flex items-center justify-between h-[52px] px-3 rounded-[12px] transition-all duration-150 group mb-0.5 last:mb-0",
                                        isActive ? "bg-[#3B5BDB]/8 text-[#3B5BDB]" : "hover:bg-[rgba(0,0,0,0.04)] text-[#1a1a2e]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={cn(
                                            "w-5 h-5 transition-colors",
                                            isActive ? "text-[#3B5BDB]" : "text-[#64748b] group-hover:text-[#1a1a2e]"
                                        )} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className={cn(
                                            "text-[15px] font-medium",
                                            isActive ? "text-[#3B5BDB]" : "text-[#1a1a2e]"
                                        )}>{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.metadata && (
                                            <div className="flex items-center">
                                                {item.metadata}
                                            </div>
                                        )}
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
