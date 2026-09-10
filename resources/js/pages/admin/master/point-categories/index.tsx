import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

type Category = { id: number; name: string; description: string | null; rates_count: number };

export default function PointCategoriesIndex({ categories }: { categories: Category[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', description: '' });
    const submit = (event: FormEvent) => { event.preventDefault(); post(route('admin.point-categories.store'), { onSuccess: () => reset() }); };

    return <AppLayout breadcrumbs={[{ title: 'Kategori poin', href: '/admin/kategori-poin' } as BreadcrumbItem]}><Head title="Kategori poin" /><div className="space-y-6 p-6">
        <Card><CardHeader><CardTitle>Tambah kategori</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="space-y-4"><div><Label htmlFor="name">Nama</Label><Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} /><InputError message={errors.name} /></div><div><Label htmlFor="description">Deskripsi</Label><Textarea id="description" value={data.description} onChange={(event) => setData('description', event.target.value)} /></div><Button type="submit" disabled={processing}>Simpan kategori</Button></form></CardContent></Card>
        <Card><CardHeader><CardTitle>Daftar kategori</CardTitle></CardHeader><CardContent><div className="divide-y">{categories.map((category) => <div key={category.id} className="py-4"><p className="font-medium">{category.name}</p><p className="text-sm text-muted-foreground">{category.rates_count} tarif</p></div>)}</div></CardContent></Card>
    </div></AppLayout>;
}