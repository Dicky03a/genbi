import { NewsCard } from '@/components/news-card';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { stripHtml } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

interface NewsShowProps {
    news: any;
    recentNews: any[];
}

export default function NewsShow({ news, recentNews }: NewsShowProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const description = news.content
        ? stripHtml(news.content).substring(0, 155).trim() + '...'
        : `Baca artikel "${news.title}" di GenBI Unugiri.`;
    const imageUrl = news.image_path
        ? `${origin}/storage/${news.image_path}`
        : `${origin}/asset/foto/home-1920.webp`;

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: news.title,
            image: news.image_path ? [`${origin}/storage/${news.image_path}`] : [],
            datePublished: news.published_at,
            author: { '@type': 'Person', name: news.author?.name || 'Admin' },
            publisher: {
                '@type': 'Organization',
                name: 'GenBI Unugiri',
                logo: { '@type': 'ImageObject', url: `${origin}/asset/logo/Horizontal Stack Up Lock Up.webp` },
            },
            description,
        });
        document.head.appendChild(script);
        return () => { document.head.removeChild(script); };
    }, [news.id]);

    useGSAP(
        () => {
            // Header entrance
            gsap.from('.article-header', {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            });

            // Image entrance
            gsap.from('.article-image', {
                y: 40,
                opacity: 0,
                duration: 1.2,
                delay: 0.2,
                ease: 'power3.out',
            });

            // Content entrance
            gsap.from('.article-content', {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.4,
                ease: 'power3.out',
            });

            // Recent news entrance
            if (recentNews.length > 0) {
                gsap.from('.recent-news-section', {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    delay: 0.6,
                    ease: 'power3.out',
                });
            }
        },
        { scope: containerRef, dependencies: [news, recentNews] },
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Head title={`${news.title} | GenBI Unugiri`}>
                <meta name="description" content={description} />
                <meta property="og:title" content={`${news.title} | GenBI Unugiri`} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="GenBI Unugiri" />
                <meta property="article:published_time" content={news.published_at} />
                <meta property="article:author" content={news.author?.name || 'Admin'} />
                <meta property="article:section" content={news.category?.name} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${news.title} | GenBI Unugiri`} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={imageUrl} />
                <link rel="canonical" href={pageUrl} />
            </Head>
            <PublicNavbar />

            <main className="pt-8 md:pt-[120px]">
                {/* Article Header */}
                <article>
                    <header className="article-header mx-auto max-w-[980px] px-6 pb-8 md:pb-12">
                        <h1 className="mb-5 text-[26px] font-semibold leading-[1.1] tracking-tight text-[#1d1d1f] md:text-[48px]">{news.title}</h1>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-[#7a7a7a] md:text-[15px]">
                            <span>{format(new Date(news.published_at), 'dd MMMM yyyy', { locale: id })}</span>
                            <span className="h-1 w-1 rounded-full bg-[#d2d2d7]" />
                            <span>Oleh {news.author?.name || 'Admin'}</span>
                            <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5">{news.category.name}</span>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {news.image_path && (
                        <div className="article-image mx-auto max-w-[1100px] px-6 pb-16">
                            <div className="overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                                <img src={`/storage/${news.image_path}`} alt={news.title} className="aspect-video w-full object-cover" />
                            </div>
                        </div>
                    )}

                    {/* Article Content */}
                    <div
                        className="article-content prose prose-lg prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[#0066cc] prose-img:rounded-[18px] mx-auto max-w-[800px] px-6 pb-24"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                </article>

                {/* Recent News Section */}
                {recentNews.length > 0 && (
                    <section className="recent-news-section border-t border-[#f0f0f0] bg-[#f5f5f7] py-[50px] md:py-[80px]">
                        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
                            <h2 className="mb-8 text-[22px] font-semibold tracking-tight text-[#1d1d1f] md:mb-12 md:text-[34px]">Berita Terkait Lainnya</h2>
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
