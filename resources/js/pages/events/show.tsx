import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Clock, XCircle, Camera } from 'lucide-react';

type EventRole = { id: number; name: string; points: number };
type MyAttendance = {
    id: number;
    status: string;
    event_role: { name: string; points: number } | null;
    created_at: string;
    photo_path: string | null;
};
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

export default function EventShow({ event, myAttendance }: { event: Event; myAttendance?: MyAttendance | null }) {
    const renderAttendanceBadge = (status: string) => {
        switch (status) {
            case 'disetujui':
                return (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-xs px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Absensi Disetujui
                    </span>
                );
            case 'ditolak':
                return (
                    <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-semibold text-xs px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                        <XCircle className="w-3.5 h-3.5" /> Absensi Ditolak
                    </span>
                );
            case 'menunggu':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold text-xs px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi
                    </span>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Acara', href: '/acara' } as BreadcrumbItem, { title: event.title, href: '#' }]}>
            <Head title={event.title} />
            <div className="p-6">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
                                <p className="text-muted-foreground text-sm mt-1">
                                    {event.komisariat?.name ?? 'Semua komisariat'} · {event.starts_at} - {event.ends_at}
                                </p>
                            </div>
                            {myAttendance && renderAttendanceBadge(myAttendance.status)}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <p className="text-sm leading-relaxed">{event.description}</p>
                        
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Peran & Poin Kehadiran</h4>
                            <div className="flex flex-wrap gap-2">
                                {event.roles.map((role) => (
                                    <span key={role.id} className="rounded border px-3 py-1 text-sm bg-slate-50 dark:bg-slate-900 font-medium">
                                        {role.name}: <span className="text-primary font-bold">{role.points} poin</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {myAttendance ? (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-slate-600">Status Absensi Anda:</p>
                                    {renderAttendanceBadge(myAttendance.status)}
                                </div>
                                <div className="flex items-center justify-between text-sm border-t border-slate-200 pt-2">
                                    <span className="text-slate-500">Peran Kehadiran</span>
                                    <span className="font-semibold text-slate-900">
                                        {myAttendance.event_role
                                            ? `${myAttendance.event_role.name} (${myAttendance.event_role.points} poin)`
                                            : '-'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Waktu Absen</span>
                                    <span className="font-medium text-slate-900">{myAttendance.created_at}</span>
                                </div>
                                {myAttendance.photo_path && (
                                    <div className="pt-1 space-y-1.5">
                                        <p className="text-xs font-semibold text-slate-500">Bukti Foto Selfie:</p>
                                        <div className="relative overflow-hidden rounded-xl border border-slate-200 h-52 bg-slate-900">
                                            <img
                                                src={route('admin.attendances.photo', myAttendance.id)}
                                                alt="Bukti selfie absensi"
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur flex items-center gap-1">
                                                <Camera className="w-3 h-3" /> Live Selfie
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            event.status === 'dibuka' && (
                                <Button asChild className="w-full sm:w-auto">
                                    <Link href={route('events.attendance.create', event.slug)}>
                                        <Camera className="w-4 h-4 mr-2" /> Ambil Bukti Selfie & Absen
                                    </Link>
                                </Button>
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
