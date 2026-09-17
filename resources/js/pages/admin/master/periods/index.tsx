import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarDays, Check, Pencil, Plus, Power, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Period = {
    id: number;
    name: string;
    starts_on: string;
    ends_on: string;
    target_points: number;
    is_active: boolean;
};

type PeriodForm = Pick<Period, 'name' | 'starts_on' | 'ends_on' | 'target_points'>;

const emptyPeriod: PeriodForm = { name: '', starts_on: '', ends_on: '', target_points: 0 };
const toDateInput = (date: string) => date.slice(0, 10);

export default function PeriodsIndex({ periods, errors }: { periods: Period[]; errors?: { period?: string } }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: isCreating,
        errors: createErrors,
        reset: resetCreate,
    } = useForm<PeriodForm>(emptyPeriod);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: isUpdating,
        errors: editErrors,
        reset: resetEdit,
    } = useForm<PeriodForm>(emptyPeriod);

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Periode', href: '/admin/periode' }];

    const createPeriod = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.periods.store'), { onSuccess: () => resetCreate() });
    };

    const startEditing = (period: Period) => {
        setEditingId(period.id);
        setEditData({
            name: period.name,
            starts_on: toDateInput(period.starts_on),
            ends_on: toDateInput(period.ends_on),
            target_points: period.target_points,
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        resetEdit();
    };

    const updatePeriod = (event: FormEvent, id: number) => {
        event.preventDefault();
        put(route('admin.periods.update', id), { onSuccess: cancelEditing });
    };

    const deletePeriod = (period: Period) => {
        if (confirm(`Hapus periode "${period.name}"? Data yang sudah digunakan tidak dapat dihapus.`)) {
            router.delete(route('admin.periods.destroy', period.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Periode" />
            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                <header className="border-border flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-primary mb-2 flex items-center gap-2">
                            <CalendarDays className="size-5" />
                            <span className="text-xs font-bold tracking-[0.16em] uppercase">Master poin</span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">Kelola periode poin</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Buat periode, tetapkan target, dan pilih satu periode yang sedang aktif.</p>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                        {periods.length} periode tersimpan
                    </Badge>
                </header>

                <Card>
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Plus className="text-primary size-4" /> Tambah periode
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <form onSubmit={createPeriod} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">
                            <div className="space-y-2 xl:col-span-2">
                                <Label htmlFor="create-name">Nama periode</Label>
                                <Input
                                    id="create-name"
                                    placeholder="Contoh: Ganjil 2026/2027"
                                    value={createData.name}
                                    onChange={(event) => setCreateData('name', event.target.value)}
                                />
                                <InputError message={createErrors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-starts-on">Tanggal mulai</Label>
                                <Input
                                    id="create-starts-on"
                                    type="date"
                                    value={createData.starts_on}
                                    onChange={(event) => setCreateData('starts_on', event.target.value)}
                                />
                                <InputError message={createErrors.starts_on} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-ends-on">Tanggal selesai</Label>
                                <Input
                                    id="create-ends-on"
                                    type="date"
                                    value={createData.ends_on}
                                    onChange={(event) => setCreateData('ends_on', event.target.value)}
                                />
                                <InputError message={createErrors.ends_on} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-target-points">Target poin</Label>
                                <Input
                                    id="create-target-points"
                                    type="number"
                                    min="0"
                                    value={createData.target_points}
                                    onChange={(event) => setCreateData('target_points', Number(event.target.value))}
                                />
                                <InputError message={createErrors.target_points} />
                            </div>
                            <div className="md:col-span-2 xl:col-span-5">
                                <Button type="submit" disabled={isCreating}>
                                    <Plus /> Simpan periode
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="text-base">Daftar periode</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {errors?.period && (
                            <p className="border-destructive/20 bg-destructive/5 text-destructive border-b px-4 py-3 text-sm">{errors.period}</p>
                        )}
                        {periods.length === 0 ? (
                            <div className="py-12 text-center">
                                <CalendarDays className="text-muted-foreground/60 mx-auto mb-3 size-8" />
                                <p className="font-medium">Belum ada periode</p>
                                <p className="text-muted-foreground mt-1 text-sm">Tambahkan periode pertama untuk mulai mencatat poin.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {periods.map((period) => {
                                    const isEditing = editingId === period.id;

                                    return isEditing ? (
                                        <form
                                            key={period.id}
                                            onSubmit={(event) => updatePeriod(event, period.id)}
                                            className="bg-primary/[0.04] grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-6 xl:items-end"
                                        >
                                            <div className="space-y-2 xl:col-span-2">
                                                <Label htmlFor={`edit-name-${period.id}`}>Nama periode</Label>
                                                <Input
                                                    id={`edit-name-${period.id}`}
                                                    value={editData.name}
                                                    onChange={(event) => setEditData('name', event.target.value)}
                                                />
                                                <InputError message={editErrors.name} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`edit-starts-on-${period.id}`}>Tanggal mulai</Label>
                                                <Input
                                                    id={`edit-starts-on-${period.id}`}
                                                    type="date"
                                                    value={editData.starts_on}
                                                    onChange={(event) => setEditData('starts_on', event.target.value)}
                                                />
                                                <InputError message={editErrors.starts_on} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`edit-ends-on-${period.id}`}>Tanggal selesai</Label>
                                                <Input
                                                    id={`edit-ends-on-${period.id}`}
                                                    type="date"
                                                    value={editData.ends_on}
                                                    onChange={(event) => setEditData('ends_on', event.target.value)}
                                                />
                                                <InputError message={editErrors.ends_on} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`edit-target-points-${period.id}`}>Target poin</Label>
                                                <Input
                                                    id={`edit-target-points-${period.id}`}
                                                    type="number"
                                                    min="0"
                                                    value={editData.target_points}
                                                    onChange={(event) => setEditData('target_points', Number(event.target.value))}
                                                />
                                                <InputError message={editErrors.target_points} />
                                            </div>
                                            <div className="flex flex-wrap gap-2 xl:justify-end">
                                                <Button type="submit" size="sm" disabled={isUpdating}>
                                                    <Check /> Simpan
                                                </Button>
                                                <Button type="button" size="sm" variant="outline" onClick={cancelEditing}>
                                                    <X /> Batal
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div
                                            key={period.id}
                                            className="hover:bg-muted/30 flex flex-col gap-4 p-4 transition-colors md:flex-row md:items-center md:justify-between"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold">{period.name}</p>
                                                    <Badge variant={period.is_active ? 'default' : 'secondary'}>
                                                        {period.is_active ? 'Aktif' : 'Tidak aktif'}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground mt-1 text-sm">
                                                    {toDateInput(period.starts_on)} — {toDateInput(period.ends_on)}{' '}
                                                    <span className="text-border px-1.5">•</span> Target{' '}
                                                    {period.target_points.toLocaleString('id-ID')} poin
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {!period.is_active && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.post(route('admin.periods.activate', period.id))}
                                                    >
                                                        <Power /> Aktifkan
                                                    </Button>
                                                )}
                                                <Button type="button" variant="outline" size="sm" onClick={() => startEditing(period)}>
                                                    <Pencil /> Edit
                                                </Button>
                                                <Button type="button" variant="destructive" size="sm" onClick={() => deletePeriod(period)}>
                                                    <Trash2 /> Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
