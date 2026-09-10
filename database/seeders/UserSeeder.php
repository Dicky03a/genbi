<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = User::updateOrCreate(['email' => 'superadmin@genbi.com'], [
            'name' => 'Super Admin',
            'email' => 'superadmin@genbi.com',
            'password' => Hash::make('password'),
        ]);
        $superadmin->syncRoles('superadmin');

        $admin = User::updateOrCreate(['email' => 'admin@genbi.com'], [
            'name' => 'Admin User',
            'email' => 'admin@genbi.com',
            'password' => Hash::make('password'),
        ]);
        $admin->syncRoles('admin_korkom');

        $user = User::updateOrCreate(['email' => 'user@genbi.com'], [
            'name' => 'Regular User',
            'email' => 'user@genbi.com',
            'password' => Hash::make('password'),
        ]);
        $user->syncRoles('anggota');
    }
}
