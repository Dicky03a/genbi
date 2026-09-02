import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { Head } from '@inertiajs/react';

const sections = [
    {
        id: 'pendahuluan',
        title: '1. Pendahuluan',
        content: (
            <>
                <p>
                    GenBI Unugiri (Generasi Baru Indonesia Universitas Nahdlatul Ulama Sunan Giri) berkomitmen penuh untuk
                    melindungi privasi dan keamanan informasi pribadi setiap pengguna website ini. Kebijakan Privasi ini
                    menjelaskan secara transparan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi
                    informasi yang Anda berikan kepada kami.
                </p>
                <p>
                    Dengan mengakses atau menggunakan website GenBI Unugiri, Anda dianggap telah membaca, memahami, dan
                    menyetujui Kebijakan Privasi ini. Jika Anda tidak menyetujui ketentuan dalam kebijakan ini, mohon
                    untuk tidak menggunakan layanan kami.
                </p>
            </>
        ),
    },
    {
        id: 'informasi-dikumpulkan',
        title: '2. Informasi yang Kami Kumpulkan',
        content: (
            <>
                <p>Kami dapat mengumpulkan berbagai jenis informasi berikut:</p>
                <ul>
                    <li>
                        <strong>Informasi Identitas:</strong> Nama lengkap, nomor induk mahasiswa (NIM), tanggal lahir,
                        dan foto profil.
                    </li>
                    <li>
                        <strong>Informasi Kontak:</strong> Alamat email, nomor telepon, dan alamat domisili.
                    </li>
                    <li>
                        <strong>Informasi Akademik:</strong> Nama perguruan tinggi, program studi, fakultas, semester, dan
                        Indeks Prestasi Kumulatif (IPK).
                    </li>
                    <li>
                        <strong>Dokumen Pendaftaran:</strong> Berkas-berkas yang diperlukan dalam proses seleksi beasiswa
                        sesuai persyaratan yang berlaku.
                    </li>
                    <li>
                        <strong>Data Teknis:</strong> Alamat IP, jenis browser, perangkat yang digunakan, halaman yang
                        dikunjungi, dan waktu akses yang dikumpulkan secara otomatis.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: 'penggunaan-informasi',
        title: '3. Penggunaan Informasi',
        content: (
            <>
                <p>Informasi yang kami kumpulkan digunakan untuk tujuan-tujuan berikut:</p>
                <ul>
                    <li>Memproses, mengevaluasi, dan mengelola pendaftaran serta seleksi beasiswa Bank Indonesia.</li>
                    <li>
                        Mengirimkan informasi, pengumuman, dan pemberitahuan terkait program dan kegiatan GenBI Unugiri.
                    </li>
                    <li>Meningkatkan kualitas konten dan layanan website berdasarkan analisis penggunaan.</li>
                    <li>
                        Memenuhi kewajiban administratif, pelaporan, dan kepatuhan kepada Bank Indonesia selaku pemberi
                        beasiswa.
                    </li>
                    <li>Merespons pertanyaan, keluhan, atau permintaan bantuan yang Anda sampaikan.</li>
                    <li>Menjaga keamanan dan integritas layanan kami.</li>
                </ul>
            </>
        ),
    },
    {
        id: 'penyimpanan-data',
        title: '4. Penyimpanan dan Retensi Data',
        content: (
            <>
                <p>
                    Data pribadi Anda disimpan di server yang berlokasi di Indonesia dan dikelola dengan standar keamanan
                    yang ketat. Kami menyimpan data selama masa keaktifan Anda sebagai anggota atau penerima beasiswa
                    GenBI, dan untuk jangka waktu yang diperlukan guna memenuhi kewajiban hukum dan administratif setelah
                    masa keanggotaan berakhir.
                </p>
                <p>
                    Setelah jangka waktu retensi berakhir, data akan dihapus secara permanen atau dianonimkan sesuai
                    prosedur yang berlaku.
                </p>
            </>
        ),
    },
    {
        id: 'keamanan-data',
        title: '5. Keamanan Data',
        content: (
            <>
                <p>
                    Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang memadai untuk melindungi data
                    pribadi Anda, termasuk:
                </p>
                <ul>
                    <li>Enkripsi data saat transmisi menggunakan protokol HTTPS/SSL.</li>
                    <li>Pembatasan akses data hanya kepada personel yang berwenang dan membutuhkan akses tersebut.</li>
                    <li>Pemantauan sistem secara berkala untuk mendeteksi ancaman keamanan.</li>
                    <li>Prosedur respons insiden yang terdokumentasi.</li>
                </ul>
                <p>
                    Meskipun demikian, tidak ada sistem keamanan yang sepenuhnya sempurna. Kami mendorong Anda untuk
                    menjaga kerahasiaan kredensial akun dan segera melaporkan jika Anda menduga adanya penyalahgunaan
                    akun.
                </p>
            </>
        ),
    },
    {
        id: 'berbagi-informasi',
        title: '6. Berbagi Informasi dengan Pihak Ketiga',
        content: (
            <>
                <p>
                    Kami tidak menjual, memperdagangkan, atau mengalihkan informasi pribadi Anda kepada pihak ketiga
                    tanpa persetujuan eksplisit Anda, kecuali dalam situasi berikut:
                </p>
                <ul>
                    <li>
                        <strong>Bank Indonesia:</strong> Sebagai pemberi beasiswa, Bank Indonesia berhak menerima data
                        yang diperlukan untuk administrasi dan pengawasan program.
                    </li>
                    <li>
                        <strong>Perguruan Tinggi:</strong> Data yang relevan dapat dibagikan kepada pihak universitas
                        dalam rangka verifikasi dan koordinasi program.
                    </li>
                    <li>
                        <strong>Kewajiban Hukum:</strong> Kami dapat mengungkapkan informasi jika diwajibkan oleh hukum,
                        peraturan perundang-undangan, atau perintah pengadilan yang sah.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: 'cookie',
        title: '7. Cookie dan Teknologi Pelacakan',
        content: (
            <>
                <p>
                    Website ini menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman pengguna,
                    menganalisis pola penggunaan, dan memastikan fungsi website berjalan dengan baik. Cookie adalah file
                    teks kecil yang disimpan di perangkat Anda oleh browser.
                </p>
                <p>Jenis cookie yang kami gunakan:</p>
                <ul>
                    <li>
                        <strong>Cookie Esensial:</strong> Diperlukan untuk fungsi dasar website, seperti autentikasi sesi.
                    </li>
                    <li>
                        <strong>Cookie Analitik:</strong> Membantu kami memahami cara pengguna berinteraksi dengan website
                        untuk perbaikan layanan.
                    </li>
                </ul>
                <p>
                    Anda dapat mengatur browser untuk menolak semua atau beberapa cookie. Namun, penolakan cookie esensial
                    dapat memengaruhi fungsi dan pengalaman penggunaan website.
                </p>
            </>
        ),
    },
    {
        id: 'hak-pengguna',
        title: '8. Hak-Hak Anda',
        content: (
            <>
                <p>Sesuai dengan peraturan perlindungan data yang berlaku, Anda memiliki hak-hak berikut:</p>
                <ul>
                    <li>
                        <strong>Hak Akses:</strong> Meminta informasi tentang data pribadi yang kami simpan tentang Anda.
                    </li>
                    <li>
                        <strong>Hak Koreksi:</strong> Meminta perbaikan atas data yang tidak akurat atau tidak lengkap.
                    </li>
                    <li>
                        <strong>Hak Penghapusan:</strong> Meminta penghapusan data Anda, sejauh tidak bertentangan dengan
                        kewajiban hukum.
                    </li>
                    <li>
                        <strong>Hak Penarikan Persetujuan:</strong> Menarik persetujuan pemrosesan data kapan saja, tanpa
                        memengaruhi legalitas pemrosesan sebelumnya.
                    </li>
                    <li>
                        <strong>Hak Portabilitas:</strong> Meminta salinan data Anda dalam format yang dapat dibaca mesin.
                    </li>
                </ul>
                <p>
                    Untuk menggunakan hak-hak di atas, silakan hubungi kami melalui informasi kontak yang tercantum di
                    bagian akhir kebijakan ini.
                </p>
            </>
        ),
    },
    {
        id: 'perubahan-kebijakan',
        title: '9. Perubahan Kebijakan Privasi',
        content: (
            <>
                <p>
                    Kami berhak memperbarui Kebijakan Privasi ini sewaktu-waktu untuk mencerminkan perubahan praktik,
                    layanan, atau persyaratan hukum. Setiap perubahan material akan diberitahukan melalui pemberitahuan
                    yang jelas di website ini atau melalui email kepada pengguna terdaftar.
                </p>
                <p>
                    Tanggal "Terakhir Diperbarui" di bagian atas halaman ini akan direvisi setiap kali kebijakan ini
                    diubah. Penggunaan website secara berkelanjutan setelah perubahan diterbitkan dianggap sebagai
                    persetujuan Anda terhadap perubahan tersebut.
                </p>
            </>
        ),
    },
    {
        id: 'kontak',
        title: '10. Hubungi Kami',
        content: (
            <>
                <p>
                    Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini atau
                    pengelolaan data pribadi Anda, jangan ragu untuk menghubungi kami:
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
                <p>Kami akan berupaya merespons setiap pertanyaan dalam waktu 5 (lima) hari kerja.</p>
            </>
        ),
    },
];

export default function PrivacyPolicy() {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const description =
        'Kebijakan Privasi GenBI Unugiri — pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.';

    return (
        <div className="min-h-screen bg-white font-sans text-[#1d1d1f]">
            <Head title="Kebijakan Privasi | GenBI Unugiri">
                <meta name="description" content={description} />
                <meta property="og:title" content="Kebijakan Privasi | GenBI Unugiri" />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={`${origin}/asset/foto/home-1920.webp`} />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="GenBI Unugiri" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Kebijakan Privasi | GenBI Unugiri" />
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
                            Kebijakan Privasi
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
                            Kebijakan Privasi ini berlaku untuk seluruh layanan digital GenBI Unugiri. Untuk pertanyaan
                            lebih lanjut, silakan hubungi pengurus GenBI Unugiri melalui saluran komunikasi resmi kami.
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
