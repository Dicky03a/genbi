import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';
import { CalendarDays, CheckCircle2, Clock, XCircle } from 'lucide-react';

type EventItem = {
    id: number;
    slug: string;
    title: string;
    status: string;
    starts_at: string;
    komisariat: { name: string } | null;
    my_attendance_status?: string | null;
    poster_url?: string;
};

export default function EventsIndex({ events, attendedEvents = [] }: { events: EventItem[], attendedEvents?: EventItem[] }) {
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

    const activeEvents = events.filter(event => 
        !(event.status === 'selesai' && event.my_attendance_status === 'disetujui')
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Acara', href: '/acara' } as BreadcrumbItem]}>
            <Head title="Daftar Acara" />
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Daftar Acara</h1>
                    <p className="text-sm text-muted-foreground">Lihat acara yang tersedia dan pantau status absensi Anda.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {activeEvents.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 col-span-full">Belum ada acara yang dibuka.</p>
                    ) : (
                        activeEvents.map((event) => (
                            <Card key={event.id} className="relative overflow-hidden flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {/* Top Section: Title and Status */}
                                <div className="flex flex-col items-center mb-4 mt-2 px-2">
                                    <h3 className="text-xl font-semibold tracking-tight text-center text-slate-950 dark:text-white line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-600 dark:text-slate-400 text-sm font-medium">
                                        {event.status === 'dibuka' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4" />}
                                        <span className="capitalize">{event.status === 'dibuka' ? 'Pendaftaran Dibuka' : event.status}</span>
                                    </div>
                                </div>

                                {/* Middle Section: Image (The "Poster") */}
                                <div className="w-full aspect-square sm:aspect-[4/3] relative rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4 group">
                                    {event.poster_url ? (
                                        <>
                                            <img 
                                                src={event.poster_url} 
                                                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-50 scale-125" 
                                                alt="" aria-hidden="true" 
                                            />
                                            <img 
                                                src={event.poster_url} 
                                                className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 z-10" 
                                                alt={`Poster ${event.title}`} 
                                            />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-slate-400 font-medium text-sm">Poster Tidak Tersedia</span>
                                        </div>
                                    )}
                                    {event.my_attendance_status && (
                                        <div className="absolute top-3 right-3 z-20 shadow-md rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md border border-white/20">
                                            {renderAttendanceBadge(event.my_attendance_status)}
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Section: Avatar, Komisariat & Button */}
                                <div className="flex items-center justify-between mt-auto px-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 shadow-sm relative overflow-hidden">
                                            <CalendarDays className="w-5 h-5 absolute z-10" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 leading-tight">
                                                {event.komisariat?.name ?? 'Umum'}
                                            </span>
                                         
                                        </div>
                                    </div>
                                    <Button asChild size="sm" className="rounded-xl px-4 py-4 bg-[#1c1c1c] text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-slate-200 shadow-md">
                                        <Link href={route('events.show', event.slug)}>
                                            Lihat Detail
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {attendedEvents && attendedEvents.length > 0 && (
                    <div className="mt-12 border-t pt-8">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold">Acara yang Pernah Diikuti</h2>
                            <p className="text-sm text-muted-foreground">Daftar riwayat acara yang sudah Anda ikuti.</p>
                        </div>
                        <div className="rounded-md border bg-white dark:bg-slate-950 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Acara</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Komisariat</TableHead>
                                        <TableHead>Status Absensi</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendedEvents.map((event) => (
                                        <TableRow key={event.id}>
                                            <TableCell className="font-medium">{event.title}</TableCell>
                                            <TableCell>{event.starts_at}</TableCell>
                                            <TableCell>{event.komisariat?.name ?? '-'}</TableCell>
                                            <TableCell>{renderAttendanceBadge(event.my_attendance_status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={route('events.show', event.slug)}>Detail</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}