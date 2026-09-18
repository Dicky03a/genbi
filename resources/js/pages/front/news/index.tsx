import { NewsCard } from '@/components/news-card';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { useGSAP } from '@gsap/react';
import { Seo } from '@/components/seo';
import { gsap } from 'gsap';
import { useRef, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { router } from '@inertiajs/react';

interface NewsIndexProps {
    news: any[];
    filters?: {
        search?: string;
    };
}

export default function NewsIndex({ news, filters = {} }: NewsIndexProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchQuery !== filters.search && !(searchQuery === '' && !filters.search)) {
                router.get(
                    window.location.pathname,
                    { search: searchQuery },
                    { preserveState: true, replace: true, preserveScroll: true }
                );
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchQuery, filters.search]);

    useGSAP(
        () => {
            // Header entrance
            gsap.from('.news-header', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
            });

            // Search entrance
            gsap.from('.news-search', {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out',
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

                {/* Search Section */}
                <section className="news-search -mt-[10px] mb-[10px] md:-mt-[40px] md:mb-[20px]">
                    <div className="mx-auto max-w-[600px] px-6">
                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-500">
                                <Search className="h-[22px] w-[22px]" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari berita atau artikel..."
                                className="w-full rounded-[24px] border border-[#d2d2d7] bg-white py-[16px] pl-[48px] pr-[20px] text-[17px] font-medium text-[#1d1d1f] shadow-sm outline-none transition-all duration-300 placeholder:text-[#86868b] hover:border-[#1d1d1f] hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:shadow-md"
                            />
                        </div>
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
