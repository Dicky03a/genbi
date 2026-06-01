<?php

namespace Database\Seeders;

use App\Models\Beasiswa;
use Illuminate\Database\Seeder;

class BeasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Beasiswa::create([
            'title' => 'Beasiswa Bank Indonesia 2026',
            'description' => 'Program beasiswa dari Bank Indonesia untuk mahasiswa berprestasi.',
            'procedures' => "1. Melakukan pendaftaran online melalui tautan yang disediakan.\n2. Mengunggah berkas yang diperlukan.\n3. Mengikuti seleksi administrasi.\n4. Mengikuti wawancara.",
            'requirements' => "1. Mahasiswa aktif jenjang S1.\n2. Minimal telah menyelesaikan 40 SKS.\n3. IPK Minimal 3.00.\n4. Berasal dari keluarga kurang mampu atau memiliki prestasi luar biasa.",
            'required_files' => "1. KTP & Kartu Mahasiswa.\n2. Transkrip Nilai Terakhir.\n3. Surat Keterangan Tidak Mampu (SKTM) atau Sertifikat Prestasi.\n4. Resume / CV.",
            'flow' => "Tahap 1: Seleksi Administrasi\nTahap 2: Tes Potensi Akademik\nTahap 3: Wawancara\nTahap 4: Pengumuman Akhir",
            'link' => 'https://forms.gle/sample-link',
            'is_published' => true,
        ]);
    }
}
