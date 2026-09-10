import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

type EventItem = { id: number; title: string; slug: string; status: string; starts_at: string; komisariat: { name: string } | null; roles: { id: number; name: string; points: number }[] };

export default function EventsIndex({ events }: { events: EventItem[] }) {
    const transition = (id: number, status: string) => router.post(route('admin.events.status', id), { status });

    return <AppLayout breadcrumbs={[{ title: 'Acara', href: '/admin/acara' } as BreadcrumbItem]}><Head title="Acara" /><div className="space-y-6 p-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold">Acara</h1><p className="text-sm text-muted-foreground">Kelola acara dan peran poin.</p></div><Button asChild><Link href={route('admin.events.create')}>Buat acara</Link></Button></div><div className="grid gap-4">{events.map((event) => <Card key={event.id}><CardHeader className="flex flex-row items-start justify-between"><div><CardTitle>{event.title}</CardTitle><p className="text-sm text-muted-foreground">{event.komisariat?.name ?? 'Semua komisariat'} · {event.starts_at}</p></div><span className="rounded border px-2 py-1 text-xs">{event.status}</span></CardHeader><CardContent><div className="flex flex-wrap gap-2 text-sm">{event.roles.map((role) => <span key={role.id} className="rounded bg-muted px-2 py-1">{role.name}: {role.points} poin</span>)}</div><div className="mt-4 flex gap-2"><Button variant="outline" size="sm" asChild><Link href={route('admin.events.edit', event.id)}>Edit</Link></Button>{event.status === 'draft' && <Button size="sm" onClick={() => transition(event.id, 'dibuka')}>Buka absensi</Button>}{event.status === 'dibuka' && <Button size="sm" variant="outline" onClick={() => transition(event.id, 'ditutup')}>Tutup absensi</Button>}{event.status === 'ditutup' && <Button size="sm" variant="outline" onClick={() => transition(event.id, 'selesai')}>Selesaikan</Button>}</div></CardContent></Card>)}</div></div></AppLayout>;
}