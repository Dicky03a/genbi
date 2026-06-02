import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { NewsCard } from '@/components/news-card';
import { Head } from '@inertiajs/react';

interface NewsIndexProps {
    news: any[];
}

export default function NewsIndex({ news }: NewsIndexProps) {
    return (
        <div className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Head title="Berita & Artikel" />
            <PublicNavbar />

            <main className="pt-[100px]">
                {/* Header Section */}
                <section className="bg-[#f5f5f7] py-[64px] md:py-[100px]">
                    <div className="mx-auto max-w-[980px] px-6 text-center">
                        <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#1d1d1f] md:text-[56px] lg:tracking-[-0.28px]">
                            Berita & Artikel
                        </h1>
                        <p className="mt-6 text-[19px] leading-[1.47] text-[#1d1d1f] md:text-[21px]">
                            Temukan cerita terbaru, pengumuman, dan artikel informatif dari kami.
                        </p>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="py-[80px]">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12">
                        {news.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {news.map((item) => (
                                    <NewsCard key={item.id} news={item} />
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
