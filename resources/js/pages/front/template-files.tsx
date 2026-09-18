import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { Seo } from '@/components/seo';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef, useState } from 'react';
import { Search, FileText, ArrowDownToLine, Clock, Eye } from 'lucide-react';

interface TemplateFile {
    id: number;
    name: string;
    file_path: string;
    created_at: string;
}

interface TemplateFilesProps {
    templateFiles: TemplateFile[];
}

export default function TemplateFiles({ templateFiles }: TemplateFilesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useGSAP(
        () => {
            gsap.fromTo('.header-element', 
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out',
                }
            );

            if (templateFiles.length > 0) {
                gsap.fromTo('.template-card', 
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        delay: 0.2,
                        ease: 'power3.out',
                    }
                );
            }
        },
        { scope: containerRef, dependencies: [templateFiles, searchQuery] }
    );

    const filteredFiles = templateFiles.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const description = 'Download berkas atau template file resmi yang disediakan oleh GenBI Unugiri.';

    return (
        <div ref={containerRef} className="min-h-screen bg-[#fafafc] font-sans text-[#1d1d1f] flex flex-col justify-between">
            <Seo 
                title="Template File | GenBI Unugiri" 
                description={description} 
                url={pageUrl} 
            />
            <PublicNavbar />

            <main className="pt-[40px] flex-grow">
                {/* Header Section */}
                <section className="relative overflow-hidden bg-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#f1f1f4]">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#eef2ff,transparent_50%)]" />
                    </div>
                    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                        <h1 className="header-element text-[2.5rem] font-bold leading-tight tracking-tight text-[#1d1d1f] md:text-[4rem] lg:text-[4.5rem]">
                            <span>Template File</span>
                        </h1>
                        <p className="header-element mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#5b6172]">
                            Temukan dan unduh berbagai format berkas resmi yang diperlukan untuk administrasi dan kegiatan GenBI Unugiri.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-12 lg:py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Search Bar */}
                        <div className="mb-12 flex justify-center header-element">
                            <div className="relative w-full max-w-xl group">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Search className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama template..."
                                    className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-6 text-[15px] font-medium text-[#1d1d1f] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all duration-300 placeholder:text-gray-400 outline-none"
                                />
                            </div>
                        </div>

                        {/* File Grid */}
                        {filteredFiles.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                                {filteredFiles.map((file) => (
                                    <div 
                                        key={file.id} 
                                        className="template-card group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.06)] ring-1 ring-inset ring-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)] hover:ring-blue-100"
                                    >
                                        <div className="absolute top-0 right-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                                        
                                        <div className="relative z-10 flex-grow">
                                            <h3 className="mb-2 text-xl font-bold leading-tight text-[#1d1d1f] group-hover:text-blue-600 transition-colors duration-200">
                                                {file.name}
                                            </h3>
                                            
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-[#86868b]">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{new Date(file.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="relative z-10 mt-8 flex flex-col gap-2.5">
                                            <a
                                                href={`/template-file/${file.id}/download`}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-[14px] font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-[0.98]"
                                            >
                                                <ArrowDownToLine className="h-4 w-4" />
                                                Unduh
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-3xl bg-white border border-dashed border-gray-200 py-24 text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#1d1d1f]">Tidak Ada Berkas</h3>
                                <p className="mt-2 max-w-md text-[#5b6172]">
                                    {searchQuery 
                                        ? `Tidak dapat menemukan template dengan nama "${searchQuery}".` 
                                        : 'Belum ada template file yang diunggah saat ini.'}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
