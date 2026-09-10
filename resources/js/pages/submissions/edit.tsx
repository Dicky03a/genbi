import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Rate = { id: number; name: string; points: number };
type Category = { id: number; name: string; rates: Rate[] };
type Submission = { id: number; point_category_id: number; title: string; description: string | null; rejection_reason: string | null };

export default function SubmissionEdit({ submission, categories }: { submission: Submission; categories: Category[] }) {
    const { data, setData, put, processing, errors } = useForm({
        point_rate_id: '',
        title: submission.title,
        description: submission.description ?? '',
        evidence: null as File | null,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        put(route('submissions.update', submission.id), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pengajuan', href: '/pengajuan' } as BreadcrumbItem, { title: 'Revisi', href: '#' }]}>
            <Head title="Revisi pengajuan" />
            <div className="p-6">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Revisi pengajuan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {submission.rejection_reason && (
                                <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm">
                                    <strong>Alasan penolakan:</strong> {submission.rejection_reason}
                                </div>
                            )}
                            <div>
                                <Label htmlFor="point_rate_id">Jenis kegiatan dan tarif</Label>
                                <select
                                    id="point_rate_id"
                                    className="border-input bg-background flex h-9 w-full rounded-md border px-3 text-sm"
                                    value={data.point_rate_id}
                                    onChange={(e) => setData('point_rate_id', e.target.value)}
                                >
                                    <option value="">Pilih tarif baru</option>
                                    {categories.map((category) => (
                                        <optgroup key={category.id} label={category.name}>
                                            {category.rates.map((rate) => (
                                                <option key={rate.id} value={rate.id}>
                                                    {rate.name} - {rate.points} poin
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                <InputError message={errors.point_rate_id} />
                            </div>
                            <div>
                                <Label htmlFor="title">Judul kegiatan</Label>
                                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                <InputError message={errors.title} />
                            </div>
                            <div>
                                <Label htmlFor="description">Keterangan</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} />
                            </div>
                            <div>
                                <Label htmlFor="evidence">Bukti baru</Label>
                                <Input id="evidence" type="file" onChange={(e) => setData('evidence', e.target.files?.[0] ?? null)} />
                            </div>
                            <Button type="submit" disabled={processing}>
                                Kirim revisi
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
