import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

export function HomePrestasiSection({ prestasis }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            const cards = gsap.utils.toArray('.prestasi-item');

            gsap.fromTo(
                '.prestasi-title',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    },
                }
            );

            if (cards.length > 0) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, scale: 0.9, y: 30 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top 75%',
                        },
                    }
                );
            }
        },
        { scope: containerRef }
    );

    if (!prestasis || prestasis.length === 0) return null;

    return (
        <section ref={containerRef} className="bg-[#fafafc] py-16 md:py-24">
            <div className="mx-auto max-w-[1200px] px-6 md:px-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between prestasi-title">
                    <div>
                        <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-[#1d1d1f] md:text-[40px]">
                            Prestasi Anggota
                        </h2>
                        <p className="mt-3 text-[16px] text-[#86868b] md:text-[20px] max-w-2xl">
                            Beragam pencapaian luar biasa oleh anggota GenBI Unugiri yang menginspirasi.
                        </p>
                    </div>
                    <Link
                        href={route('prestasi.index')}
                        className="group mt-4 inline-flex items-center gap-1 text-[16px] font-medium text-[#0066cc] md:mt-0 transition hover:text-[#005bb5]"
                    >
                        Lihat semua
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                    {prestasis.slice(0, 6).map((item) => (
                        <div
                            key={item.id}
                            className="prestasi-item relative overflow-hidden rounded-[16px] bg-white ring-1 ring-[#e0e0e0] md:rounded-[22px] shadow-sm hover:shadow-md transition-shadow"
                            style={{ aspectRatio: '3/4' }}
                        >
                            <div className="flex h-full w-full items-center justify-center bg-[#fafafc]">
                                {item.user.avatar ? (
                                    <img
                                        src={`/storage/${item.user.avatar}`}
                                        alt={item.user.name}
                                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                ) : (
                                    <div className="text-[24px] font-medium text-[#0066cc] md:text-[40px]">
                                        {item.user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-16" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
                                <p className="truncate text-[13px] font-semibold text-white md:text-[16px]">
                                    {item.user.name}
                                </p>
                                <p className="truncate text-[12px] text-[#e0e0e0] font-medium mt-0.5 md:text-[14px]">
                                    {item.title}
                                </p>
                                <p className="line-clamp-2 mt-1 text-[11px] text-[#a1a1a6] leading-relaxed md:text-[12px]">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
