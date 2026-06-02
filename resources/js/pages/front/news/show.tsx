import { NewsCard } from '@/components/news-card';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface NewsShowProps {
    news: any;
    recentNews: any[];
}

export default function NewsShow({ news, recentNews }: NewsShowProps) {
    return (
        <div className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Head title={news.title} />
            <PublicNavbar />

            <main className="pt-[120px]">
                {/* Navigation Back */}

                {/* Article Header */}
                <article>
                    <header className="mx-auto max-w-[980px] px-6 pb-12">
                        <h1 className="mb-6 text-[34px] leading-[1.1] font-semibold tracking-tight text-[#1d1d1f] md:text-[48px]">{news.title}</h1>
                        <div className="flex items-center gap-4 text-[15px] text-[#7a7a7a]">
                            <span>{format(new Date(news.published_at), 'dd MMMM yyyy', { locale: id })}</span>
                            <span className="h-1 w-1 rounded-full bg-[#d2d2d7]" />
                            <span>Oleh {news.author?.name || 'Admin'}</span>
                            <span>{news.category.name}</span>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {news.image_path && (
                        <div className="mx-auto max-w-[1100px] px-6 pb-16">
                            <div className="overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                                <img src={`/storage/${news.image_path}`} alt={news.title} className="aspect-video w-full object-cover" />
                            </div>
                        </div>
                    )}

                    {/* Article Content */}
                    <div
                        className="prose prose-lg prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[#0066cc] prose-img:rounded-[18px] mx-auto max-w-[800px] px-6 pb-24"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                </article>

                {/* Recent News Section */}
                {recentNews.length > 0 && (
                    <section className="border-t border-[#f0f0f0] bg-[#f5f5f7] py-[80px]">
                        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
                            <h2 className="mb-12 text-[28px] font-semibold tracking-tight text-[#1d1d1f] md:text-[34px]">Berita Terkait Lainnya</h2>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {recentNews.map((item) => (
                                    <NewsCard key={item.id} news={item} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <PublicFooter />
        </div>
    );
}
