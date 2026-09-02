import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    FileText,
    GraduationCap,
    Home,
    Info,
    Lock,
    Map,
    Newspaper,
    ScrollText,
    Users,
} from 'lucide-react';

interface SitemapLink {
    label: string;
    href: string;
    description: string;
    icon: React.ReactNode;
    external?: boolean;
}

interface SitemapSection {
    category: string;
    color: string;
    links: SitemapLink[];
}

const sitemapData: SitemapSection[] = [
    {
        category: 'Halaman Utama',
        color: '#0066cc',
        links: [
            {
                label: 'Beranda',
                href: '/',
                description: 'Halaman utama GenBI Unugiri dengan informasi terkini dan tautan cepat.',
                icon: <Home className="h-5 w-5" />,
            },
        ],
    },
    {
        category: 'Tentang Kami',
        color: '#34c759',
        links: [
            {
                label: 'Profil GenBI',
                href: '/profile',
                description: 'Sejarah, visi, misi, dan gambaran umum organisasi GenBI Unugiri.',
                icon: <Info className="h-5 w-5" />,
            },
            {
                label: 'Struktur Divisi',
                href: '/divisi',
                description: 'Daftar seluruh divisi yang menggerakkan organisasi GenBI Unugiri.',
                icon: <Building2 className="h-5 w-5" />,
            },
        ],
    },
    {
        category: 'Program & Beasiswa',
        color: '#ff9500',
        links: [
            {
                label: 'Informasi Beasiswa',
                href: '/beasiswa',
                description:
                    'Panduan lengkap beasiswa Bank Indonesia: persyaratan, prosedur, berkas, dan alur pendaftaran.',
                icon: <GraduationCap className="h-5 w-5" />,
            },
        ],
    },
    {
        category: 'Berita & Konten',
        color: '#af52de',
        links: [
            {
                label: 'Berita & Artikel',
                href: '/berita',
                description: 'Kumpulan berita terbaru, opini, dan artikel informatif dari GenBI Unugiri.',
                icon: <Newspaper className="h-5 w-5" />,
            },
        ],
    },
    {
        category: 'Informasi Legal',
        color: '#636366',
        links: [
            {
                label: 'Kebijakan Privasi',
                href: '/privacy-policy',
                description: 'Cara kami mengumpulkan, menggunakan, dan melindungi data pribadi pengguna.',
                icon: <Lock className="h-5 w-5" />,
            },
            {
                label: 'Syarat Penggunaan',
                href: '/terms-of-use',
                description: 'Ketentuan dan aturan yang mengatur penggunaan website dan layanan GenBI Unugiri.',
                icon: <ScrollText className="h-5 w-5" />,
            },
            {
                label: 'Peta Situs',
                href: '/sitemap',
                description: 'Tampilan struktural seluruh halaman yang tersedia di website GenBI Unugiri.',
                icon: <Map className="h-5 w-5" />,
            },
        ],
    },
    {
        category: 'Tautan Eksternal',
        color: '#ff3b30',
        links: [
            {
                label: 'Bank Indonesia',
                href: 'https://www.bi.go.id',
                description: 'Website resmi Bank Indonesia — lembaga pemberi beasiswa GenBI.',
                icon: <FileText className="h-5 w-5" />,
                external: true,
            },
            {
                label: 'Universitas Nahdlatul Ulama Sunan Giri',
                href: 'https://unugiri.ac.id',
                description: 'Website resmi Universitas Nahdlatul Ulama Sunan Giri, Bojonegoro.',
                icon: <BookOpen className="h-5 w-5" />,
                external: true,
            },
            {
                label: 'GenBI Nasional',
                href: 'https://genbi.id',
                description: 'Portal resmi Generasi Baru Indonesia tingkat nasional.',
                icon: <Users className="h-5 w-5" />,
                external: true,
            },
        ],
    },
];

export default function Sitemap() {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const description = 'Peta situs GenBI Unugiri — temukan semua halaman yang tersedia di website kami dengan mudah.';

    return (
        <div className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Head title="Peta Situs | GenBI Unugiri">
                <meta name="description" content={description} />
                <meta property="og:title" content="Peta Situs | GenBI Unugiri" />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={`${origin}/asset/foto/home-1920.webp`} />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="GenBI Unugiri" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Peta Situs | GenBI Unugiri" />
                <meta name="twitter:description" content={description} />
                <link rel="canonical" href={pageUrl} />
            </Head>

            <PublicNavbar />

            <main className="pt-8 md:pt-[80px]">
                {/* Hero */}
                <section className="border-b border-[#f0f0f0] py-[44px] md:py-[80px]">
                    <div className="mx-auto max-w-[980px] px-6 text-center">
                        <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-[#0066cc]">
                            Navigasi
                        </p>
                        <h1 className="text-[32px] font-semibold leading-[1.07] tracking-[-0.02em] text-[#1d1d1f] md:text-[52px]">
                            Peta Situs
                        </h1>
                        <p className="mt-4 text-[17px] leading-[1.5] text-[#7a7a7a] md:text-[19px]">
                            Temukan semua halaman dan tautan yang tersedia di website GenBI Unugiri.
                        </p>
                    </div>
                </section>

                {/* Sitemap Grid */}
                <section className="py-[60px] md:py-[100px]">
                    <div className="mx-auto max-w-[1200px] px-6">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {sitemapData.map((section) => (
                                <div
                                    key={section.category}
                                    className="flex flex-col rounded-[20px] bg-[#f5f5f7] p-6 md:p-8"
                                >
                                    {/* Category header */}
                                    <div className="mb-6 flex items-center gap-3">
                                        <div
                                            className="h-1.5 w-8 rounded-full"
                                            style={{ backgroundColor: section.color }}
                                        />
                                        <h2 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#7a7a7a]">
                                            {section.category}
                                        </h2>
                                    </div>

                                    {/* Links */}
                                    <ul className="flex flex-1 flex-col space-y-4">
                                        {section.links.map((link) => (
                                            <li key={link.href}>
                                                {link.external ? (
                                                    <a
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group flex items-start gap-3"
                                                    >
                                                        <span
                                                            className="mt-0.5 shrink-0 rounded-[10px] p-2 transition-colors group-hover:opacity-80"
                                                            style={{
                                                                backgroundColor: `${section.color}18`,
                                                                color: section.color,
                                                            }}
                                                        >
                                                            {link.icon}
                                                        </span>
                                                        <span className="flex flex-col">
                                                            <span className="flex items-center gap-1.5 text-[15px] font-semibold text-[#1d1d1f] group-hover:text-[#0066cc]">
                                                                {link.label}
                                                                <svg
                                                                    className="h-3 w-3 opacity-50"
                                                                    viewBox="0 0 12 12"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                >
                                                                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" />
                                                                </svg>
                                                            </span>
                                                            <span className="mt-0.5 text-[13px] leading-[1.5] text-[#7a7a7a]">
                                                                {link.description}
                                                            </span>
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <Link
                                                        href={link.href}
                                                        className="group flex items-start gap-3"
                                                    >
                                                        <span
                                                            className="mt-0.5 shrink-0 rounded-[10px] p-2 transition-colors group-hover:opacity-80"
                                                            style={{
                                                                backgroundColor: `${section.color}18`,
                                                                color: section.color,
                                                            }}
                                                        >
                                                            {link.icon}
                                                        </span>
                                                        <span className="flex flex-col">
                                                            <span className="text-[15px] font-semibold text-[#1d1d1f] group-hover:text-[#0066cc]">
                                                                {link.label}
                                                            </span>
                                                            <span className="mt-0.5 text-[13px] leading-[1.5] text-[#7a7a7a]">
                                                                {link.description}
                                                            </span>
                                                        </span>
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Quick reference URL list */}
                        <div className="mt-16 rounded-[20px] border border-[#e0e0e0] p-6 md:p-10">
                            <h2 className="mb-6 text-[18px] font-semibold tracking-tight text-[#1d1d1f] md:text-[22px]">
                                Referensi URL
                            </h2>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                {sitemapData.flatMap((s) =>
                                    s.links
                                        .filter((l) => !l.external)
                                        .map((link) => (
                                            <div key={link.href} className="flex items-center justify-between gap-4 rounded-[10px] px-3 py-2.5 hover:bg-[#f5f5f7]">
                                                <span className="text-[14px] text-[#424245]">{link.label}</span>
                                                <Link
                                                    href={link.href}
                                                    className="font-mono text-[12px] text-[#0066cc] hover:underline"
                                                >
                                                    {link.href}
                                                </Link>
                                            </div>
                                        )),
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
