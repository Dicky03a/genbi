import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

type Komisariat = { id: number; name: string };
type EventRole = { name: string; points: number };
type ExistingEvent = { id: number; title: string; description: string | null; komisariat_id: number | null; starts_at: string; ends_at: string; opens_at: string; closes_at: string; latitude: string; longitude: string; radius_m: number; max_gps_accuracy_m: number | null; roles: EventRole[] };
type EventForm = { komisariat_id: string; title: string; description: string; starts_at: string; ends_at: string; opens_at: string; closes_at: string; latitude: string; longitude: string; radius_m: number; max_gps_accuracy_m: number | ''; roles: EventRole[] };

const emptyRole = (): EventRole => ({ name: '', points: 0 });

const localDateTime = (value?: string): string => value ? value.slice(0, 16).replace(' ', 'T') : '';

export default function EventForm({ event, komisariats }: { event?: ExistingEvent; komisariats: Komisariat[] }) {
    const editing = Boolean(event);
    const { data, setData, post, put, processing, errors } = useForm<EventForm>({
        komisariat_id: event?.komisariat_id?.toString() ?? '',
        title: event?.title ?? '',
        description: event?.description ?? '',
        starts_at: localDateTime(event?.starts_at),
        ends_at: localDateTime(event?.ends_at),
        opens_at: localDateTime(event?.opens_at),
        closes_at: localDateTime(event?.closes_at),
        latitude: event?.latitude ?? '',
        longitude: event?.longitude ?? '',
        radius_m: event?.radius_m ?? 100,
        max_gps_accuracy_m: event?.max_gps_accuracy_m ?? '',
        roles: event?.roles ?? [emptyRole()],
    });
    const [roleError, setRoleError] = useState('');
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Acara', href: '/admin/acara' }, { title: editing ? 'Edit' : 'Buat', href: '#' }];

    const updateRole = (index: number, field: keyof EventRole, value: string) => {
        const roles = data.roles.map((role, roleIndex) => roleIndex === index ? { ...role, [field]: field === 'points' ? Number(value) : value } : role);
        setData('roles', roles);
    };

    const submit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        if (data.roles.some((role) => !role.name.trim())) {
            setRoleError('Nama setiap peran wajib diisi.');
            return;
        }
        setRoleError('');
        const options = { onError: () => setRoleError('') };
        editing ? put(route('admin.events.update', event?.id), options) : post(route('admin.events.store'), options);
    };

    return <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={editing ? 'Edit acara' : 'Buat acara'} />
        <div className="p-6"><form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
            <Card><CardHeader><CardTitle>{editing ? 'Edit acara' : 'Buat acara'}</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2"><Label htmlFor="title">Nama acara</Label><Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} /><InputError message={errors.title} /></div>
                <div className="md:col-span-2"><Label htmlFor="description">Deskripsi</Label><Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} /><InputError message={errors.description} /></div>
                <div><Label htmlFor="komisariat_id">Komisariat</Label><select id="komisariat_id" className="border-input bg-background flex h-9 w-full rounded-md border px-3 text-sm" value={data.komisariat_id} onChange={(e) => setData('komisariat_id', e.target.value)}><option value="">Semua komisariat</option>{komisariats.map((komisariat) => <option key={komisariat.id} value={komisariat.id}>{komisariat.name}</option>)}</select><InputError message={errors.komisariat_id} /></div>
                <div><Label htmlFor="radius_m">Radius lokasi (meter)</Label><Input id="radius_m" type="number" min="1" value={data.radius_m} onChange={(e) => setData('radius_m', Number(e.target.value))} /><InputError message={errors.radius_m} /></div>
                <div><Label htmlFor="latitude">Latitude</Label><Input id="latitude" value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} /><InputError message={errors.latitude} /></div>
                <div><Label htmlFor="longitude">Longitude</Label><Input id="longitude" value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} /><InputError message={errors.longitude} /></div>
                <div><Label htmlFor="max_gps_accuracy_m">Akurasi GPS maksimum (meter)</Label><Input id="max_gps_accuracy_m" type="number" min="1" value={data.max_gps_accuracy_m} onChange={(e) => setData('max_gps_accuracy_m', e.target.value ? Number(e.target.value) : '')} /><InputError message={errors.max_gps_accuracy_m} /></div>
                <div><Label htmlFor="starts_at">Acara mulai</Label><Input id="starts_at" type="datetime-local" value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} /><InputError message={errors.starts_at} /></div>
                <div><Label htmlFor="ends_at">Acara selesai</Label><Input id="ends_at" type="datetime-local" value={data.ends_at} onChange={(e) => setData('ends_at', e.target.value)} /><InputError message={errors.ends_at} /></div>
                <div><Label htmlFor="opens_at">Absensi dibuka</Label><Input id="opens_at" type="datetime-local" value={data.opens_at} onChange={(e) => setData('opens_at', e.target.value)} /><InputError message={errors.opens_at} /></div>
                <div><Label htmlFor="closes_at">Absensi ditutup</Label><Input id="closes_at" type="datetime-local" value={data.closes_at} onChange={(e) => setData('closes_at', e.target.value)} /><InputError message={errors.closes_at} /></div>
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Peran dan poin</CardTitle></CardHeader><CardContent className="space-y-3">{data.roles.map((role, index) => <div key={index} className="flex gap-3"><Input aria-label={`Nama peran ${index + 1}`} placeholder="Nama peran" value={role.name} onChange={(e) => updateRole(index, 'name', e.target.value)} /><Input aria-label={`Poin peran ${index + 1}`} type="number" min="0" placeholder="Poin" value={role.points} onChange={(e) => updateRole(index, 'points', e.target.value)} /><Button type="button" variant="outline" onClick={() => setData('roles', data.roles.filter((_, roleIndex) => roleIndex !== index))}>Hapus</Button></div>)}<InputError message={roleError || errors.roles} /><Button type="button" variant="outline" onClick={() => setData('roles', [...data.roles, emptyRole()])}>Tambah peran</Button></CardContent></Card>
            <div className="flex gap-3"><Button type="submit" disabled={processing}>{editing ? 'Simpan perubahan' : 'Simpan acara'}</Button><Button type="button" variant="outline" asChild><Link href={route('admin.events.index')}>Batal</Link></Button></div>
        </form></div>
    </AppLayout>;
}