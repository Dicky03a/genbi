interface HomeProps {
    tagline: string;
}

const heroImage = '/asset/foto/home.webp';

export function HomeSection({ tagline }: HomeProps) {
    return (
        <section className="relative mb-3 px-4 pt-4 sm:px-6 md:px-8 md:pt-6">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] md:aspect-[21/9]">
                {/* Hero Image */}
                <img
                    src={heroImage}
                    alt="GenBI Hero"
                    className="h-full w-full object-cover"
                />

                {/* Subtle Black Inner Shadow Overlay - Responsive */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent md:from-black/40 md:via-black/10" />

                {/* Subtle Black Inset Shadow - Responsive */}
                <div className="absolute inset-0 shadow-[inset_0_-50px_60px_-30px_rgba(0,0,0,0.4)] md:shadow-[inset_0_-100px_120px_-60px_rgba(0,0,0,0.5)]" />
            </div>
        </section>
    );
}
