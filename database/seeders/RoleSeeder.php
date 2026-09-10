<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionNames = [
            'manage_master_data',
            'manage_events',
            'verify_attendance',
            'verify_submissions',
            'view_recap',
            'manage_transactions',
        ];
        $permissions = [];
        foreach ($permissionNames as $permissionName) {
            $permissions[$permissionName] = Permission::findOrCreate($permissionName, 'web');
        }

        $roles = [
            'superadmin' => $permissionNames,
            'admin_korkom' => [
                'manage_events',
                'verify_attendance',
                'verify_submissions',
                'view_recap',
                'manage_transactions',
            ],
            'admin_komisariat' => [
                'manage_events',
                'verify_attendance',
                'verify_submissions',
                'view_recap',
            ],
            'anggota' => ['view_recap'],
        ];

        foreach ($roles as $name => $rolePermissions) {
            $role = Role::findOrCreate($name, 'web');
            $role->syncPermissions(array_map(
                fn (string $permission) => $permissions[$permission],
                $rolePermissions,
            ));
        }
    }
}
