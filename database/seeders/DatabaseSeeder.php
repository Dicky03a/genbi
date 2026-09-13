<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            MasterDataSeeder::class,
            UserSeeder::class,
            AttendanceSeeder::class,
            NewsSeeder::class,
            AboutSeeder::class,
            DivisionSeeder::class,
            BeasiswaSeeder::class,
        ]);
    }
}
