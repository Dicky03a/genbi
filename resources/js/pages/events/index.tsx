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
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Disetujui
                    </span>
                );
            case 'ditolak':
                return (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-semibold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-red-200 dark:border-red-800 shadow-sm">
                        <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Ditolak
                    </span>
                );
            case 'menunggu':
                return (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-200 dark:border-amber-800 shadow-sm">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Menunggu Verifikasi
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                        Belum Absen
                    </span>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Acara', href: '/acara' } as BreadcrumbItem]}>
            <Head title="Daftar Acara" />
            <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-1.5 sm:gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Daftar Acara</h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Lihat acara yang tersedia dan pantau status absensi Anda.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
                    {events.filter(e => e.my_attendance_status !== 'disetujui').length === 0 ? (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            <CalendarDays className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Acara Kosong</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">Tidak ada acara yang tersedia saat ini atau semua acara sudah disetujui.</p>
                        </div>
                    ) : (
                        events.filter(event => event.my_attendance_status !== 'disetujui').map((event) => (
                            <Card key={event.id} className="group relative overflow-hidden flex flex-col bg-white dark:bg-slate-900 md:bg-white/50 md:dark:bg-slate-900/50 backdrop-blur-sm rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:bg-white dark:hover:bg-slate-900">
                                {/* Top Section: Title and Status */}
                                <div className="flex flex-col items-center mb-3 sm:mb-4 mt-1 sm:mt-2 px-1 sm:px-2">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-center text-slate-950 dark:text-white line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 text-slate-600 dark:text-slate-400 text-[11px] sm:text-sm font-medium">
                                        {event.status === 'dibuka' ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />}
                                        <span className="capitalize">{event.status === 'dibuka' ? 'Pendaftaran Dibuka' : event.status}</span>
                                    </div>
                                </div>

                                {/* Middle Section: Image (The "Poster") */}
                                <div className="w-full aspect-[3/4] relative rounded-xl sm:rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4 sm:mb-5 group-hover:shadow-inner transition-all duration-300">
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
                                                loading="lazy"
                                            />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                            <CalendarDays className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                            <span className="text-slate-400 font-medium text-xs sm:text-sm">Poster Tidak Tersedia</span>
                                        </div>
                                    )}
                                    {event.my_attendance_status && (
                                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
                                            {renderAttendanceBadge(event.my_attendance_status)}
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Section: Avatar, Komisariat & Button */}
                                <div className="flex items-center justify-between mt-auto px-1 sm:px-2">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-white dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 shadow-sm relative overflow-hidden group-hover:shadow-md transition-shadow">
                                            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute z-10" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight tracking-tight">
                                                {event.komisariat?.name ?? 'Umum'}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline-block">
                                                Komisariat
                                            </span>
                                        </div>
                                    </div>
                                    <Button asChild className="rounded-lg sm:rounded-xl h-8 sm:h-9 px-3 sm:px-4 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-md hover:shadow-lg transition-all text-xs sm:text-sm font-semibold">
                                        <Link href={route('events.show', event.slug)}>
                                            Lihat Acara
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {attendedEvents && attendedEvents.length > 0 && (
                    <div className="mt-8 sm:mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 sm:pt-10">
                        <div className="mb-4 sm:mb-6 flex flex-col gap-1.5 sm:gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Riwayat Kehadiran</h2>
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Daftar riwayat acara yang sudah Anda ikuti beserta status absensinya.</p>
                        </div>
                        <div className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto w-full">
                                <Table>
                                    <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="whitespace-nowrap font-semibold h-10 sm:h-12 px-4 sm:px-6">Nama Acara</TableHead>
                                            <TableHead className="whitespace-nowrap font-semibold h-10 sm:h-12 px-4 sm:px-6">Tanggal</TableHead>
                                            <TableHead className="whitespace-nowrap font-semibold h-10 sm:h-12 px-4 sm:px-6">Komisariat</TableHead>
                                            <TableHead className="whitespace-nowrap font-semibold h-10 sm:h-12 px-4 sm:px-6">Status</TableHead>
                                            <TableHead className="text-right whitespace-nowrap font-semibold h-10 sm:h-12 px-4 sm:px-6">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendedEvents.map((event) => (
                                            <TableRow key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <TableCell className="font-medium whitespace-nowrap min-w-[200px] px-4 sm:px-6 py-3 sm:py-4">{event.title}</TableCell>
                                                <TableCell className="whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 text-sm">{event.starts_at}</TableCell>
                                                <TableCell className="whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 text-sm">{event.komisariat?.name ?? '-'}</TableCell>
                                                <TableCell className="whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4">{renderAttendanceBadge(event.my_attendance_status)}</TableCell>
                                                <TableCell className="text-right whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4">
                                                    <Button variant="outline" size="sm" asChild className="h-8 rounded-lg text-xs font-semibold">
                                                        <Link href={route('events.show', event.slug)}>Detail</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}