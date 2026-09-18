import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { useInitials } from '@/hooks/use-initials';
import { useGSAP } from '@gsap/react';
import { Seo } from '@/components/seo';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    prodi: string | null;
}

interface Division {
    id: number;
    name: string;
    keterangan: string;
    foto: string | null;
    users: User[];
}

interface Props {
    division: Division;
}

export default function DivisionShow({ division }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const getInitials = useInitials();

    useGSAP(
        () => {
            // Initial state
            gsap.set(['.hero-badge', '.hero-title', '.hero-line', '.hero-text', '.member-card'], {
                y: 30,
                opacity: 0,
            });

            // Hero badge
            gsap.to('.hero-badge', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
            });

            // Hero title
            gsap.to('.hero-title', {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 0.1,
                ease: 'power3.out',
            });

            // Hero line
            gsap.to('.hero-line', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.2,
                ease: 'power3.out',
            });

            // Hero text
            gsap.to('.hero-text', {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 0.3,
                ease: 'power3.out',
            });

            // Member grid animation
            if (division.users.length > 0) {
                gsap.to('.member-card', {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    delay: 0.5,
                    ease: 'power3.out',
                });
            }
        },
        { scope: containerRef, dependencies: [division] },
    );

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const description = division.keterangan
        ? division.keterangan.substring(0, 155)
        : `Kenali lebih dekat Divisi ${division.name} di GenBI Unugiri.`;
    const imageUrl = division.foto ? `${origin}/storage/${division.foto}` : `${origin}/asset/foto/home-1920.webp`;

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Seo 
                title={`Divisi ${division.name} | GenBI Unugiri`}
                description={description}
                image={imageUrl}
                url={pageUrl}
            />
            <PublicNavbar />

            <main className="pt-0 md:pt-[100px]">
                {/* Hero Section */}
                <section className="bg-white py-[44px] md:py-[100px]">
                    <div className="mx-auto max-w-[980px] px-6 text-center">
                        <h1 className="hero-title mb-5 text-[28px] font-semibold leading-[1.07] tracking-[-0.02em] text-[#1d1d1f] md:mb-8 md:text-[56px] lg:tracking-[-0.28px]">
                            {division.name}.
                        </h1>
                        <div className="hero-line mx-auto mb-6 h-1.5 w-20 rounded-full bg-[#0066cc] md:mb-10 md:w-24" />
                        <p className="hero-text mx-auto max-w-[800px] text-[16px] leading-[1.6] text-[#1d1d1f] md:text-[22px] md:font-light">
                            {division.keterangan}
                        </p>
                    </div>
                </section>

                {/* Members Section */}
                <section className="bg-[#f5f5f7] py-[50px] md:py-[120px]">
                    <div className="mx-auto max-w-[1200px] px-6">
                        <div className="mb-10 text-center md:mb-16">
                            <h2 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]">
                                Anggota Divisi
                            </h2>
                            <p className="mt-3 text-[15px] text-[#7a7a7a] md:mt-4 md:text-[17px]">
                                Bersama-sama membangun energi untuk negeri.
                            </p>
                        </div>

                        {division.users.length > 0 ? (
                            <div className="member-grid grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                                {division.users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="member-card relative overflow-hidden rounded-[16px] bg-white ring-1 ring-[#e0e0e0] md:rounded-[22px]"
                                        style={{ aspectRatio: '3/4' }}
                                    >
                                        {/* User Photo / Initials */}
                                        <div className="flex h-full w-full items-center justify-center bg-[#fafafc]">
                                            {user.avatar ? (
                                                <img
                                                    src={`/storage/${user.avatar}`}
                                                    alt={user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-[24px] font-medium text-[#0066cc] md:text-[32px]">
                                                    {getInitials(user.name)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom gradient caption */}
                                        <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-10 md:px-4 md:pb-4 md:pt-12" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}>
                                            <p className="truncate text-[12px] font-semibold text-white md:text-[14px]">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-[11px] text-[#cccccc] md:text-[12px]">
                                                {user.prodi ?? 'Tidak ada prodi'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-[300px] flex-col items-center justify-center text-center">
                                <p className="text-[19px] text-[#7a7a7a]">Belum ada anggota yang ditugaskan di divisi ini.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
