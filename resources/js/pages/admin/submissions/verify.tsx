import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    CheckCircle2,
    XCircle,
    ClipboardList,
    ShieldCheck,
    CheckCheck,
    Ban,
    ChevronLeft,
    ChevronRight,
    Award,
    FileText,
} from 'lucide-react';

type Submission = {
    id: number;
    title: string;
    points_requested: number;
    user: { name: string; nim: string | null };
    point_category: { name: string };
    rejection_reason: string | null;
};

type HistoryItem = {
    id: number;
    title: string;
    points_requested: number;
    status: 'disetujui' | 'ditolak';
    created_at: string;
    verified_at: string | null;
    rejection_reason: string | null;
    revision_count: number;
    user: { name: string; nim: string | null };
    point_category: { name: string };
    period: { name: string } | null;
    division: { name: string } | null;
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

export default function SubmissionVerify({
    submissions,
    history,
}: {
    submissions: Submission[];
    history: PaginatedHistory;
}) {
    const verify = (id: number) => router.patch(route('admin.submissions.verify', id));
    const reject = (id: number) => {
        const reason = window.prompt('Alasan penolakan');
        if (reason) router.patch(route('admin.submissions.reject', id), { reason });
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
        <AppLayout breadcrumbs={[{ title: 'Verifikasi Pengajuan', href: '/admin/pengajuan' } as BreadcrumbItem]}>
            <Head title="Verifikasi Pengajuan Poin" />
            <div className="space-y-8 p-6 max-w-7xl mx-auto">

                {/* ── HEADER ── */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <ShieldCheck className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                            Verifikasi Pengajuan Poin
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Tinjau dan validasi pengajuan poin yang dikirimkan oleh anggota.
                        </p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold w-fit">
                        {submissions.length} Pengajuan Menunggu Verifikasi
                    </div>
                </div>

                {/* ── KARTU PENDING ── */}
                {submissions.length === 0 ? (
                    <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mb-3">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Tidak Ada Antrean Verifikasi</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                            Semua pengajuan poin anggota saat ini telah diverifikasi.
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {submissions.map((submission) => (
                            <Card
                                key={submission.id}
                                className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <CardHeader className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-start gap-2">
                                        <FileText className="h-4 w-4 mt-0.5 text-indigo-600 shrink-0" />
                                        {submission.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{submission.user.name}</span>
                                        {submission.user.nim && <span className="font-mono">· {submission.user.nim}</span>}
                                        <span>· {submission.point_category.name}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border border-slate-200/60 dark:border-slate-800">
                                        <span className="text-sm text-slate-500 flex items-center gap-1.5">
                                            <Award className="w-4 h-4 text-amber-500" /> Poin Diminta:
                                        </span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                            +{submission.points_requested} poin
                                        </span>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <Button
                                            size="sm"
                                            onClick={() => verify(submission.id)}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Setujui
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => reject(submission.id)}
                                            className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900 dark:text-rose-400 font-medium transition-all"
                                        >
                                            <XCircle className="w-4 h-4 mr-1.5" /> Tolak
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ── TABEL RIWAYAT PENGAJUAN ── */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Riwayat Data Pengajuan</h2>
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
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Judul Pengajuan</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Kategori</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Periode</th>
                                        <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Poin</th>
                                        <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Status</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Diverifikasi Oleh</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Tgl Verifikasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {history.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-12 text-slate-400 dark:text-slate-600 text-sm italic">
                                                Belum ada data riwayat pengajuan.
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
                                                    <div className="text-slate-700 dark:text-slate-300 truncate font-medium" title={item.title}>
                                                        {item.title}
                                                    </div>
                                                    {item.division && (
                                                        <div className="text-xs text-slate-400 mt-0.5">{item.division.name}</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                    {item.point_category.name}
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-500 text-xs">
                                                    {item.period?.name ?? '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {item.status === 'disetujui' ? (
                                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                            +{item.points_requested}
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
                                                    ) : (
                                                        <Badge className="bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800 gap-1 font-semibold">
                                                            <Ban className="w-3 h-3" />
                                                            Ditolak
                                                        </Badge>
                                                    )}
                                                    {item.status === 'ditolak' && item.rejection_reason && (
                                                        <div className="text-[10px] text-rose-500 mt-1 max-w-[120px] truncate" title={item.rejection_reason}>
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
