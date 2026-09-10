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

export default function SubmissionCreate({ categories }: { categories: Category[] }) {
    const { data, setData, post, processing, errors } = useForm({
        point_rate_id: '',
        activity_date: '',
        title: '',
        description: '',
        evidence: null as File | null,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('submissions.store'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pengajuan', href: '/pengajuan' } as BreadcrumbItem, { title: 'Buat', href: '#' }]}>
            <Head title="Buat pengajuan" />
            <div className="p-6">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Ajukan poin keaktifan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="point_rate_id">Jenis kegiatan dan tarif</Label>
                                <select
                                    id="point_rate_id"
                                    className="border-input bg-background flex h-9 w-full rounded-md border px-3 text-sm"
                                    value={data.point_rate_id}
                                    onChange={(e) => setData('point_rate_id', e.target.value)}
                                >
                                    <option value="">Pilih tarif</option>
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
                                <Label htmlFor="activity_date">Tanggal aktivitas</Label>
                                <Input
                                    id="activity_date"
                                    type="date"
                                    value={data.activity_date}
                                    onChange={(e) => setData('activity_date', e.target.value)}
                                />
                                <InputError message={errors.activity_date} />
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
                                <Label htmlFor="evidence">Bukti kegiatan</Label>
                                <Input id="evidence" type="file" onChange={(e) => setData('evidence', e.target.files?.[0] ?? null)} />
                                <InputError message={errors.evidence} />
                            </div>
                            <Button type="submit" disabled={processing}>
                                Kirim pengajuan
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
