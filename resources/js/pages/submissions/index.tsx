import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
                <div className="grid gap-4">
                    {submissions.map((submission) => (
                        <Card key={submission.id}>
                            <CardHeader>
                                <CardTitle>{submission.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                                    <span>
                                        {submission.points_requested} poin · Status: {submission.status} · Revisi: {submission.revision_count}
                                    </span>
                                    {submission.status === 'ditolak' && (
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('submissions.edit', submission.id)}>Revisi</Link>
                                        </Button>
                                    )}
                                </div>
                                {submission.rejection_reason && <p className="mt-3 text-sm text-amber-700">{submission.rejection_reason}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
