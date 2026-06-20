import { Breadcrumbs } from '@/components/breadcrumbs';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { useGSAP } from '@gsap/react';
import { Head, Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { ChevronRight } from 'lucide-react';

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
                    duration: 0.8,
                    stagger: 0.1,
                    delay: 0.4,
                    ease: 'power2.out',
                });
            }
        },
        { scope: containerRef, dependencies: [divisions] },
    );

    const breadcrumbs = [
        { title: 'Divisi', href: '/divisi' },
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Head title="Struktur Divisi" />
            <PublicNavbar />

            <main className="md:pt-[10px]">
                {/* Hero Section */}
                <section className="py-[80px] md:py-[120px]">
                    <div className="mx-auto max-w-[980px] px-6 text-center">
                        <h1 className="hero-title text-[40px] font-semibold leading-[1.07] tracking-[-0.02em] text-[#1d1d1f] md:text-[56px] lg:tracking-[-0.28px]">
                            Struktur Divisi.
                        </h1>
                        <p className="hero-text mt-8 text-[21px] leading-[1.47] text-[#1d1d1f] md:text-[24px] md:font-light md:leading-[1.5]">
                            Mengenal lebih dekat bagian-bagian yang menggerakkan organisasi kami.
                        </p>
                    </div>
                </section>

                {/* Division Grid Section */}
                <section className="py-[100px] md:py-[120px]">
                    <div className="mx-auto max-w-[1200px] px-6">
                        {divisions.length > 0 ? (
                            <div className="division-grid grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {divisions.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="division-card group flex flex-col overflow-hidden rounded-[22px] bg-white ring-1 ring-[#e0e0e0] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
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
                                        <div className="flex flex-1 flex-col p-8">
                                            <h2 className="mb-4 text-[24px] font-semibold tracking-tight text-[#1d1d1f]">
                                                {item.name}
                                            </h2>
                                            <p className="mb-8 flex-1 text-[17px] leading-relaxed text-[#7a7a7a] line-clamp-3">
                                                {item.keterangan}
                                            </p>
                                            <div className="mt-auto">
                                                <Link 
                                                    href={route('divisi.show', item.id)}
                                                    className="inline-flex h-[44px] items-center rounded-full bg-[#0066cc] px-6 text-[15px] font-medium text-white transition-all hover:bg-[#0071e3] active:scale-95 gap-2"
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
