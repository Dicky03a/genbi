import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

type Komisariat = { id: number; name: string; code: string; users_count: number; is_active: boolean };

export default function KomisariatsIndex({ komisariats }: { komisariats: Komisariat[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', code: '' });
    const submit = (event: FormEvent) => { event.preventDefault(); post(route('admin.komisariats.store'), { onSuccess: () => reset() }); };

    return <AppLayout breadcrumbs={[{ title: 'Komisariat', href: '/admin/komisariat' } as BreadcrumbItem]}><Head title="Komisariat" /><div className="space-y-6 p-6">
        <Card><CardHeader><CardTitle>Tambah komisariat</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="grid gap-4 md:grid-cols-3"><div><Label htmlFor="name">Nama</Label><Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} /><InputError message={errors.name} /></div><div><Label htmlFor="code">Kode</Label><Input id="code" value={data.code} onChange={(event) => setData('code', event.target.value.toUpperCase())} /><InputError message={errors.code} /></div><Button type="submit" disabled={processing} className="md:mt-6 md:w-fit">Simpan</Button></form></CardContent></Card>
        <Card><CardHeader><CardTitle>Daftar komisariat</CardTitle></CardHeader><CardContent><div className="divide-y">{komisariats.map((komisariat) => <div key={komisariat.id} className="flex justify-between py-4"><div><p className="font-medium">{komisariat.name} ({komisariat.code})</p><p className="text-sm text-muted-foreground">{komisariat.users_count} anggota</p></div><span className="text-sm">{komisariat.is_active ? 'Aktif' : 'Nonaktif'}</span></div>)}</div></CardContent></Card>
    </div></AppLayout>;
}