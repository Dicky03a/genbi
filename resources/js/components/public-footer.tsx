import { Link } from '@inertiajs/react';

export function PublicFooter() {
    return (
        <footer className="border-t border-[#f0f0f0] bg-[#f5f5f7] px-6 pt-[48px] pb-[100px] text-[#7a7a7a] md:px-12 md:pt-[64px] md:pb-[64px]">
            <div className="mx-auto max-w-[1440px]">
                {/* Top notes / fine print */}
                <div className="mb-4 border-b border-[#d2d2d7]/40 pb-4 text-[12px] leading-[1.3] tracking-[-0.08px]">
                    <p className="mb-2">1. Informasi beasiswa dapat berubah sewaktu-waktu sesuai dengan kebijakan Bank Indonesia.</p>
                    <p>2. Pendaftaran hanya dapat dilakukan melalui portal resmi atau institusi pendidikan yang bekerjasama.</p>
                </div>

                {/* Directory Links */}
                {/* Directory Links */}
                <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:gap-8 lg:grid-cols-4">
                    <div>
                        <h3 className="mb-3 text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f]">Tentang GenBI</h3>
                        <ul className="flex flex-col space-y-2 text-[12px] tracking-[-0.12px]">
                            <li>
                                <Link href="/profile" className="hover:text-[#1d1d1f] hover:underline">
                                    Profil
                                </Link>
                            </li>
                            <li>
                                <Link href="/divisi" className="hover:text-[#1d1d1f] hover:underline">
                                    Divisi
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-3 text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f]">Layanan & Program</h3>
                        <ul className="flex flex-col space-y-2 text-[12px] tracking-[-0.12px]">
                            <li>
                                <Link href="/beasiswa" className="hover:text-[#1d1d1f] hover:underline">
                                    Beasiswa
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-3 text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f]">Informasi Publik</h3>
                        <ul className="flex flex-col space-y-2 text-[12px] tracking-[-0.12px]">
                            <li>
                                <Link href="/berita" className="hover:text-[#1d1d1f] hover:underline">
                                    Berita
                                </Link>
                            </li>
                            <li>
                                <Link href="/prestasi" className="hover:text-[#1d1d1f] hover:underline">
                                    Prestasi
                                </Link>
                            </li>
                            <li>
                                <Link href="/template-file" className="hover:text-[#1d1d1f] hover:underline">
                                    Template File
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-3 text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f]">Pengguna</h3>
                        <ul className="flex flex-col space-y-2 text-[12px] tracking-[-0.12px]">
                            <li>
                                <Link href={route('login')} className="hover:text-[#1d1d1f] hover:underline">
                                    Login Sistem
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Legal */}
                <div className="flex flex-col items-start justify-between border-t border-[#d2d2d7]/40 pt-8 text-[12px] tracking-[-0.12px] md:flex-row md:items-center">
                    <div className="mb-4 md:mb-0">
                        More ways to connect: <span className="cursor-pointer text-[#0066cc] hover:underline">Find a GenBI chapter</span> near
                        you. Or call 085748138557.
                    </div>
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
                        <div>Copyright © {new Date().getFullYear()} GenBI Indonesia. All rights reserved.</div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            <Link
                                href={route('privacy-policy')}
                                className="border-r border-[#d2d2d7] pr-4 last:border-0 last:pr-0 hover:text-[#1d1d1f] hover:underline"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href={route('terms-of-use')}
                                className="border-r border-[#d2d2d7] pr-4 last:border-0 last:pr-0 hover:text-[#1d1d1f] hover:underline"
                            >
                                Terms of Use
                            </Link>
                            <Link
                                href={route('sitemap')}
                                className="border-r border-[#d2d2d7] pr-4 last:border-0 last:pr-0 hover:text-[#1d1d1f] hover:underline"
                            >
                                Site Map
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
