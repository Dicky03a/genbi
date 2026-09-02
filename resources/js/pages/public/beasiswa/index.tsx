import { Breadcrumbs } from '@/components/breadcrumbs';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { useGSAP } from '@gsap/react';
import { Head } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, ExternalLink, FileText, Info, ListChecks } from 'lucide-react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface Beasiswa {
    id: number;
    title: string;
    description: string;
    requirements: string;
    required_files: string;
    procedures: string;
    flow: string;
    link: string | null;
    poster: string | null;
}

interface Props {
    beasiswas: Beasiswa[];
}

export default function BeasiswaIndex({ beasiswas }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Hero animation
            gsap.from('.hero-content > *', {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'power4.out',
            });

            // Cards animation
            if (beasiswas.length > 0) {
                gsap.from('.beasiswa-card', {
                    y: 60,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.beasiswa-grid',
                        start: 'top 85%',
                    },
                });
            }
        },
        { scope: containerRef, dependencies: [beasiswas] },
    );


    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const description = 'Temukan informasi lengkap tentang beasiswa Bank Indonesia dan cara mendaftarkannya melalui GenBI Unugiri.';

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Head title="Informasi Beasiswa | GenBI Unugiri">
                <meta name="description" content={description} />
                <meta property="og:title" content="Informasi Beasiswa | GenBI Unugiri" />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={`${origin}/asset/foto/home-1920.webp`} />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="GenBI Unugiri" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Informasi Beasiswa | GenBI Unugiri" />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={`${origin}/asset/foto/home-1920.webp`} />
                <link rel="canonical" href={pageUrl} />
            </Head>
            <PublicNavbar />

            <main className="pt-4 md:pt-[10px]">
                {/* Hero Section */}
                <section className="py-[50px] md:py-[120px]">
                    <div className="hero-content mx-auto max-w-[980px] px-6 text-center">
                        <h1 className="text-[30px] font-semibold leading-[1.07] tracking-[-0.02em] text-[#1d1d1f] md:text-[56px] lg:tracking-[-0.28px]">
                            Informasi Beasiswa.
                        </h1>
                        <p className="mt-5 text-[17px] leading-[1.47] text-[#1d1d1f] md:mt-8 md:text-[24px] md:font-light md:leading-[1.5]">
                            Membangun masa depan pemimpin bangsa yang berintegritas dan inovatif.
                        </p>
                    </div>
                </section>

                {/* Scholarship Grid Section */}
                <section className="py-[50px] md:py-[140px]">
                    <div className="mx-auto max-w-[1200px] px-6">
                        {beasiswas.length > 0 ? (
                            <div className="beasiswa-grid grid grid-cols-1 gap-[60px] md:gap-[120px]">
                                {beasiswas.map((item, index) => (
                                    <div key={item.id} className="beasiswa-card group relative">
                                        <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-20">
                                            {/* Poster Side */}
                                            {item.poster && (
                                                <div className="static w-full lg:sticky lg:top-[140px] lg:w-[45%]">
                                                    <div className="relative overflow-hidden rounded-[24px] shadow-[0_30px_70px_rgba(0,0,0,0.15)] transition-all duration-700 group-hover:scale-[1.01] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)]">
                                                        <img
                                                            src={`/storage/${item.poster}`}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Content Side */}
                                            <div className="flex-1">
                                                <div className="mb-8 space-y-3 md:mb-12 md:space-y-4">
                                                    <h2 className="text-[26px] font-semibold leading-[1.1] tracking-tight text-[#1d1d1f] md:text-[48px]">
                                                        {item.title}
                                                    </h2>
                                                </div>

                                                <div className="prose prose-lg prose-headings:font-semibold prose-a:text-[#0066cc] max-w-none text-[17px] leading-[1.6] text-[#1d1d1f] md:text-[19px] md:font-light">
                                                    <div dangerouslySetInnerHTML={{ __html: item.description }} className="mb-10 md:mb-16" />

                                                    <div className="space-y-10 md:space-y-16">
                                                        {item.requirements && (
                                                            <div className="space-y-4 md:space-y-6">
                                                                <h3 className="flex items-center gap-3 text-[20px] font-semibold tracking-tight text-[#1d1d1f] md:gap-4 md:text-[24px]">
                                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5f5f7] md:h-10 md:w-10">
                                                                        <ListChecks className="h-5 w-5 text-[#0066cc] md:h-6 md:w-6" />
                                                                    </div>
                                                                    Persyaratan
                                                                </h3>
                                                                <div
                                                                    dangerouslySetInnerHTML={{ __html: item.requirements }}
                                                                    className="pl-6 text-[16px] leading-[1.7] text-[#424245] md:pl-14 md:text-[18px]"
                                                                />
                                                            </div>
                                                        )}

                                                        {item.required_files && (
                                                            <div className="space-y-4 md:space-y-6">
                                                                <h3 className="flex items-center gap-3 text-[20px] font-semibold tracking-tight text-[#1d1d1f] md:gap-4 md:text-[24px]">
                                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5f5f7] md:h-10 md:w-10">
                                                                        <FileText className="h-5 w-5 text-[#0066cc] md:h-6 md:w-6" />
                                                                    </div>
                                                                    Berkas Diperlukan
                                                                </h3>
                                                                <div
                                                                    dangerouslySetInnerHTML={{ __html: item.required_files }}
                                                                    className="pl-6 text-[16px] leading-[1.7] text-[#424245] md:pl-14 md:text-[18px]"
                                                                />
                                                            </div>
                                                        )}

                                                        {item.procedures && (
                                                            <div className="space-y-4 md:space-y-6">
                                                                <h3 className="flex items-center gap-3 text-[20px] font-semibold tracking-tight text-[#1d1d1f] md:gap-4 md:text-[24px]">
                                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5f5f7] md:h-10 md:w-10">
                                                                        <CheckCircle2 className="h-5 w-5 text-[#0066cc] md:h-6 md:w-6" />
                                                                    </div>
                                                                    Prosedur
                                                                </h3>
                                                                <div
                                                                    dangerouslySetInnerHTML={{ __html: item.procedures }}
                                                                    className="pl-6 text-[16px] leading-[1.7] text-[#424245] md:pl-14 md:text-[18px]"
                                                                />
                                                            </div>
                                                        )}

                                                        {item.flow && (
                                                            <div className="space-y-4 md:space-y-6">
                                                                <h3 className="flex items-center gap-3 text-[20px] font-semibold tracking-tight text-[#1d1d1f] md:gap-4 md:text-[24px]">
                                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5f5f7] md:h-10 md:w-10">
                                                                        <Info className="h-5 w-5 text-[#0066cc] md:h-6 md:w-6" />
                                                                    </div>
                                                                    Alur Pendaftaran
                                                                </h3>
                                                                <div
                                                                    dangerouslySetInnerHTML={{ __html: item.flow }}
                                                                    className="pl-6 text-[16px] leading-[1.7] text-[#424245] md:pl-14 md:text-[18px]"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {item.link && (
                                                    <div className="mt-10 md:mt-20">
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex h-[48px] items-center gap-2 rounded-full bg-[#0066cc] px-6 text-[16px] font-medium text-white transition-all hover:bg-[#0071e3] hover:shadow-[0_12px_30px_rgba(0,102,204,0.3)] active:scale-95 md:h-[56px] md:gap-3 md:px-10 md:text-[18px]"
                                                        >
                                                            Daftar Sekarang
                                                            <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Separator for multiple items */}
                                        {index < beasiswas.length - 1 && <div className="mt-[120px] h-px w-full bg-[#f0f0f0]" />}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-[400px] flex-col items-center justify-center text-center">
                                <p className="text-[21px] text-[#7a7a7a]">Belum ada informasi beasiswa saat ini.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
