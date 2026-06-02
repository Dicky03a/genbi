import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { stripHtml } from '@/lib/utils';
import { HomeSection } from '@/pages/front/home';
import { type SharedData } from '@/types';
import { useGSAP } from '@gsap/react';
import { Head } from '@inertiajs/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

interface AppPageProps extends SharedData {
    about: {
        tagline: string;
        vision: string;
        mission: string[];
        profile: string;
    };
}

export default function App({ about }: AppPageProps) {
    const marqueeRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const marquee = marqueeRef.current;
            if (!marquee) return;

            const items = marquee.querySelectorAll('.marquee-item');
            const gap = window.innerWidth < 768 ? 48 : 96; // gap-12 = 48px, md:gap-24 = 96px
            const totalWidth = Array.from(items).reduce((acc, item) => acc + (item as HTMLElement).offsetWidth + gap, 0) / 2;

            gsap.to(marquee, {
                x: `-=${totalWidth}`,
                duration: 25,
                ease: 'none',
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
                },
            });
        },
        { scope: marqueeRef },
    );

    const partners = [
        { name: 'Bank Indonesia', logo: '/asset/logo/Logo Bank Indonesia (Biru).webp' },
        { name: 'CBP Rupiah', logo: '/asset/logo/CBP Rupiah.webp' },
        { name: 'GenBI', logo: '/asset/logo/Horizontal Stack Up Lock Up.webp' },
    ];

    // Duplicate partners for seamless loop
    const displayPartners = [...partners, ...partners, ...partners, ...partners];

    return (
        <div className="min-h-screen bg-[#ffffff] font-sans text-[#1d1d1f] selection:bg-[#0066cc]/20 selection:text-[#0066cc]">
            <Head title="GenBi Unugiri" />

            <PublicNavbar />

            {/* Main Content Area */}
            <main className="flex min-h-screen flex-col pt-[4px]">
                {/* Home Hero Section */}
                <HomeSection tagline={stripHtml(about.tagline)} />

                {/* Logo Marquee Section */}
                <section className="overflow-hidden border-b border-[#f0f0f0] bg-white py-10 md:py-12">
                    <div className="relative">
                        {/* Gradient Masks */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-48" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-48" />

                        <div ref={marqueeRef} className="flex w-max items-center gap-12 whitespace-nowrap md:gap-24">
                            {displayPartners.map((partner, i) => (
                                <div
                                    key={i}
                                    className="marquee-item flex items-center justify-center opacity-50 grayscale transition-all duration-500 ease-in-out hover:opacity-100 hover:grayscale-0"
                                >
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="h-8 w-auto object-contain px-2 md:h-10 md:px-4"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
