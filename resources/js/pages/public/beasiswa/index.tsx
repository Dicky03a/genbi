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


    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Head title="Informasi Beasiswa" />
            <PublicNavbar />

            <main className="pt-[80px] md:pt-[10px]">
                {/* Hero Section - product-tile-parchment style */}
                <section className="md:py-[120px]">
                    <div className="hero-content mx-auto max-w-[980px] px-6 text-center">
                        <h1 className="text-[40px] leading-[1.07] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[56px] lg:tracking-[-0.28px]">
                            Informasi Beasiswa.
                        </h1>
                        <p className="mt-8 text-[21px] leading-[1.47] text-[#1d1d1f] md:text-[24px] md:leading-[1.5] md:font-light">
                            Membangun masa depan pemimpin bangsa yang berintegritas dan inovatif.
                        </p>
                    </div>
                </section>

                {/* Scholarship Grid Section */}
                <section className="py-[100px] md:py-[140px]">
                    <div className="mx-auto max-w-[1200px] px-6">
                        {beasiswas.length > 0 ? (
                            <div className="beasiswa-grid grid grid-cols-1 gap-[120px]">
                                {beasiswas.map((item, index) => (
                                    <div key={item.id} className="beasiswa-card group relative">
                                        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
                                            {/* Poster Side - Signature product shadow applied to the image */}
                                            {item.poster && (
                                                <div className="sticky top-[140px] w-full lg:w-[45%]">
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
                                                <div className="mb-12 space-y-4">
                                                    <h2 className="text-[36px] leading-[1.1] font-semibold tracking-tight text-[#1d1d1f] md:text-[48px]">
                                                        {item.title}
                                                    </h2>
                                                </div>

                                                <div className="prose prose-lg prose-headings:font-semibold prose-a:text-[#0066cc] max-w-none text-[19px] leading-[1.6] text-[#1d1d1f] md:font-light">
                                                    <div dangerouslySetInnerHTML={{ __html: item.description }} className="mb-16" />

                                                    <div className="space-y-16">
                                                        {item.requirements && (
                                                            <div className="space-y-6">
                                                                <h3 className="flex items-center gap-4 text-[24px] font-semibold tracking-tight text-[#1d1d1f]">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f7]">
                                                                        <ListChecks className="h-6 w-6 text-[#0066cc]" />
                                                                    </div>
                                                                    Persyaratan
                                                                </h3>
                                                                <div
                                                                    dangerouslySetInnerHTML={{ __html: item.requirements }}
                                                                    className="pl-14 text-[18px] leading-[1.7] text-[#424245]"
                                                                />
                                                            </div>
                                                        )}

                                                        {item.required_files && (
                                                            <div className="space-y-6">
                                                                <h3 className="flex items-center gap-4 text-[24px] font-semibold tracking-tight text-[#1d1d1f]">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f7]">
                                                                        <FileText className="h-6 w-6 text-[#0066cc]" />
                                                                    </div>
                                                                    Berkas Diperlukan
                                                                </h3>
                                                                <div
                                                                    dangerouslySetInnerHTML={{ __html: item.required_files }}
                                                                    className="pl-14 text-[18px] leading-[1.7] text-[#424245]"
                                                                />
                                                            </div>
                                                        )}

                                                        {item.procedures && (
                                                            <div className="space-y-6">
                                                                <h3 className="flex items-center gap-4 text-[24px] font-semibold tracking-tight text-[#1d1d1f]">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f7]">
                                                                        <CheckCircle2 className="h-6 w-6 text-[#0066cc]" />
                                                                    </div>
                                                                    Prosedur
                                                                </h3>
                                                                <div
                                                                    dangerouslySetInnerHTML={{ __html: item.procedures }}
                                                                    className="pl-14 text-[18px] leading-[1.7] text-[#424245]"
                                                                />
                                                            </div>
                                                        )}

                                                        {item.flow && (
                                                            <div className="space-y-6">
                                                                <h3 className="flex items-center gap-4 text-[24px] font-semibold tracking-tight text-[#1d1d1f]">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f7]">
                                                                        <Info className="h-6 w-6 text-[#0066cc]" />
                                                                    </div>
                                                                    Alur Pendaftaran
                                                                </h3>
                                                                <div
                                                                    dangerouslySetInnerHTML={{ __html: item.flow }}
                                                                    className="pl-14 text-[18px] leading-[1.7] text-[#424245]"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {item.link && (
                                                    <div className="mt-20">
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex h-[56px] items-center gap-3 rounded-full bg-[#0066cc] px-10 text-[18px] font-medium text-white transition-all hover:bg-[#0071e3] hover:shadow-[0_12px_30px_rgba(0,102,204,0.3)] active:scale-95"
                                                        >
                                                            Daftar Sekarang
                                                            <ExternalLink className="h-5 w-5" />
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
