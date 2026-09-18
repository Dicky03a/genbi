import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { useGSAP } from '@gsap/react';
import { Link } from '@inertiajs/react';
import { Seo } from '@/components/seo';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface Division {
    id: number;
    name: string;
    keterangan: string;
    foto: string | null;
}

interface Props {
    divisions: Division[];
}

export default function DivisionIndex({ divisions }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Initial state
            gsap.set(['.hero-title', '.hero-text', '.division-card'], {
                y: 30,
                opacity: 0,
            });

            // Hero title
            gsap.to('.hero-title', {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
            });

            // Hero text
            gsap.to('.hero-text', {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out',
            });

            // Cards entrance
            if (divisions.length > 0) {
                gsap.to('.division-card', {
                    y: 0,
                    opacity: 1,
                    duration: 0.2,
                    stagger: 0.1,
                    delay: 0.4,
                    ease: 'power2.out',
                });
            }
        },
        { scope: containerRef, dependencies: [divisions] },
    );

    const breadcrumbs = [{ title: 'Divisi', href: '/divisi' }];

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const description = 'Kenali divisi-divisi yang menggerakkan GenBI Unugiri dan peran masing-masing dalam organisasi kami.';

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Seo 
                title="Struktur Divisi | GenBI Unugiri" 
                description={description} 
                url={pageUrl} 
            />
            <PublicNavbar />

            <main className="md:pt-[10px]">
                {/* Hero Section */}
                <section className="py-[44px] md:py-[120px]">
                    <div className="mx-auto max-w-[980px] px-6 text-center">
                        <h1 className="hero-title text-[30px] leading-[1.07] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[56px] lg:tracking-[-0.28px]">
                            Struktur Divisi.
                        </h1>
                        <p className="hero-text mt-5 text-[17px] leading-[1.47] text-[#1d1d1f] md:mt-8 md:text-[24px] md:leading-[1.5] md:font-light">
                            Mengenal lebih dekat bagian-bagian yang menggerakkan organisasi kami.
                        </p>
                    </div>
                </section>

                {/* Division Grid Section */}
                <section className="py-[50px] md:py-[120px]">
                    <div className="mx-auto max-w-[1200px] px-6">
                        {divisions.length > 0 ? (
                            <div className="division-grid grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                                {divisions.map((item) => (
                                    <div
                                        key={item.id}
                                        className="division-card group flex flex-col overflow-hidden rounded-[18px] bg-white ring-1 ring-[#e0e0e0] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] md:rounded-[22px]"
                                    >
                                        {/* Division Image */}
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5f5f7]">
                                            {item.foto ? (
                                                <img
                                                    src={`/storage/${item.foto}`}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[#7a7a7a]">
                                                    <span className="text-[14px]">No Image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col p-5 md:p-8">
                                            <h2 className="mb-3 text-[18px] font-semibold tracking-tight text-[#1d1d1f] md:mb-4 md:text-[24px]">
                                                {item.name}
                                            </h2>
                                            <p className="mb-5 line-clamp-3 flex-1 text-[15px] leading-relaxed text-[#7a7a7a] md:mb-8 md:text-[17px]">
                                                {item.keterangan}
                                            </p>
                                            <div className="mt-auto">
                                                <Link
                                                    href={route('divisi.show', item.id)}
                                                    className="inline-flex h-[44px] items-center gap-2 rounded-full bg-[#0066cc] px-6 text-[15px] font-medium text-white transition-all hover:bg-[#0071e3] active:scale-95"
                                                >
                                                    Detail Divisi
                                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-[400px] flex-col items-center justify-center text-center">
                                <p className="text-[21px] text-[#7a7a7a]">Belum ada data divisi yang tersedia.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
