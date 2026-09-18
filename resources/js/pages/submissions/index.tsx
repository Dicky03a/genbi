import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Submission = {
    id: number;
    title: string;
    status: string;
    points_requested: number;
    rejection_reason: string | null;
    revision_count: number;
    activity_date?: string;
};

export default function SubmissionIndex({ submissions }: { submissions: Submission[] }) {
    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'disetujui':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900">Disetujui</Badge>;
            case 'ditolak':
                return <Badge variant="destructive">Ditolak</Badge>;
            case 'revisi':
                return <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50">Revisi</Badge>;
            case 'menunggu':
                return <Badge variant="secondary">Menunggu</Badge>;
            default:
                return <Badge variant="secondary" className="capitalize">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pengajuan', href: '/pengajuan' } as BreadcrumbItem]}>
            <Head title="Pengajuan poin" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Pengajuan poin</h1>
                    <Button asChild>
                        <Link href={route('submissions.create')}>Buat pengajuan</Link>
                    </Button>
                </div>
                
                <div className="rounded-md border bg-card">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Poin Diajukan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Revisi</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.length > 0 ? (
                                    submissions.map((submission) => (
                                        <TableRow key={submission.id}>
                                            <TableCell className="font-medium">
                                                <div>{submission.title}</div>
                                                {submission.activity_date && <div className="text-xs text-muted-foreground">{submission.activity_date}</div>}
                                            </TableCell>
                                            <TableCell>{submission.points_requested}</TableCell>
                                            <TableCell>{getStatusBadge(submission.status)}</TableCell>
                                            <TableCell>{submission.revision_count}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end gap-2">
                                                    {(submission.status === 'ditolak' || submission.status === 'revisi') && (
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={route('submissions.edit', submission.id)}>Revisi</Link>
                                                        </Button>
                                                    )}
                                                    {submission.rejection_reason && (
                                                        <span className="text-xs text-amber-600 max-w-[200px] truncate" title={submission.rejection_reason}>
                                                            {submission.rejection_reason}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Belum ada pengajuan poin.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
