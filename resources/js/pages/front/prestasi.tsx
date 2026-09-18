import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { useGSAP } from '@gsap/react';
import { Seo } from '@/components/seo';
import { gsap } from 'gsap';
import { useRef } from 'react';

interface User {
    id: number;
    name: string;
    avatar: string | null;
}

interface Prestasi {
    id: number;
    title: string;
    description: string;
    user: User;
}

interface Props {
    prestasis: Prestasi[];
}

export default function PrestasiIndex({ prestasis = [] }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.prestasi-header', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
            });

            if (prestasis.length > 0) {
                gsap.from('.prestasi-card', {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    delay: 0.2,
                    ease: 'power3.out',
                });
            }
        },
        { scope: containerRef, dependencies: [prestasis] },
    );

    const description = 'Daftar prestasi membanggakan yang diraih oleh anggota GenBI Unugiri.';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Seo title="Prestasi | GenBI Unugiri" description={description} url={pageUrl} />
            <PublicNavbar />

            <main className="pt-2 md:pt-[40px]">
                {/* Header Section */}
                <section className="prestasi-header py-[40px] md:py-[80px]">
                    <div className="mx-auto max-w-[980px] px-6 text-center">
                        <h1 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[56px] lg:tracking-[-0.28px]">
                            Prestasi GenBI
                        </h1>
                        <p className="mt-4 text-[17px] leading-[1.47] text-[#1d1d1f]/70 md:mt-6 md:text-[21px]">
                            {description}
                        </p>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="pb-[80px] md:pb-[120px]">
                    <div className="mx-auto max-w-[1200px] px-6 md:px-12">
                        {prestasis.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                                {prestasis.map((item) => (
                                    <div
                                        key={item.id}
                                        className="prestasi-card relative overflow-hidden rounded-[16px] bg-white ring-1 ring-[#e0e0e0] md:rounded-[22px]"
                                        style={{ aspectRatio: '3/4' }}
                                    >
                                        <div className="flex h-full w-full items-center justify-center bg-[#fafafc]">
                                            {item.user.avatar ? (
                                                <img
                                                    src={`/storage/${item.user.avatar}`}
                                                    alt={item.user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-[24px] font-medium text-[#0066cc] md:text-[32px]">
                                                    {item.user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-12 md:px-4 md:pb-4 md:pt-16" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}>
                                            <p className="truncate text-[12px] font-semibold text-white md:text-[14px]">
                                                {item.user.name}
                                            </p>
                                            <p className="truncate text-[11px] text-[#cccccc] md:text-[12px] font-medium mt-0.5">
                                                {item.title}
                                            </p>
                                            <p className="line-clamp-2 mt-1 text-[10px] text-gray-400 md:text-[11px] leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-[300px] flex-col items-center justify-center text-center">
                                <p className="text-[21px] text-[#7a7a7a]">Belum ada data prestasi yang ditambahkan.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
