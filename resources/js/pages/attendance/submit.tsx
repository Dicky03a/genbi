import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type EventRole = { id: number; name: string; points: number };
type Event = { id: number; title: string; roles: EventRole[] };

export default function AttendanceSubmit({ event }: { event: Event }) {
    const [locationError, setLocationError] = useState('');
    const { data, setData, processing, errors, setError, clearErrors, reset } = useForm({
        event_role_id: '',
        captured_lat: '',
        captured_lng: '',
        gps_accuracy_m: '',
        photo: null as File | null,
    });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Acara', href: '/acara' },
        { title: 'Absensi', href: '#' },
    ];

    const submit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        setLocationError('');
        clearErrors();
        if (!data.photo) {
            setError('photo', 'Foto wajib dipilih.');
            return;
        }
        const photo = data.photo;
        if (!navigator.geolocation) {
            setLocationError('Perangkat tidak mendukung lokasi.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const payload = new FormData();
                payload.append('event_role_id', data.event_role_id);
                payload.append('captured_lat', String(position.coords.latitude));
                payload.append('captured_lng', String(position.coords.longitude));
                payload.append('gps_accuracy_m', String(position.coords.accuracy));
                payload.append('photo', photo);
                fetch(route('events.attendances.store', event.id), {
                    method: 'POST',
                    body: payload,
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                    },
                }).then(async (response) => {
                    if (!response.ok) {
                        const result = await response.json();
                        setLocationError(result.message ?? 'Absensi gagal dikirim.');
                        return;
                    }
                    reset();
                    setLocationError('Absensi berhasil dikirim dan menunggu verifikasi.');
                });
            },
            () => setLocationError('Lokasi tidak dapat diambil. Izinkan akses lokasi lalu coba lagi.'),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Absensi ${event.title}`} />
            <div className="p-6">
                <Card className="mx-auto max-w-xl">
                    <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <Label htmlFor="event_role_id">Peran</Label>
                                <select
                                    id="event_role_id"
                                    className="border-input bg-background flex h-9 w-full rounded-md border px-3 text-sm"
                                    value={data.event_role_id}
                                    onChange={(e) => setData('event_role_id', e.target.value)}
                                >
                                    <option value="">Pilih peran</option>
                                    {event.roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name} - {role.points} poin
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.event_role_id} />
                            </div>
                            <div>
                                <Label htmlFor="photo">Foto kehadiran</Label>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => setData('photo', e.target.files?.[0] ?? null)}
                                />
                                <InputError message={errors.photo} />
                            </div>
                            {locationError && <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm">{locationError}</p>}
                            <Button type="submit" disabled={processing}>
                                Kirim absensi
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
