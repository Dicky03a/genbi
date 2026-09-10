import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

type Submission = {
    id: number;
    title: string;
    points_requested: number;
    user: { name: string; nim: string | null };
    point_category: { name: string };
    rejection_reason: string | null;
};

export default function SubmissionVerify({ submissions }: { submissions: Submission[] }) {
    const reject = (id: number) => {
        const reason = window.prompt('Alasan penolakan');
        if (reason) router.patch(route('admin.submissions.reject', id), { reason });
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Verifikasi pengajuan', href: '/admin/pengajuan' } as BreadcrumbItem]}>
            <Head title="Verifikasi pengajuan" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Verifikasi pengajuan poin</h1>
                <div className="grid gap-4 md:grid-cols-2">
                    {submissions.map((submission) => (
                        <Card key={submission.id}>
                            <CardHeader>
                                <CardTitle>{submission.title}</CardTitle>
                                <p className="text-muted-foreground text-sm">
                                    {submission.user.name} · {submission.point_category.name}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm">Permintaan: {submission.points_requested} poin</p>
                                <div className="flex gap-2">
                                    <Button onClick={() => router.patch(route('admin.submissions.verify', submission.id))}>Setujui</Button>
                                    <Button variant="outline" onClick={() => reject(submission.id)}>
                                        Tolak
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
