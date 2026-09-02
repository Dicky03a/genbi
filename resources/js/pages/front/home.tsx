interface HomeProps {
    tagline: string;
}

export function HomeSection({ tagline: _tagline }: HomeProps) {
    return (
        <section className="relative mb-3 px-4 pt-4 sm:px-6 md:px-8 md:pt-6">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] md:aspect-[21/9]">
                {/* Hero Image - Responsive srcset for fast loading */}
                <picture>
                    <source media="(max-width: 768px)" srcSet="/asset/foto/home-768.webp" />
                    <source media="(max-width: 1200px)" srcSet="/asset/foto/home-1200.webp" />
                    <img
                        src="/asset/foto/home-1920.webp"
                        alt="GenBI Hero"
                        className="h-full w-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        width={1920}
                        height={1280}
                    />
                </picture>

                {/* Subtle Black Inner Shadow Overlay - Responsive */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent md:from-black/40 md:via-black/10" />

                {/* Subtle Black Inset Shadow - Responsive */}
                <div className="absolute inset-0 shadow-[inset_0_-50px_60px_-30px_rgba(0,0,0,0.4)] md:shadow-[inset_0_-100px_120px_-60px_rgba(0,0,0,0.5)]" />
            </div>
        </section>
    );
}
