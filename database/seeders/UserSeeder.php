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
        $superadmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@genbi.com',
            'password' => Hash::make('password'),
        ]);
        $superadmin->assignRole('Superadmin');

        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@genbi.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@genbi.com',
            'password' => Hash::make('password'),
        ]);
        $user->assignRole('user');
    }
}
