import { NewsCard } from '@/components/news-card';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { useGSAP } from '@gsap/react';
import { Seo } from '@/components/seo';
import { gsap } from 'gsap';
import { useRef } from 'react';

interface NewsIndexProps {
    news: any[];
}

export default function NewsIndex({ news }: NewsIndexProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Header entrance
            gsap.from('.news-header', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
            });

            // Grid entrance
            if (news.length > 0) {
                gsap.from('.news-card-item', {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    delay: 0.4,
                    ease: 'power3.out',
                });
            }
        },
        { scope: containerRef, dependencies: [news] },
    );

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const description = 'Temukan berita terbaru, pengumuman, dan artikel informatif dari GenBI Unugiri.';

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Seo 
                title="Berita & Artikel | GenBI Unugiri" 
                description={description} 
                url={pageUrl} 
            />
            <PublicNavbar />

            <main className="pt-2 md:pt-[40px]">
                {/* Header Section */}
                <section className="news-header py-[40px] md:py-[100px]">
                    <div className="mx-auto max-w-[980px] px-6 text-center">
                        <h1 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#1d1d1f] md:text-[56px] lg:tracking-[-0.28px]">
                            Berita & Artikel
                        </h1>
                        <p className="mt-4 text-[17px] leading-[1.47] text-[#1d1d1f] md:mt-6 md:text-[21px]">
                            Temukan cerita terbaru, pengumuman, dan artikel informatif dari kami.
                        </p>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="py-[40px] md:py-[80px]">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12">
                        {news.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {news.map((item) => (
                                    <div key={item.id} className="news-card-item">
                                        <NewsCard news={item} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-[400px] flex-col items-center justify-center text-center">
                                <p className="text-[21px] text-[#7a7a7a]">Belum ada berita yang diterbitkan.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
