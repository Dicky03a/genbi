<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\User;
use Illuminate\Database\Seeder;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisions = [
            [
                'name' => 'KOMINFO',
                'keterangan' => 'Divisi Komunikasi dan Informasi yang bertanggung jawab atas pengelolaan media sosial dan informasi publik.',
            ],
            [
                'name' => 'PSDM',
                'keterangan' => 'Divisi Pengembangan Sumber Daya Mahasiswa yang fokus pada pengembangan internal anggota.',
            ],
            [
                'name' => 'HUBMAS',
                'keterangan' => 'Divisi Hubungan Masyarakat yang menjalin kerjasama dengan pihak eksternal.',
            ],
        ];

        foreach ($divisions as $div) {
            $division = Division::create($div);

            // Assign some random users to each division if they exist
            $users = User::role('user')->whereNull('division_id')->limit(2)->get();
            foreach ($users as $user) {
                $user->update(['division_id' => $division->id]);
            }
        }
    }
}
