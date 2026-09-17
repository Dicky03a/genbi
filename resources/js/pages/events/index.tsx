import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { CalendarDays, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

type EventItem = {
    id: number;
    slug: string;
    title: string;
    status: string;
    starts_at: string;
    komisariat: { name: string } | null;
    my_attendance_status?: string | null;
};

export default function EventsIndex({ events }: { events: EventItem[] }) {
    const renderAttendanceBadge = (status?: string | null) => {
        switch (status) {
            case 'disetujui':
                return (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-xs px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                    </span>
                );
            case 'ditolak':
                return (
                    <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-semibold text-xs px-2.5 py-1 rounded-full border border-red-200 dark:border-red-800">
                        <XCircle className="w-3.5 h-3.5" /> Ditolak
                    </span>
                );
            case 'menunggu':
                return (
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold text-xs px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        Belum Absen
                    </span>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Acara', href: '/acara' } as BreadcrumbItem]}>
            <Head title="Daftar Acara" />
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Daftar Acara</h1>
                    <p className="text-sm text-muted-foreground">Lihat acara yang tersedia dan pantau status absensi Anda.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {events.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 col-span-2">Belum ada acara yang dibuka.</p>
                    ) : (
                        events.map((event) => (
                            <Card key={event.id} className="hover:shadow-md transition">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-lg font-bold text-black dark:text-white">
                                            {event.title}
                                        </CardTitle>
                                        {renderAttendanceBadge(event.my_attendance_status)}
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <CalendarDays className="w-3.5 h-3.5" />
                                        <span>{event.komisariat?.name ?? 'Kategori Semua Komisariat'}</span>
                                        <span>•</span>
                                        <span>{event.starts_at}</span>
                                    </p>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center pt-0">
                                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${event.status === 'dibuka' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                                        Status Acara: {event.status.toUpperCase()}
                                    </span>
                                    <Button asChild size="sm">
                                        <Link href={route('events.show', event.slug)}>
                                            Lihat Acara <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}