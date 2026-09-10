import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type EventRole = { id: number; name: string; points: number };
type Event = {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    status: string;
    starts_at: string;
    ends_at: string;
    komisariat: { name: string } | null;
    roles: EventRole[];
};

export default function EventShow({ event }: { event: Event }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Acara', href: '/acara' } as BreadcrumbItem, { title: event.title, href: '#' }]}>
            <Head title={event.title} />
            <div className="p-6">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">
                            {event.komisariat?.name ?? 'Semua komisariat'} · {event.starts_at} - {event.ends_at}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <p>{event.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {event.roles.map((role) => (
                                <span key={role.id} className="rounded border px-3 py-1 text-sm">
                                    {role.name}: {role.points} poin
                                </span>
                            ))}
                        </div>
                        {event.status === 'dibuka' && (
                            <Button asChild>
                                <Link href={route('events.attendance.create', event.slug)}>Isi absensi</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
