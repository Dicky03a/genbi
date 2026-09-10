import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

type Period = { id: number; name: string; starts_on: string; ends_on: string; target_points: number; is_active: boolean };

export default function PeriodsIndex({ periods }: { periods: Period[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', starts_on: '', ends_on: '', target_points: 0 });
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Periode', href: '/admin/periode' }];

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.periods.store'), { onSuccess: () => reset() });
    };

    return <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Periode" />
        <div className="space-y-6 p-6">
            <Card><CardHeader><CardTitle>Tambah periode</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="grid gap-4 md:grid-cols-4">
                <div><Label htmlFor="name">Nama</Label><Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} /><InputError message={errors.name} /></div>
                <div><Label htmlFor="starts_on">Mulai</Label><Input id="starts_on" type="date" value={data.starts_on} onChange={(event) => setData('starts_on', event.target.value)} /><InputError message={errors.starts_on} /></div>
                <div><Label htmlFor="ends_on">Selesai</Label><Input id="ends_on" type="date" value={data.ends_on} onChange={(event) => setData('ends_on', event.target.value)} /><InputError message={errors.ends_on} /></div>
                <div><Label htmlFor="target_points">Target poin</Label><Input id="target_points" type="number" min="0" value={data.target_points} onChange={(event) => setData('target_points', Number(event.target.value))} /><InputError message={errors.target_points} /></div>
                <Button type="submit" disabled={processing} className="md:col-span-4 md:w-fit">Simpan periode</Button>
            </form></CardContent></Card>
            <Card><CardHeader><CardTitle>Daftar periode</CardTitle></CardHeader><CardContent><div className="divide-y">{periods.map((period) => <div key={period.id} className="flex items-center justify-between py-4"><div><p className="font-medium">{period.name}</p><p className="text-sm text-muted-foreground">{period.starts_on} - {period.ends_on} | Target {period.target_points}</p></div>{period.is_active ? <span className="text-sm font-medium text-green-600">Aktif</span> : <Button variant="outline" size="sm" onClick={() => post(route('admin.periods.activate', period.id))}>Aktifkan</Button>}</div>)}</div></CardContent></Card>
        </div>
    </AppLayout>;
}