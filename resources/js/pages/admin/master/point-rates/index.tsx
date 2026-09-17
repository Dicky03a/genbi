import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Check, CircleDollarSign, Pencil, Plus, Tags, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Rate = {
    id: number;
    point_category_id: number;
    name: string;
    points: number;
    is_active: boolean;
    point_category: { id: number; name: string };
};

type Category = { id: number; name: string; is_active: boolean };
type RateForm = { point_category_id: string; name: string; points: number; is_active: boolean };

const emptyRate: RateForm = { point_category_id: '', name: '', points: 0, is_active: true };

export default function PointRatesIndex({ rates, categories }: { rates: Rate[]; categories: Category[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: isCreating,
        errors: createErrors,
        reset: resetCreate,
    } = useForm<RateForm>(emptyRate);
    const { data: editData, setData: setEditData, put, processing: isUpdating, errors: editErrors, reset: resetEdit } = useForm<RateForm>(emptyRate);

    const createRate = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.point-rates.store'), { onSuccess: () => resetCreate() });
    };

    const startEditing = (rate: Rate) => {
        setEditingId(rate.id);
        setEditData({
            point_category_id: String(rate.point_category_id),
            name: rate.name,
            points: rate.points,
            is_active: rate.is_active,
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        resetEdit();
    };

    const updateRate = (event: FormEvent, id: number) => {
        event.preventDefault();
        put(route('admin.point-rates.update', id), { onSuccess: cancelEditing });
    };

    const deleteRate = (rate: Rate) => {
        if (confirm(`Hapus tarif poin "${rate.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('admin.point-rates.destroy', rate.id));
        }
    };

    const categorySelect = (id: string, value: string, onChange: (value: string) => void, includeInactive = true) => (
        <select
            id={id}
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
            value={value}
            onChange={(event) => onChange(event.target.value)}
        >
            <option value="">Pilih kategori</option>
            {categories
                .filter((category) => includeInactive || category.is_active)
                .map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                        {!category.is_active && ' (nonaktif)'}
                    </option>
                ))}
        </select>
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Tarif poin', href: '/admin/tarif-poin' } as BreadcrumbItem]}>
            <Head title="Kelola Tarif Poin" />
            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                <header className="border-border flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-primary mb-2 flex items-center gap-2">
                            <CircleDollarSign className="size-5" />
                            <span className="text-xs font-bold tracking-[0.16em] uppercase">Master poin</span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">Kelola tarif poin</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Tetapkan nilai poin untuk setiap peran dan aktivitas anggota.</p>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                        {rates.length} tarif tersimpan
                    </Badge>
                </header>

                <Card>
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Plus className="text-primary size-4" /> Tambah tarif poin
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <form onSubmit={createRate} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">
                            <div className="space-y-2 xl:col-span-2">
                                <Label htmlFor="create-category">Kategori poin</Label>
                                {categorySelect(
                                    'create-category',
                                    createData.point_category_id,
                                    (value) => setCreateData('point_category_id', value),
                                    false,
                                )}
                                <InputError message={createErrors.point_category_id} />
                            </div>
                            <div className="space-y-2 xl:col-span-2">
                                <Label htmlFor="create-name">Nama tarif</Label>
                                <Input
                                    id="create-name"
                                    placeholder="Contoh: Ketua panitia"
                                    value={createData.name}
                                    onChange={(event) => setCreateData('name', event.target.value)}
                                />
                                <InputError message={createErrors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-points">Nilai poin</Label>
                                <Input
                                    id="create-points"
                                    type="number"
                                    min="0"
                                    value={createData.points}
                                    onChange={(event) => setCreateData('points', Number(event.target.value))}
                                />
                                <InputError message={createErrors.points} />
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 xl:col-span-2">
                                <Label htmlFor="create-active" className="cursor-pointer">
                                    Tarif aktif
                                </Label>
                                <Switch
                                    id="create-active"
                                    checked={createData.is_active}
                                    onCheckedChange={(checked) => setCreateData('is_active', checked)}
                                />
                            </div>
                            <div className="xl:col-span-3">
                                <Button type="submit" disabled={isCreating}>
                                    <Plus /> Simpan tarif
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="text-base">Daftar tarif poin</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {rates.length === 0 ? (
                            <div className="py-12 text-center">
                                <Tags className="text-muted-foreground/60 mx-auto mb-3 size-8" />
                                <p className="font-medium">Belum ada tarif poin</p>
                                <p className="text-muted-foreground mt-1 text-sm">Tambahkan tarif untuk mulai menentukan perolehan poin.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {rates.map((rate) => {
                                    const isEditing = editingId === rate.id;

                                    return isEditing ? (
                                        <form
                                            key={rate.id}
                                            onSubmit={(event) => updateRate(event, rate.id)}
                                            className="bg-primary/[0.04] grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-6 xl:items-end"
                                        >
                                            <div className="space-y-2 xl:col-span-2">
                                                <Label htmlFor={`edit-category-${rate.id}`}>Kategori poin</Label>
                                                {categorySelect(`edit-category-${rate.id}`, editData.point_category_id, (value) =>
                                                    setEditData('point_category_id', value),
                                                )}
                                                <InputError message={editErrors.point_category_id} />
                                            </div>
                                            <div className="space-y-2 xl:col-span-2">
                                                <Label htmlFor={`edit-name-${rate.id}`}>Nama tarif</Label>
                                                <Input
                                                    id={`edit-name-${rate.id}`}
                                                    value={editData.name}
                                                    onChange={(event) => setEditData('name', event.target.value)}
                                                />
                                                <InputError message={editErrors.name} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`edit-points-${rate.id}`}>Nilai poin</Label>
                                                <Input
                                                    id={`edit-points-${rate.id}`}
                                                    type="number"
                                                    min="0"
                                                    value={editData.points}
                                                    onChange={(event) => setEditData('points', Number(event.target.value))}
                                                />
                                                <InputError message={editErrors.points} />
                                            </div>
                                            <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                                                <Label htmlFor={`edit-active-${rate.id}`} className="cursor-pointer">
                                                    Aktif
                                                </Label>
                                                <Switch
                                                    id={`edit-active-${rate.id}`}
                                                    checked={editData.is_active}
                                                    onCheckedChange={(checked) => setEditData('is_active', checked)}
                                                />
                                            </div>
                                            <div className="flex flex-wrap gap-2 xl:col-span-6 xl:justify-end">
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
                                            key={rate.id}
                                            className="hover:bg-muted/30 flex flex-col gap-4 p-4 transition-colors md:flex-row md:items-center md:justify-between"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold">{rate.name}</p>
                                                    <Badge variant={rate.is_active ? 'default' : 'secondary'}>
                                                        {rate.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground mt-1 text-sm">Kategori: {rate.point_category.name}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="bg-primary/10 text-primary rounded-md px-3 py-1.5 text-sm font-bold">
                                                    {rate.points.toLocaleString('id-ID')} poin
                                                </span>
                                                <Button type="button" variant="outline" size="sm" onClick={() => startEditing(rate)}>
                                                    <Pencil /> Edit
                                                </Button>
                                                <Button type="button" variant="destructive" size="sm" onClick={() => deleteRate(rate)}>
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
