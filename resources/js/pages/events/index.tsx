import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

type EventItem = { id: number; slug: string; title: string; status: string; starts_at: string; komisariat: { name: string } | null };

export default function EventsIndex({ events }: { events: EventItem[] }) {
    return <AppLayout breadcrumbs={[{ title: 'Acara', href: '/acara' } as BreadcrumbItem]}><Head title="Acara" /><div className="space-y-6 p-6"><h1 className="text-2xl font-semibold">Acara</h1><div className="grid gap-4 md:grid-cols-2">{events.map((event) => <Card key={event.id}><CardHeader><CardTitle>{event.title}</CardTitle><p className="text-sm text-muted-foreground">{event.komisariat?.name ?? 'Semua komisariat'} · {event.starts_at}</p></CardHeader><CardContent><Button asChild><Link href={route('events.show', event.slug)}>Lihat acara</Link></Button></CardContent></Card>)}</div></div></AppLayout>;
}