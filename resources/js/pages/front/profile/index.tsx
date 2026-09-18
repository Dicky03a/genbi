import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { stripHtml } from '@/lib/utils';
import { Seo } from '@/components/seo';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

interface ProfileProps {
    about: {
        tagline: string;
        vision: string;
        mission: string[];
        profile: string;
    };
}

export default function ProfileIndex({ about }: ProfileProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const sectionsRef = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {
        // Hero entrance
        gsap.from(heroRef.current, {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out',
        });

        // Staggered sections entrance
        sectionsRef.current.forEach((section, index) => {
            if (section) {
                gsap.from(section, {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    delay: 0.2 * (index + 1),
                    ease: 'power3.out',
                });
            }
        });
    }, { scope: containerRef });

    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !sectionsRef.current.includes(el)) {
            sectionsRef.current.push(el);
        }
    };

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const description = about.tagline
        ? stripHtml(about.tagline).substring(0, 155)
        : 'Kenali lebih dekat Generasi Baru Indonesia (GenBI) Unugiri, komunitas penerima beasiswa Bank Indonesia yang berdedikasi.';

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Seo 
                title="Profil Kami | GenBI Unugiri" 
                description={description} 
                url={pageUrl} 
            />
            <PublicNavbar />

            <main className="pt-[20px]">
                {/* Hero Profile Section - Apple Display Style */}
                <section ref={heroRef} className="bg-white py-[44px] md:py-[120px]">
                    <div className="mx-auto max-w-[980px] px-6 text-center">
                        <h1 className="text-[30px] font-semibold leading-[1.07] tracking-[-0.02em] text-[#1d1d1f] md:text-[56px] lg:tracking-[-0.28px]">
                            {about.tagline || 'Energi Untuk Negeri.'}
                        </h1>
                        <p className="mt-5 text-[17px] leading-[1.47] text-[#1d1d1f] md:mt-8 md:text-[24px] md:font-light md:leading-[1.5]">
                            Mengenal lebih dekat Generasi Baru Indonesia.
                        </p>
                    </div>
                </section>

                {/* Sejarah & Profile Section - Large Rounded Card */}
                <section 
                    ref={addToRefs}
                    className="bg-[#f5f5f7] py-[44px] md:py-[100px]"
                >
                    <div className="mx-auto max-w-[1200px] px-6">
                        <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-[#e0e0e0] md:rounded-[32px] md:p-16">
                            <div className="mb-8 space-y-3 md:mb-12 md:space-y-4">
                                <h2 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f] md:text-[48px]">
                                    Sejarah & Profil
                                </h2>
                                <div className="h-1.5 w-24 rounded-full bg-[#0066cc]" />
                            </div>
                            <div className="prose prose-lg prose-headings:font-semibold prose-a:text-[#0066cc] max-w-none text-[19px] leading-[1.6] text-[#1d1d1f] md:text-[22px] md:font-light">
                                <div dangerouslySetInnerHTML={{ __html: about.profile }} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision & Mission Section - 1 Section, 2 Cards */}
                <section 
                    ref={addToRefs}
                    className="bg-white py-[44px] md:py-[120px]"
                >
                    <div className="mx-auto max-w-[1200px] px-6">
                        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
                            {/* Vision Card - Parchment Style */}
                            <div className="flex flex-col justify-center rounded-[24px] bg-[#f5f5f7] p-5 md:rounded-[32px] md:p-12">
                                <div className="mb-5 space-y-2 md:mb-8">
                                    <h2 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f] md:text-[34px]">
                                        Visi Kami
                                    </h2>
                                    <div className="h-1 w-12 rounded-full bg-[#0066cc]" />
                                </div>
                                <blockquote className="text-[17px] font-light leading-[1.5] italic text-[#1d1d1f] md:text-[28px]">
                                    "{stripHtml(about.vision)}"
                                </blockquote>
                            </div>

                            {/* Mission Card - Dark Tile Style */}
                            <div className="rounded-[24px] bg-[#272729] p-5 text-white shadow-xl md:rounded-[32px] md:p-12">
                                <div className="mb-8 space-y-2">
                                    <h2 className="text-[28px] font-semibold tracking-tight md:text-[34px]">
                                        Misi Kami
                                    </h2>
                                    <div className="h-1 w-12 rounded-full bg-[#0066cc]" />
                                </div>
                                <div className="space-y-6">
                                    {about.mission.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <p className="text-[17px] leading-[1.5] text-[#cccccc] md:text-[19px]">
                                                {stripHtml(item)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action - Parchment Tile */}
                <section 
                    ref={addToRefs}
                    className="bg-[#f5f5f7] py-[44px] md:py-[120px]"
                >
                    <div className="mx-auto max-w-[980px] px-6 text-center">
                        <h2 className="mb-6 text-[26px] font-semibold tracking-tight text-[#1d1d1f] md:mb-8 md:text-[48px]">
                            Ingin tahu lebih banyak?
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a 
                                href="/beasiswa" 
                                className="inline-flex h-[44px] items-center rounded-full bg-[#0066cc] px-6 text-[17px] font-medium text-white transition-all hover:bg-[#0071e3] active:scale-95"
                            >
                                Informasi Beasiswa
                            </a>
                            <a 
                                href="/berita" 
                                className="inline-flex h-[44px] items-center rounded-full bg-white px-6 text-[17px] font-medium text-[#0066cc] ring-1 ring-[#0066cc] transition-all hover:bg-[#f5f5f7] active:scale-95"
                            >
                                Berita Terbaru
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
