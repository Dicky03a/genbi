import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Prestasi',
        href: '/dashboard/prestasis',
    },
];

interface User {
    id: number;
    name: string;
    avatar: string | null;
}

interface Prestasi {
    id: number;
    title: string;
    description: string;
    user: User;
}

interface Props {
    prestasis: Prestasi[];
}

export default function PrestasiIndex({ prestasis }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data prestasi ini?')) {
            destroy(route('prestasis.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Prestasi" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Data Prestasi</h1>
                        <p className="text-muted-foreground">Kelola data prestasi user yang akan ditampilkan di halaman publik.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('prestasis.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Prestasi
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Prestasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">User</th>
                                        <th className="px-6 py-3 font-medium">Prestasi</th>
                                        <th className="px-6 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {prestasis.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={item.user.avatar ? `/storage/${item.user.avatar}` : ''} alt={item.user.name} />
                                                        <AvatarFallback>{item.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-semibold">{item.user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-base line-clamp-1">{item.title}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-2 max-w-md">{item.description}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('prestasis.edit', item.id)}>
                                                            <Edit2 className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {prestasis.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">
                                                Tidak ada data prestasi. Mulai dengan menambahkan satu!
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
