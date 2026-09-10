import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

type Rate = { id: number; name: string; points: number; point_category: { name: string } };
type Category = { id: number; name: string };

export default function PointRatesIndex({ rates, categories }: { rates: Rate[]; categories: Category[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({ point_category_id: '', name: '', points: 0 });
    const submit = (event: FormEvent) => { event.preventDefault(); post(route('admin.point-rates.store'), { onSuccess: () => reset() }); };

    return <AppLayout breadcrumbs={[{ title: 'Tarif poin', href: '/admin/tarif-poin' } as BreadcrumbItem]}><Head title="Tarif poin" /><div className="space-y-6 p-6">
        <Card><CardHeader><CardTitle>Tambah tarif</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="grid gap-4 md:grid-cols-3"><div><Label htmlFor="point_category_id">Kategori</Label><select id="point_category_id" className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm" value={data.point_category_id} onChange={(event) => setData('point_category_id', event.target.value)}><option value="">Pilih kategori</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><InputError message={errors.point_category_id} /></div><div><Label htmlFor="name">Nama tarif</Label><Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} /><InputError message={errors.name} /></div><div><Label htmlFor="points">Poin</Label><Input id="points" type="number" min="0" value={data.points} onChange={(event) => setData('points', Number(event.target.value))} /><InputError message={errors.points} /></div><Button type="submit" disabled={processing} className="md:w-fit">Simpan tarif</Button></form></CardContent></Card>
        <Card><CardHeader><CardTitle>Daftar tarif</CardTitle></CardHeader><CardContent><div className="divide-y">{rates.map((rate) => <div key={rate.id} className="flex justify-between py-4"><div><p className="font-medium">{rate.name}</p><p className="text-sm text-muted-foreground">{rate.point_category.name}</p></div><span>{rate.points} poin</span></div>)}</div></CardContent></Card>
    </div></AppLayout>;
}