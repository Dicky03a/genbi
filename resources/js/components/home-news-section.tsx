import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { NewsCard } from './news-card';

interface HomeNewsSectionProps {
    news: any[];
}

export function HomeNewsSection({ news }: HomeNewsSectionProps) {
    if (!news || news.length === 0) return null;

    return (
        <section className="bg-white py-[80px] md:py-[100px]">
            <div className="mx-auto max-w-[1440px] px-6 md:px-12">
                <div className="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
                    <div className="max-w-[600px] space-y-4">
                        <h2 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.374px] text-[#1d1d1f] md:text-[48px] lg:tracking-[-0.28px]">
                            Berita & Artikel Terbaru
                        </h2>
                        <p className="text-[19px] leading-[1.47] text-[#7a7a7a] md:text-[21px]">
                            Ikuti perkembangan terbaru dan kegiatan inspiratif dari komunitas GenBI.
                        </p>
                    </div>
                    
                    <Link
                        href={route('berita.index')}
                        className="group inline-flex items-center text-[17px] font-medium text-[#0066cc] hover:underline md:text-[19px]"
                    >
                        Lihat Semua Berita
                        <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {news.map((item) => (
                        <div key={item.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                            <NewsCard news={item} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
