import { Head } from '@inertiajs/react';

interface SeoProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    jsonLd?: Record<string, any>;
}

export function Seo({
    title = 'GenBI Unugiri | Generasi Baru Indonesia',
    description = 'Membangun masa depan pemimpin bangsa yang berintegritas dan inovatif.',
    image = '/asset/foto/home-1920.webp',
    url,
    type = 'website',
    jsonLd,
}: SeoProps) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const imageUrl = image.startsWith('http') ? image : `${origin}${image}`;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="GenBI Unugiri" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />

            <link rel="canonical" href={pageUrl} />

            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    );
}
