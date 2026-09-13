interface HomeProps {
    tagline: string;
}

export function HomeSection({ tagline: _tagline }: HomeProps) {
    return (
        <section className="relative mb-3 px-4 pt-4 sm:px-6 md:px-8 md:pt-6">
            <div className="relative aspect-[12/5] w-full overflow-hidden rounded-[24px] bg-black shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
                {/* Hero Image - Responsive srcset for fast loading */}
                <picture>
                    <img
                        src="/asset/foto/Banner Web.webp"
                        alt="GenBI Hero"
                        className="block h-full w-full object-contain object-center"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        sizes="100vw"
                        width={1920}
                        height={800}
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
