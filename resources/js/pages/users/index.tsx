import { Head, Link, useForm } from '@inertiajs/react';
import { Edit2, Plus, Trash2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kelola User', href: '/dashboard/users' },
];

interface UserRow {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    nim: string | null;
    prodi: string | null;
    angkatan: string | null;
    roles: string[];
    division: { id: number; name: string } | null;
}

const roleBadge = (role: string) => {
    const map: Record<string, string> = {
        Superadmin: 'bg-red-500',
        admin: 'bg-blue-500',
        user: 'bg-green-500',
    };
    return <Badge className={map[role] ?? 'bg-gray-500'}>{role}</Badge>;
};

export default function UsersIndex({ users }: { users: UserRow[] }) {
    const { delete: destroy } = useForm();
    const getInitials = useInitials();

    const handleDelete = (id: number) => {
        if (confirm('Hapus user ini? Tindakan ini tidak bisa dibatalkan.')) {
            destroy(route('users.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola User" />
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kelola User</h1>
                        <p className="text-muted-foreground">Manajemen akun anggota GenBI.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('users.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah User
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar User ({users.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">User</th>
                                        <th className="px-4 py-3 font-medium">NIM</th>
                                        <th className="px-4 py-3 font-medium">Prodi / Angkatan</th>
                                        <th className="px-4 py-3 font-medium">Role</th>
                                        <th className="px-4 py-3 font-medium">Divisi</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src={user.avatar ? `/storage/${user.avatar}` : undefined}
                                                            alt={user.name}
                                                        />
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {user.nim ?? '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p>{user.prodi ?? '-'}</p>
                                                {user.angkatan && (
                                                    <p className="text-xs text-muted-foreground">Angkatan {user.angkatan}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.roles.length > 0 ? roleBadge(user.roles[0]) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {user.division?.name ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('users.edit', user.id)}>
                                                            <Edit2 className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                                                Belum ada user. Mulai dengan menambahkan user baru.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
