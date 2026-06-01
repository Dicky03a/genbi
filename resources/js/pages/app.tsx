import { Head, Link, usePage } from '@inertiajs/react';
import { PublicNavbar } from '@/components/public-navbar';
import { type SharedData } from '@/types';
import { cn } from '@/lib/utils';

export default function App() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-[#ffffff] text-[#1d1d1f] font-sans selection:bg-[#0066cc]/20 selection:text-[#0066cc]">
            <Head title="Selamat Datang" />

            <PublicNavbar />

            {/* Main Content Area */}
            <main className="pt-[64px] min-h-screen flex flex-col">
                {/* Hero Section - Apple Style (Photography-first, light tile) */}
                <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-start pt-[80px] pb-[80px] bg-[#ffffff] overflow-hidden">
                    <div className="z-10 flex flex-col items-center text-center px-6 max-w-[980px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                        <h1 className="text-[40px] md:text-[56px] font-semibold leading-[1.07] tracking-[-0.28px] text-[#1d1d1f] mb-4">
                            Generasi Baru Indonesia.
                        </h1>
                        <p className="text-[21px] md:text-[28px] font-normal leading-[1.14] tracking-[0.196px] text-[#1d1d1f] mb-6 max-w-[700px]">
                            Membangun masa depan pemimpin bangsa yang berintegritas dan inovatif.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/beasiswa"
                                className="px-[22px] py-[11px] bg-[#0066cc] text-[#ffffff] text-[17px] rounded-full font-normal hover:scale-95 transition-transform duration-200"
                            >
                                Info Beasiswa
                            </Link>
                            <Link
                                href="/berita"
                                className="px-[22px] py-[11px] bg-transparent text-[#0066cc] text-[17px] border border-[#0066cc] rounded-full font-normal hover:bg-[#0066cc]/5 active:scale-95 transition-all duration-200"
                            >
                                Berita Terbaru
                            </Link>
                        </div>
                    </div>
                    
                    {/* Placeholder for Hero Imagery - System shadow applied to imagery resting on surface */}
                    <div className="relative mt-[60px] w-full max-w-[1000px] flex-1 min-h-[400px] px-6">
                        <div className="w-full h-full bg-[#f5f5f7] rounded-t-[24px] border border-[#e0e0e0] shadow-[0_3px_30px_rgba(0,0,0,0.12)]">
                            {/* Dashboard / Image mockup placeholder */}
                            <div className="absolute inset-x-12 top-12 bottom-0 bg-[#ffffff] rounded-t-[12px] border border-[#e0e0e0] overflow-hidden flex items-center justify-center text-[#7a7a7a]">
                                [ Hero Image / Product Render ]
                            </div>
                        </div>
                    </div>
                </section>

               
            </main>

            {/* Apple-style Footer */}
            <footer className="bg-[#f5f5f7] text-[#7a7a7a] py-[64px] px-6 md:px-12 border-t border-[#f0f0f0]">
                <div className="max-w-[1440px] mx-auto">
                    {/* Top notes / fine print */}
                    <div className="pb-4 mb-4 border-b border-[#d2d2d7]/40 text-[12px] leading-[1.3] tracking-[-0.08px]">
                        <p className="mb-2">
                            1. Informasi beasiswa dapat berubah sewaktu-waktu sesuai dengan kebijakan Bank Indonesia.
                        </p>
                        <p>
                            2. Pendaftaran hanya dapat dilakukan melalui portal resmi atau institusi pendidikan yang bekerjasama.
                        </p>
                    </div>

                    {/* Directory Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-8">
                        <div>
                            <h3 className="text-[14px] font-semibold text-[#1d1d1f] mb-3 tracking-[-0.224px]">Tentang GenBI</h3>
                            <ul className="flex flex-col space-y-2 text-[12px] tracking-[-0.12px]">
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Sejarah</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Visi & Misi</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Struktur Organisasi</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Program Kerja</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-[14px] font-semibold text-[#1d1d1f] mb-3 tracking-[-0.224px]">Beasiswa</h3>
                            <ul className="flex flex-col space-y-2 text-[12px] tracking-[-0.12px]">
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Persyaratan</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Cara Mendaftar</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Jadwal Seleksi</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-[14px] font-semibold text-[#1d1d1f] mb-3 tracking-[-0.224px]">Berita & Artikel</h3>
                            <ul className="flex flex-col space-y-2 text-[12px] tracking-[-0.12px]">
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Kegiatan Terbaru</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Opini</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Prestasi Anggota</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Galeri</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-[14px] font-semibold text-[#1d1d1f] mb-3 tracking-[-0.224px]">Dukungan</h3>
                            <ul className="flex flex-col space-y-2 text-[12px] tracking-[-0.12px]">
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Hubungi Kami</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Panduan Pengguna</Link></li>
                                <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline">Download Format</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Legal */}
                    <div className="pt-8 border-t border-[#d2d2d7]/40 flex flex-col md:flex-row justify-between items-start md:items-center text-[12px] tracking-[-0.12px]">
                        <div className="mb-4 md:mb-0">
                            More ways to connect: <span className="text-[#0066cc] hover:underline cursor-pointer">Find a GenBI chapter</span> near you. Or call 147.
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                            <div>Copyright © {new Date().getFullYear()} GenBI Indonesia. All rights reserved.</div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <Link href="#" className="hover:text-[#1d1d1f] hover:underline border-r border-[#d2d2d7] pr-4 last:border-0 last:pr-0">Privacy Policy</Link>
                                <Link href="#" className="hover:text-[#1d1d1f] hover:underline border-r border-[#d2d2d7] pr-4 last:border-0 last:pr-0">Terms of Use</Link>
                                <Link href="#" className="hover:text-[#1d1d1f] hover:underline border-r border-[#d2d2d7] pr-4 last:border-0 last:pr-0">Site Map</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
