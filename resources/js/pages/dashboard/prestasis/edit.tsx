import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

interface User {
    id: number;
    name: string;
    avatar: string | null;
}

interface Prestasi {
    id: number;
    title: string;
    description: string;
    user_id: number;
}

interface Props {
    users: User[];
    prestasi: Prestasi;
}

export default function PrestasiEdit({ users, prestasi }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Prestasi', href: '/dashboard/prestasis' },
        { title: 'Edit Prestasi', href: `/dashboard/prestasis/${prestasi.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        user_id: prestasi.user_id.toString(),
        title: prestasi.title,
        description: prestasi.description,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('prestasis.update', prestasi.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Prestasi" />
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('prestasis.index')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Data Prestasi</h1>
                        <p className="text-muted-foreground">Perbarui informasi prestasi yang telah ada.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Prestasi</CardTitle>
                        <CardDescription>Pilih pengguna dan berikan rincian prestasi yang ia peroleh.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="user_id">Pengguna</Label>
                                <select
                                    id="user_id"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.user_id}
                                    onChange={(e) => setData('user_id', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Pilih Pengguna...</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Prestasi</Label>
                                <Input
                                    id="title"
                                    placeholder="Contoh: Juara 1 Lomba Web Design Nasional"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Jelaskan rincian atau tingkat prestasi yang diraih..."
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" type="button" asChild>
                                    <Link href={route('prestasis.index')}>Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
