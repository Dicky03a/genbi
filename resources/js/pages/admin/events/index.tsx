import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Calendar, Plus, Pencil, Play, Square, CheckCircle, Tag, Award } from 'lucide-react';

type EventItem = {
    id: number;
    title: string;
    slug: string;
    status: string;
    starts_at: string;
    komisariat: { name: string } | null;
    roles: { id: number; name: string; points: number }[];
};

export default function EventsIndex({ events }: { events: EventItem[] }) {
    const transition = (id: number, status: string) => router.post(route('admin.events.status', id), { status });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'dibuka':
                return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">Absensi Dibuka</span>;
            case 'ditutup':
                return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">Absensi Ditutup</span>;
            case 'selesai':
                return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">Selesai</span>;
            case 'draft':
            default:
                return <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-2.5 py-0.5 rounded-full font-medium">Draft</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Acara', href: '/admin/acara' } as BreadcrumbItem]}>
            <Head title="Kelola Acara Admin" />
            <div className="space-y-6 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-indigo-600" />
                            Kelola Acara & Absensi
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Buat acara baru, atur peran kehadiran & poin, serta kendalikan status absensi.
                        </p>
                    </div>
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm">
                        <Link href={route('admin.events.create')}>
                            <Plus className="w-4 h-4 mr-1.5" /> Buat Acara Baru
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4">
                    {events.length === 0 ? (
                        <Card className="p-8 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                            <p className="text-sm text-slate-500">Belum ada acara yang dibuat.</p>
                        </Card>
                    ) : (
                        events.map((event) => (
                            <Card key={event.id} className="border border-slate-200 bg-white shadow-sm hover:shadow transition">
                                <CardHeader className="bg-slate-50/60 border-b border-slate-100 pb-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div>
                                            <CardTitle className="text-lg font-bold text-slate-900">{event.title}</CardTitle>
                                            <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                                                <span>{event.komisariat?.name ?? 'Kategori Semua Komisariat'}</span>
                                                <span>•</span>
                                                <span>Waktu: {event.starts_at}</span>
                                            </p>
                                        </div>
                                        <div>{getStatusBadge(event.status)}</div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                            <Award className="w-3.5 h-3.5 text-amber-500" /> Peran & Poin Kehadiran:
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {event.roles.map((role) => (
                                                <span key={role.id} className="rounded-lg bg-slate-100 border border-slate-200 text-slate-800 px-3 py-1 font-medium">
                                                    {role.name}: <strong className="text-indigo-600">{role.points} poin</strong>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                                        <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50">
                                            <Link href={route('admin.events.edit', event.id)}>
                                                <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                                            </Link>
                                        </Button>

                                        {event.status === 'draft' && (
                                            <Button size="sm" onClick={() => transition(event.id, 'dibuka')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                                                <Play className="w-3.5 h-3.5 mr-1" /> Buka Absensi
                                            </Button>
                                        )}
                                        {event.status === 'dibuka' && (
                                            <Button size="sm" variant="outline" onClick={() => transition(event.id, 'ditutup')} className="border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 font-medium">
                                                <Square className="w-3.5 h-3.5 mr-1" /> Tutup Absensi
                                            </Button>
                                        )}
                                        {event.status === 'ditutup' && (
                                            <Button size="sm" variant="outline" onClick={() => transition(event.id, 'selesai')} className="border-slate-300 text-slate-800 bg-slate-100 hover:bg-slate-200 font-medium">
                                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Selesaikan Acara
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}