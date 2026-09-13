import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Home, Info, LayoutGrid, Newspaper, User, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogoIcon from './app-logo-icon';

// ─── Design Tokens — Refined Glass ──────────────────────────────
// Brand accent dipertahankan dari desain asli, hanya ditambah varian
// deep/soft supaya gradasi & tint terasa lebih "premium" tanpa lepas dari identitas.
const INK = '#12121F';
const INK_SOFT = '#5B6172';
const ACCENT = '#3B5BDB';
const ACCENT_DEEP = '#2A3FA8';
const ACCENT_SOFT = '#EEF1FD';
const HAIRLINE = 'rgba(18, 18, 31, 0.08)';

// Bahasa "glass" yang sama dipakai ulang di header, bottom-nav, dan sheet
// (ambient depth + contact shadow + inner highlight) supaya ketiganya terasa
// satu material, bukan tiga treatment yang beda-beda.
const glassShadow = (elevated = false) =>
    [
        '0 1px 2px rgba(18,18,31,0.04)',
        elevated ? '0 20px 48px -16px rgba(18,18,31,0.22)' : '0 12px 32px -14px rgba(18,18,31,0.16)',
        'inset 0 1px 0 rgba(255,255,255,0.7)',
    ].join(', ');

const EASE = [0.16, 1, 0.3, 1] as const;

const normalizePath = (url: string) => {
    const path = url.split(/[?#]/, 1)[0];

    return path.replace(/\/+$/, '') || '/';
};

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
    const currentPath = normalizePath(page.url);
    const prefersReducedMotion = useReducedMotion();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Tutup menu saat navigasi
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [currentPath]);

    useEffect(() => {
        if (!mobileMenuOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen]);

    const navItems: NavItemData[] = [
        { id: 'home', label: 'Home', url: '/', icon: Home },
        { id: 'Profile', label: 'Profile', url: route('profile'), icon: User },
        { id: 'beasiswa', label: 'Informasi Beasiswa', url: '/beasiswa', icon: Info },
        { id: 'berita', label: 'Berita', url: '/berita', icon: Newspaper },
        { id: 'divisi', label: 'Divisi', url: '/divisi', icon: Users },
    ];

    // Dihitung sekali, dipakai di 2 tempat (desktop dashboard link & dropdown mobile) — di kode asli logic role-check ini ditulis dua kali terpisah.
    const isAdmin = user?.roles?.some((r) => ['Superadmin', 'admin'].includes(r as string));
    const dashboardUrl = isAdmin ? '/dashboard' : '/user/dashboard';

    const dropdownMenuItems: NavItemData[] = [
        { id: 'home', label: 'Home', url: '/', icon: Home },
        { id: 'dashboard', label: 'Dashboard', url: dashboardUrl, icon: LayoutGrid },
    ];

    const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);

    // Menentukan ikon apa yang tampil di tombol toggle saat ini — dipakai untuk crossfade di bawah.
    const toggleIconKey = mobileMenuOpen ? 'close' : user ? 'user' : 'grid';

    return (
        <>
            {/* DESKTOP NAVBAR (>= 1024px) */}
            <motion.header
                initial={prefersReducedMotion ? false : { opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="fixed inset-x-4 top-4 z-50 mx-auto hidden h-16 w-[calc(100%-2rem)] max-w-6xl items-center justify-between rounded-[28px] px-4 backdrop-blur-2xl transition-shadow duration-300 lg:flex lg:px-6"
                style={{
                    background: 'rgba(252, 252, 254, 0.72)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: glassShadow(scrolled),
                }}
            >
                {/* Left: Logo — tap feedback halus, bukan sekadar hover */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
                            <AppLogoIcon className="h-7 w-auto fill-current text-[#12121F]" />
                        </motion.div>
                    </Link>
                </div>

                {/* Center: Navigation — satu indicator pill yang "meluncur" antar item aktif */}
                <nav className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = currentPath === normalizePath(item.url);
                        return (
                            <motion.div
                                key={item.id}
                                whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                                whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                                className="rounded-full"
                            >
                                <Link
                                    href={item.url}
                                    aria-current={isActive ? 'page' : undefined}
                                    className="relative block rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors duration-150"
                                    style={{ color: isActive ? ACCENT : INK }}
                                >
                                    {isActive ? (
                                        <motion.div
                                            layoutId="desktop-active-pill"
                                            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.86 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute inset-0 rounded-full"
                                            style={{ background: ACCENT_SOFT }}
                                            transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 rounded-full transition-colors duration-150 hover:bg-black/[0.04]" />
                                    )}
                                    <span className="relative">{item.label}</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <Link
                            href={dashboardUrl}
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-150 hover:bg-black/[0.04]"
                            style={{ color: INK }}
                        >
                            <div
                                className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full text-[10px] font-semibold text-white"
                                style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})` }}
                            >
                                {user.name.charAt(0)}
                            </div>
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
                            <Link
                                href={route('login')}
                                className="flex items-center rounded-full px-5 py-2 text-[14px] font-medium text-white transition-shadow duration-200"
                                style={{ background: ACCENT, boxShadow: `0 8px 20px -6px ${ACCENT}66` }}
                            >
                                Log in
                            </Link>
                        </motion.div>
                    )}
                </div>
            </motion.header>

            {/* MOBILE AND TABLET BOTTOM NAVIGATION PILL (< 1024px) */}
            <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                className="fixed right-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-0 z-50 mx-auto w-[calc(100%-1.5rem)] max-w-[400px] md:w-[min(90%,28rem)] lg:hidden"
            >
                <nav
                    aria-label="Navigasi mobile"
                    className="flex h-[68px] items-center justify-between rounded-[26px] px-1.5 backdrop-blur-2xl sm:px-2"
                    style={{ background: 'rgba(252, 252, 254, 0.82)', border: '1px solid rgba(255, 255, 255, 0.7)', boxShadow: glassShadow(true) }}
                >
                    {navItems.slice(0, 5).map((item) => {
                        const isActive = currentPath === normalizePath(item.url) && !mobileMenuOpen;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                href={item.url}
                                aria-current={isActive ? 'page' : undefined}
                                className="relative flex h-[54px] w-[54px] flex-col items-center justify-center"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-active-pill"
                                        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.75 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute h-11 w-11 rounded-[14px]"
                                        style={{ background: INK }}
                                        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                                    />
                                )}
                                <motion.div whileTap={{ scale: 0.88 }} className="relative flex h-11 w-11 items-center justify-center rounded-[14px]">
                                    <Icon
                                        className="h-[22px] w-[22px] transition-colors"
                                        style={{ color: isActive ? '#fff' : INK_SOFT }}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        fill={isActive ? 'currentColor' : 'none'}
                                    />
                                </motion.div>
                            </Link>
                        );
                    })}

                    {/* Menu Toggle — icon crossfade, bukan cut instan */}
                    <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={toggleMobileMenu}
                        type="button"
                        aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu-panel"
                        className="relative flex h-[54px] w-[54px] shrink-0 flex-col items-center justify-center"
                    >
                        <div
                            className="flex h-11 w-11 items-center justify-center rounded-[14px] transition-colors duration-200"
                            style={{ background: mobileMenuOpen ? ACCENT : 'transparent' }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={toggleIconKey}
                                    initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                                    transition={{ duration: 0.18 }}
                                    className="flex items-center justify-center"
                                >
                                    {mobileMenuOpen ? (
                                        <X className="h-[22px] w-[22px] text-white" strokeWidth={2.5} />
                                    ) : user ? (
                                        <User className="h-[22px] w-[22px]" style={{ color: INK_SOFT }} strokeWidth={2} />
                                    ) : (
                                        <LayoutGrid className="h-[22px] w-[22px]" style={{ color: INK_SOFT }} strokeWidth={2} />
                                    )}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </motion.button>
                </nav>
            </motion.div>

            {/* MOBILE DROPDOWN PANEL — mount/unmount asli via AnimatePresence, bukan opacity toggle */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 bg-black/5 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ y: 24, opacity: 0, scale: 0.97 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 16, opacity: 0, scale: 0.97 }}
                            transition={prefersReducedMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 380, damping: 32 }}
                            id="mobile-menu-panel"
                            role="dialog"
                            aria-label="Menu pengguna"
                            className="absolute right-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-0 mx-auto w-[calc(100%-1.5rem)] max-w-[400px] overflow-hidden rounded-[22px] backdrop-blur-2xl sm:w-[92%]"
                            style={{
                                background: 'rgba(252, 252, 254, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.7)',
                                boxShadow: glassShadow(true),
                            }}
                        >
                            {/* User Info Row */}
                            {user ? (
                                <div className="flex items-center gap-3 border-b p-5" style={{ borderColor: HAIRLINE }}>
                                    <div
                                        className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full text-lg font-semibold text-white"
                                        style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})` }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[15px] leading-tight font-semibold" style={{ color: INK }}>
                                            {user.name}
                                        </p>
                                        <p className="mt-0.5 text-[12px] leading-tight" style={{ color: INK_SOFT }}>
                                            {user.email}
                                        </p>
                                    </div>
                                    <div
                                        className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                                        style={{ color: ACCENT, background: ACCENT_SOFT, border: `1px solid ${ACCENT}33` }}
                                    >
                                        {user.roles?.[0]?.toString().toUpperCase() || 'MEMBER'}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between border-b p-5" style={{ borderColor: HAIRLINE }}>
                                    <div className="flex-1">
                                        <p className="text-[16px] font-semibold" style={{ color: INK }}>
                                            Selamat Datang
                                        </p>
                                        <p className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>
                                            Silahkan login untuk masuk
                                        </p>
                                    </div>
                                    <motion.div whileTap={{ scale: 0.94 }}>
                                        <Link
                                            href={route('login')}
                                            className="rounded-[10px] px-4 py-2 text-[13px] font-medium text-white"
                                            style={{ background: INK }}
                                        >
                                            Login
                                        </Link>
                                    </motion.div>
                                </div>
                            )}

                            {/* Menu Rows */}
                            <div className="p-2.5">
                                {dropdownMenuItems.map((item) => {
                                    const isActive = currentPath === normalizePath(item.url);
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.url}
                                            aria-current={isActive ? 'page' : undefined}
                                            className={cn(
                                                'group mb-0.5 flex h-[52px] items-center justify-between rounded-[12px] px-3 transition-colors duration-150 last:mb-0',
                                                !isActive && 'hover:bg-black/[0.04]',
                                            )}
                                            style={{ background: isActive ? ACCENT_SOFT : 'transparent' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon
                                                    className="h-5 w-5 transition-colors"
                                                    style={{ color: isActive ? ACCENT : INK_SOFT }}
                                                    strokeWidth={isActive ? 2.5 : 2}
                                                />
                                                <span className="text-[15px] font-medium" style={{ color: isActive ? ACCENT : INK }}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            {item.metadata && <div className="flex items-center">{item.metadata}</div>}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="h-4" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
