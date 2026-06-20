import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { type FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kelola User', href: '/dashboard/users' },
    { title: 'Tambah User', href: '/dashboard/users/create' },
];

interface Props {
    roles: string[];
    divisions: { id: number; name: string }[];
}

export default function UsersCreate({ roles, divisions }: Props) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, errors, processing } = useForm({
        name:        '',
        email:       '',
        password:    '',
        nim:         '',
        prodi:       '',
        angkatan:    '',
        alamat:      '',
        avatar:      null as File | null,
        role:        '',
        division_id: '' as string | number,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'), { forceFormData: true });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('avatar', file);
        if (file) setAvatarPreview(URL.createObjectURL(file));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah User" />
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('users.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah User</h1>
                        <p className="text-muted-foreground">Buat akun anggota baru GenBI.</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main fields */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Akun</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Lengkap <span className="text-destructive">*</span></Label>
                                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="Nama lengkap" />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                                        <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required placeholder="email@contoh.com" />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                                        <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required placeholder="Min. 8 karakter" />
                                        <InputError message={errors.password} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Pribadi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="nim">NIM</Label>
                                            <Input id="nim" value={data.nim} onChange={(e) => setData('nim', e.target.value)} placeholder="Nomor Induk Mahasiswa" maxLength={20} />
                                            <InputError message={errors.nim} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="angkatan">Angkatan</Label>
                                            <Input id="angkatan" value={data.angkatan} onChange={(e) => setData('angkatan', e.target.value)} placeholder="2022" maxLength={4} />
                                            <InputError message={errors.angkatan} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="prodi">Program Studi</Label>
                                        <Input id="prodi" value={data.prodi} onChange={(e) => setData('prodi', e.target.value)} placeholder="Program Studi" maxLength={100} />
                                        <InputError message={errors.prodi} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="alamat">Alamat</Label>
                                        <Textarea id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} placeholder="Alamat lengkap" rows={3} />
                                        <InputError message={errors.alamat} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar settings */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Foto Profil</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {avatarPreview && (
                                        <img src={avatarPreview} alt="Preview" className="h-32 w-32 rounded-full object-cover mx-auto" />
                                    )}
                                    <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} />
                                    <p className="text-xs text-muted-foreground">JPG, PNG — maks 2MB</p>
                                    <InputError message={errors.avatar} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Role & Divisi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Role <span className="text-destructive">*</span></Label>
                                        <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((r) => (
                                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Divisi</Label>
                                        <Select
                                            value={data.division_id ? String(data.division_id) : ''}
                                            onValueChange={(v) => setData('division_id', v === 'none' ? '' : Number(v))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih divisi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">— Tanpa divisi —</SelectItem>
                                                {divisions.map((d) => (
                                                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.division_id} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Button type="submit" className="w-full" disabled={processing}>
                                Simpan User
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
