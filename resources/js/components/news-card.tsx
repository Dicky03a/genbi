import { stripHtml } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';

interface NewsCardProps {
    news: {
        title: string;
        slug: string;
        excerpt: string;
        image_path: string | null;
        published_at: string;
        category?: {
            name: string;
        };
    };
}

export function NewsCard({ news }: NewsCardProps) {
    return (
        <div className="group relative flex h-full flex-col overflow-hidden rounded-[18px] bg-white ring-1 ring-[#e0e0e0] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
            {/* Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#f5f5f7]">
                {news.image_path ? (
                    <img
                        src={`/storage/${news.image_path}`}
                        alt={news.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#7a7a7a]">
                        <span className="text-[14px]">No Image</span>
                    </div>
                )}
                
                {news.category && (
                    <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#0066cc] backdrop-blur-sm uppercase">
                        {news.category.name}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 text-[12px] text-[#7a7a7a]">
                    {format(new Date(news.published_at), 'dd MMMM yyyy', { locale: id })}
                </div>
                
                <h3 className="mb-3 text-[19px] font-semibold leading-tight tracking-tight text-[#1d1d1f] line-clamp-2 group-hover:text-[#0066cc] transition-colors">
                    {news.title}
                </h3>
                
                <p className="mb-6 flex-1 text-[15px] leading-relaxed text-[#7a7a7a] line-clamp-3">
                    {news.excerpt || stripHtml(news.content || '').substring(0, 100) + '...'}
                </p>

                <div className="mt-auto">
                    <Link
                        href={route('berita.show', news.slug)}
                        className="inline-flex items-center text-[15px] font-medium text-[#0066cc] hover:underline"
                    >
                        Baca Selengkapnya
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
