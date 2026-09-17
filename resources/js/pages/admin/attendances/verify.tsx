import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import {
    CheckCircle2,
    XCircle,
    UserCheck,
    ShieldCheck,
    Camera,
    Award,
    ClipboardList,
    ChevronLeft,
    ChevronRight,
    CheckCheck,
    Ban,
    RefreshCcw,
} from 'lucide-react';

type Attendance = {
    id: number;
    photo_path: string;
    user: { name: string; nim: string | null };
    event: { title: string };
    event_role: { name: string; points: number } | null;
};

type HistoryItem = {
    id: number;
    status: 'disetujui' | 'ditolak' | 'revisi';
    created_at: string;
    verified_at: string | null;
    rejection_reason: string | null;
    user: { name: string; nim: string | null };
    event: { title: string };
    event_role: { name: string; points: number } | null;
    verifier: { name: string } | null;
};

type PaginatedHistory = {
    data: HistoryItem[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

export default function AttendanceVerify({
    attendances,
    history,
}: {
    attendances: Attendance[];
    history: PaginatedHistory;
}) {
    const verify = (id: number) => router.patch(route('admin.attendances.verify', id));
    const reject = (id: number) => {
        const reason = window.prompt('Alasan penolakan absensi:');
        if (reason) router.patch(route('admin.attendances.reject', id), { reason });
    };

    const requestRevision = (id: number) => {
        const reason = window.prompt('Alasan pengembalian untuk revisi absensi:');
        if (reason) router.patch(route('admin.attendances.request_revision', id), { reason });
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Verifikasi Absensi', href: '/admin/absensi' } as BreadcrumbItem]}>
            <Head title="Verifikasi Absensi Member" />
            <div className="space-y-8 p-6 max-w-7xl mx-auto">

                {/* ── HEADER ── */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-200 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <ShieldCheck className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                            Verifikasi Absensi Member
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Tinjau dan validasi bukti foto selfie serta peran kehadiran peserta acara.
                        </p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold w-fit">
                        {attendances.length} Pengajuan Menunggu Verifikasi
                    </div>
                </div>

                {/* ── KARTU PENDING ── */}
                {attendances.length === 0 ? (
                    <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mb-3">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Tidak Ada Antrean Verifikasi</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                            Semua pengajuan absensi selfie peserta saat ini telah diverifikasi.
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {attendances.map((attendance) => (
                            <Card key={attendance.id} className="overflow-hidden border border-slate-200 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200">
                                <CardHeader className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                                <UserCheck className="h-4 w-4 text-indigo-600" />
                                                {attendance.user.name}
                                            </CardTitle>
                                            {attendance.user.nim && (
                                                <p className="text-xs text-slate-500 font-mono mt-0.5">NIM: {attendance.user.nim}</p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-2 truncate">
                                        📍 {attendance.event.title}
                                    </p>
                                </CardHeader>

                                <CardContent className="p-4 space-y-4">
                                    {attendance.photo_path ? (
                                        <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-950 h-52">
                                            <img
                                                src={route('admin.attendances.photo', attendance.id)}
                                                alt={`Selfie ${attendance.user.name}`}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 right-2 bg-slate-900/80 text-white px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur flex items-center gap-1">
                                                <Camera className="w-3 h-3" /> Live Selfie
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-52 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs italic">
                                            Foto tidak tersedia
                                        </div>
                                    )}

                                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-medium">Peran Kehadiran:</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                                {attendance.event_role?.name ?? '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-medium flex items-center gap-1">
                                                <Award className="w-3.5 h-3.5 text-amber-500" /> Poin Diperoleh:
                                            </span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                +{attendance.event_role?.points ?? 0} poin
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 pt-1">
                                        <Button
                                            size="sm"
                                            onClick={() => verify(attendance.id)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all px-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Setujui
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => requestRevision(attendance.id)}
                                            className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-900 dark:text-amber-400 font-medium transition-all px-2"
                                        >
                                            <RefreshCcw className="w-4 h-4 mr-1.5" /> Revisi
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => reject(attendance.id)}
                                            className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900 dark:text-rose-400 font-medium transition-all px-2"
                                        >
                                            <XCircle className="w-4 h-4 mr-1.5" /> Tolak
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ── TABEL RIWAYAT ABSENSI ── */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Riwayat Data Absensi</h2>
                        <span className="ml-auto text-xs text-slate-500">
                            {history.total} total data
                        </span>
                    </div>

                    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide w-8">#</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Member</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Kegiatan</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Peran</th>
                                        <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Poin</th>
                                        <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Status</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Diverifikasi Oleh</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Tgl Verifikasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {history.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-12 text-slate-400 dark:text-slate-600 text-sm italic">
                                                Belum ada data riwayat absensi.
                                            </td>
                                        </tr>
                                    ) : (
                                        history.data.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-slate-400 text-xs">
                                                    {history.from + index}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                                                        {item.user.name}
                                                    </div>
                                                    {item.user.nim && (
                                                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                                                            {item.user.nim}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 max-w-[200px]">
                                                    <div className="text-slate-700 dark:text-slate-300 truncate" title={item.event.title}>
                                                        {item.event.title}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        {item.event_role?.name ?? <span className="italic text-slate-400">-</span>}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {item.status === 'disetujui' ? (
                                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                            +{item.event_role?.points ?? 0}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {item.status === 'disetujui' ? (
                                                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800 gap-1 font-semibold">
                                                            <CheckCheck className="w-3 h-3" />
                                                            Disetujui
                                                        </Badge>
                                                    ) : item.status === 'ditolak' ? (
                                                        <Badge className="bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800 gap-1 font-semibold">
                                                            <Ban className="w-3 h-3" />
                                                            Ditolak
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-500 dark:border-amber-800 gap-1 font-semibold">
                                                            <RefreshCcw className="w-3 h-3" />
                                                            Revisi
                                                        </Badge>
                                                    )}
                                                    {(item.status === 'ditolak' || item.status === 'revisi') && item.rejection_reason && (
                                                        <div className="text-[10px] text-rose-500 dark:text-rose-400 mt-1 max-w-[120px] truncate" title={item.rejection_reason}>
                                                            {item.rejection_reason}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                    {item.verifier?.name ?? <span className="italic text-slate-400 text-xs">-</span>}
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-500 text-xs whitespace-nowrap">
                                                    {formatDate(item.verified_at)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {history.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-300">{history.from}–{history.to}</span> dari{' '}
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{history.total}</span> data
                                </p>
                                <div className="flex items-center gap-1">
                                    {history.links.map((link, i) => {
                                        const isFirst = i === 0;
                                        const isLast = i === history.links.length - 1;

                                        if (isFirst || isLast) {
                                            return (
                                                <Button
                                                    key={i}
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                                    className="h-8 w-8 p-0 border-slate-200 dark:border-slate-700"
                                                >
                                                    {isFirst ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                </Button>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={i}
                                                size="sm"
                                                variant={link.active ? 'default' : 'outline'}
                                                onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                                className={`h-8 w-8 p-0 text-xs font-medium ${link.active
                                                    ? 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white'
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}