<?php

namespace Database\Seeders;

use App\Models\Komisariat;
use App\Models\Period;
use App\Models\PointCategory;
use App\Models\PointRate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        Period::query()->update(['is_active' => false]);
        Period::updateOrCreate(
            ['name' => 'Ganjil 2026-2027'],
            [
                'starts_on' => '2026-08-01',
                'ends_on' => '2027-01-31',
                'target_points' => 100,
                'is_active' => true,
            ],
        );

        foreach (
            [
                ['name' => 'UNUGIRI Bojonegoro', 'code' => 'UNUGIRI'],
                ['name' => 'Komisariat Utara', 'code' => 'UTARA'],
                ['name' => 'Komisariat Selatan', 'code' => 'SELATAN'],
            ] as $komisariat
        ) {
            Komisariat::updateOrCreate(['code' => $komisariat['code']], $komisariat);
        }

        $categories = [
            ['name' => 'Kepemimpinan', 'rates' => [['name' => 'Ketua panitia', 'points' => 20], ['name' => 'Koordinator', 'points' => 15], ['name' => 'Anggota panitia', 'points' => 10]]],
            ['name' => 'Kegiatan Organisasi', 'rates' => [['name' => 'Peserta kegiatan', 'points' => 5], ['name' => 'Pemateri', 'points' => 15], ['name' => 'Moderator', 'points' => 10]]],
            ['name' => 'Pengembangan Diri', 'rates' => [['name' => 'Pelatihan', 'points' => 10], ['name' => 'Sertifikasi', 'points' => 20]]],
            ['name' => 'Karya dan Prestasi', 'rates' => [['name' => 'Tingkat regional', 'points' => 20], ['name' => 'Tingkat nasional', 'points' => 30]]],
            ['name' => 'Kontribusi Sosial', 'rates' => [['name' => 'Relawan kegiatan', 'points' => 10], ['name' => 'Pengabdian masyarakat', 'points' => 15]]],
        ];

        foreach ($categories as $categoryData) {
            $category = PointCategory::updateOrCreate(
                ['slug' => Str::slug($categoryData['name'])],
                ['name' => $categoryData['name'], 'is_active' => true],
            );

            foreach ($categoryData['rates'] as $rate) {
                PointRate::updateOrCreate(
                    ['point_category_id' => $category->id, 'name' => $rate['name']],
                    ['points' => $rate['points'], 'is_active' => true],
                );
            }
        }
    }
}
