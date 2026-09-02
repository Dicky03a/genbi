import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { Head } from '@inertiajs/react';

const sections = [
    {
        id: 'penerimaan-syarat',
        title: '1. Penerimaan Syarat',
        content: (
            <>
                <p>
                    Dengan mengakses, menelusuri, atau menggunakan website GenBI Unugiri ("Website"), Anda menyatakan
                    telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat Penggunaan ini beserta seluruh
                    kebijakan yang berlaku, termasuk Kebijakan Privasi kami.
                </p>
                <p>
                    Syarat Penggunaan ini berlaku bagi semua pengunjung, pengguna, dan pihak lain yang mengakses atau
                    menggunakan Website. Jika Anda tidak menyetujui syarat-syarat ini, Anda tidak diizinkan untuk
                    menggunakan Website ini.
                </p>
            </>
        ),
    },
    {
        id: 'deskripsi-layanan',
        title: '2. Deskripsi Layanan',
        content: (
            <>
                <p>
                    GenBI Unugiri adalah platform informasi resmi komunitas Generasi Baru Indonesia di Universitas
                    Nahdlatul Ulama Sunan Giri, Bojonegoro. Website ini menyediakan:
                </p>
                <ul>
                    <li>Informasi tentang program dan kegiatan GenBI Unugiri.</li>
                    <li>Berita, artikel, dan publikasi terkait dunia pendidikan dan komunitas.</li>
                    <li>Informasi mengenai beasiswa Bank Indonesia dan prosedur pendaftarannya.</li>
                    <li>Profil dan informasi struktur organisasi GenBI Unugiri.</li>
                </ul>
            </>
        ),
    },
    {
        id: 'penggunaan-diizinkan',
        title: '3. Penggunaan yang Diizinkan',
        content: (
            <>
                <p>
                    Anda diizinkan untuk menggunakan Website ini semata-mata untuk tujuan yang sah dan sesuai dengan
                    Syarat Penggunaan ini, antara lain:
                </p>
                <ul>
                    <li>Mencari dan membaca informasi yang tersedia secara publik di Website.</li>
                    <li>Mengunduh materi yang secara eksplisit tersedia untuk diunduh.</li>
                    <li>Menghubungi kami untuk keperluan yang sah dan berkaitan dengan layanan kami.</li>
                    <li>Berbagi tautan menuju halaman Website untuk tujuan non-komersial.</li>
                </ul>
            </>
        ),
    },
    {
        id: 'penggunaan-dilarang',
        title: '4. Penggunaan yang Dilarang',
        content: (
            <>
                <p>Anda secara tegas dilarang untuk:</p>
                <ul>
                    <li>Menggunakan Website untuk tujuan ilegal, curang, atau berbahaya.</li>
                    <li>
                        Menyebarkan, mengunggah, atau mengirimkan konten yang bersifat fitnah, cabul, mengandung ujaran
                        kebencian, atau melanggar hak pihak lain.
                    </li>
                    <li>
                        Melakukan scraping, crawling, atau pengumpulan data otomatis tanpa izin tertulis dari kami.
                    </li>
                    <li>
                        Mencoba mendapatkan akses tidak sah ke sistem, server, database, atau akun pengguna lain yang
                        terhubung dengan Website.
                    </li>
                    <li>
                        Mengunggah atau menyebarkan kode berbahaya, virus, malware, atau perangkat lunak destruktif
                        lainnya.
                    </li>
                    <li>
                        Melakukan tindakan yang dapat merusak, menonaktifkan, membebani secara berlebihan, atau mengganggu
                        infrastruktur Website.
                    </li>
                    <li>
                        Menyamar sebagai pihak lain atau memberikan informasi yang menyesatkan tentang afiliasi Anda.
                    </li>
                    <li>Menggunakan Website untuk keperluan komersial tanpa izin tertulis dari kami.</li>
                </ul>
            </>
        ),
    },
    {
        id: 'kekayaan-intelektual',
        title: '5. Kekayaan Intelektual',
        content: (
            <>
                <p>
                    Seluruh konten yang terdapat pada Website ini—termasuk namun tidak terbatas pada teks, artikel,
                    foto, grafik, logo, ikon, desain antarmuka, dan kode sumber—adalah milik GenBI Unugiri, Bank
                    Indonesia, atau pihak pemberi lisensi yang sah, dan dilindungi oleh hukum hak cipta, merek dagang,
                    serta kekayaan intelektual lainnya yang berlaku di Republik Indonesia.
                </p>
                <p>
                    Anda tidak diperkenankan untuk mereproduksi, mendistribusikan, memodifikasi, menampilkan secara
                    publik, atau membuat karya turunan dari konten Website tanpa mendapatkan izin tertulis terlebih
                    dahulu dari kami, kecuali untuk penggunaan pribadi dan non-komersial yang wajar.
                </p>
            </>
        ),
    },
    {
        id: 'akun-pengguna',
        title: '6. Akun Pengguna',
        content: (
            <>
                <p>
                    Beberapa fitur Website mungkin memerlukan pembuatan akun. Dengan membuat akun, Anda bertanggung
                    jawab untuk:
                </p>
                <ul>
                    <li>Menjaga kerahasiaan kata sandi dan informasi akun Anda.</li>
                    <li>Memberikan informasi yang akurat, lengkap, dan terkini saat pendaftaran.</li>
                    <li>Segera memberitahukan kami jika terdapat akses tidak sah ke akun Anda.</li>
                    <li>Semua aktivitas yang terjadi di bawah akun Anda.</li>
                </ul>
                <p>
                    Kami berhak untuk menangguhkan atau menghapus akun yang melanggar Syarat Penggunaan ini tanpa
                    pemberitahuan sebelumnya.
                </p>
            </>
        ),
    },
    {
        id: 'pembatasan-tanggung-jawab',
        title: '7. Pembatasan Tanggung Jawab',
        content: (
            <>
                <p>
                    Website ini disediakan "sebagaimana adanya" dan "sebagaimana tersedia" tanpa jaminan apapun, baik
                    tersurat maupun tersirat. Sejauh diizinkan oleh hukum yang berlaku, GenBI Unugiri tidak
                    bertanggung jawab atas:
                </p>
                <ul>
                    <li>
                        Kerugian langsung, tidak langsung, insidental, khusus, atau konsekuensial akibat penggunaan atau
                        ketidakmampuan menggunakan Website.
                    </li>
                    <li>
                        Gangguan, jeda, atau ketidaktersediaan Website yang disebabkan oleh faktor teknis, pemeliharaan,
                        atau keadaan di luar kendali kami.
                    </li>
                    <li>
                        Kesalahan, ketidakakuratan, atau ketidaklengkapan informasi yang tersedia di Website.
                    </li>
                    <li>
                        Tindakan atau konten pihak ketiga yang dapat diakses melalui tautan di Website kami.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: 'tautan-pihak-ketiga',
        title: '8. Tautan ke Website Pihak Ketiga',
        content: (
            <>
                <p>
                    Website kami dapat memuat tautan menuju website atau layanan pihak ketiga yang tidak dioperasikan
                    oleh GenBI Unugiri. Tautan tersebut disediakan semata-mata untuk kemudahan pengguna dan bukan
                    merupakan endorsement atau rekomendasi atas website yang ditautkan.
                </p>
                <p>
                    Kami tidak memiliki kendali atas konten, kebijakan privasi, atau praktik website pihak ketiga
                    tersebut dan tidak bertanggung jawab atas hal-hal yang terjadi di dalamnya. Kami sangat menyarankan
                    Anda untuk membaca syarat penggunaan dan kebijakan privasi setiap website yang Anda kunjungi.
                </p>
            </>
        ),
    },
    {
        id: 'hukum-berlaku',
        title: '9. Hukum yang Berlaku dan Yurisdiksi',
        content: (
            <>
                <p>
                    Syarat Penggunaan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap
                    perselisihan atau sengketa yang timbul dari atau berkaitan dengan Syarat Penggunaan ini akan
                    diselesaikan secara musyawarah terlebih dahulu, dan jika tidak tercapai kesepakatan, akan
                    diselesaikan melalui mekanisme hukum yang berlaku di Indonesia.
                </p>
            </>
        ),
    },
    {
        id: 'perubahan-syarat',
        title: '10. Perubahan Syarat Penggunaan',
        content: (
            <>
                <p>
                    Kami berhak mengubah, memodifikasi, atau memperbarui Syarat Penggunaan ini kapan saja tanpa
                    kewajiban memberikan pemberitahuan sebelumnya. Perubahan akan berlaku efektif segera setelah
                    diterbitkan di Website.
                </p>
                <p>
                    Kami menyarankan Anda untuk meninjau halaman ini secara berkala. Penggunaan Website secara
                    berkelanjutan setelah perubahan diterbitkan merupakan persetujuan Anda terhadap syarat yang telah
                    diperbarui.
                </p>
            </>
        ),
    },
    {
        id: 'kontak',
        title: '11. Hubungi Kami',
        content: (
            <>
                <p>
                    Jika Anda memiliki pertanyaan atau keberatan terkait Syarat Penggunaan ini, silakan menghubungi
                    kami:
                </p>
                <ul>
                    <li>
                        <strong>Organisasi:</strong> GenBI Unugiri — Generasi Baru Indonesia Universitas Nahdlatul Ulama
                        Sunan Giri
                    </li>
                    <li>
                        <strong>Alamat:</strong> Universitas Nahdlatul Ulama Sunan Giri, Bojonegoro, Jawa Timur,
                        Indonesia
                    </li>
                    <li>
                        <strong>Hotline Bank Indonesia:</strong> 147
                    </li>
                </ul>
            </>
        ),
    },
];

export default function TermsOfUse() {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const description =
        'Syarat Penggunaan GenBI Unugiri — ketentuan dan aturan yang mengatur penggunaan website dan layanan kami.';

    return (
        <div className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Head title="Syarat Penggunaan | GenBI Unugiri">
                <meta name="description" content={description} />
                <meta property="og:title" content="Syarat Penggunaan | GenBI Unugiri" />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={`${origin}/asset/foto/home-1920.webp`} />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="GenBI Unugiri" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Syarat Penggunaan | GenBI Unugiri" />
                <meta name="twitter:description" content={description} />
                <link rel="canonical" href={pageUrl} />
            </Head>

            <PublicNavbar />

            <main className="pt-8 md:pt-[80px]">
                {/* Hero */}
                <section className="border-b border-[#f0f0f0] py-[44px] md:py-[80px]">
                    <div className="mx-auto max-w-[800px] px-6">
                        <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-[#0066cc]">
                            Dokumen Legal
                        </p>
                        <h1 className="text-[32px] font-semibold leading-[1.07] tracking-[-0.02em] text-[#1d1d1f] md:text-[52px]">
                            Syarat Penggunaan
                        </h1>
                        <p className="mt-4 text-[15px] text-[#7a7a7a]">
                            Terakhir diperbarui: 2 September 2026
                        </p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-[48px] md:py-[80px]">
                    <div className="mx-auto max-w-[800px] px-6">
                        {/* ToC */}
                        <div className="mb-12 rounded-[18px] bg-[#f5f5f7] p-6 md:p-8">
                            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#7a7a7a]">
                                Daftar Isi
                            </p>
                            <ol className="space-y-2">
                                {sections.map((s) => (
                                    <li key={s.id}>
                                        <a
                                            href={`#${s.id}`}
                                            className="text-[15px] text-[#0066cc] hover:underline"
                                        >
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Sections */}
                        <div className="space-y-12">
                            {sections.map((s) => (
                                <div key={s.id} id={s.id} className="scroll-mt-24">
                                    <h2 className="mb-4 text-[20px] font-semibold tracking-tight text-[#1d1d1f] md:text-[24px]">
                                        {s.title}
                                    </h2>
                                    <div className="prose prose-base prose-p:text-[#424245] prose-p:leading-[1.7] prose-li:text-[#424245] prose-li:leading-[1.7] prose-strong:text-[#1d1d1f] prose-a:text-[#0066cc] max-w-none">
                                        {s.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer note */}
                        <div className="mt-16 rounded-[18px] border border-[#e0e0e0] p-6 text-[14px] leading-[1.6] text-[#7a7a7a]">
                            Dengan terus menggunakan website GenBI Unugiri, Anda menyatakan bahwa Anda telah membaca,
                            memahami, dan menyetujui seluruh Syarat Penggunaan yang berlaku.
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
