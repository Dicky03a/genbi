import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Check, Pencil, Plus, Tags, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Category = { id: number; name: string; description: string | null; rates_count: number; is_active: boolean };
type CategoryForm = Pick<Category, 'name' | 'description' | 'is_active'>;

const emptyCategory: CategoryForm = { name: '', description: '', is_active: true };

export default function PointCategoriesIndex({ categories, errors }: { categories: Category[]; errors?: { category?: string } }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: isCreating,
        errors: createErrors,
        reset: resetCreate,
    } = useForm<CategoryForm>(emptyCategory);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: isUpdating,
        errors: editErrors,
        reset: resetEdit,
    } = useForm<CategoryForm>(emptyCategory);

    const createCategory = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.point-categories.store'), { onSuccess: () => resetCreate() });
    };

    const startEditing = (category: Category) => {
        setEditingId(category.id);
        setEditData({ name: category.name, description: category.description ?? '', is_active: category.is_active });
    };

    const cancelEditing = () => {
        setEditingId(null);
        resetEdit();
    };

    const updateCategory = (event: FormEvent, id: number) => {
        event.preventDefault();
        put(route('admin.point-categories.update', id), { onSuccess: cancelEditing });
    };

    const deleteCategory = (category: Category) => {
        if (confirm(`Hapus kategori poin "${category.name}"? Data yang sudah digunakan tidak dapat dihapus.`)) {
            router.delete(route('admin.point-categories.destroy', category.id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kategori poin', href: '/admin/kategori-poin' } as BreadcrumbItem]}>
            <Head title="Kelola Kategori Poin" />
            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                <header className="border-border flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-primary mb-2 flex items-center gap-2">
                            <Tags className="size-5" />
                            <span className="text-xs font-bold tracking-[0.16em] uppercase">Master poin</span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">Kelola kategori poin</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Kelompokkan tarif dan pengajuan poin sesuai jenis aktivitas.</p>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                        {categories.length} kategori tersimpan
                    </Badge>
                </header>

                <Card>
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Plus className="text-primary size-4" /> Tambah kategori
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <form onSubmit={createCategory} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">
                            <div className="space-y-2 xl:col-span-2">
                                <Label htmlFor="create-name">Nama kategori</Label>
                                <Input
                                    id="create-name"
                                    placeholder="Contoh: Kepanitiaan"
                                    value={createData.name}
                                    onChange={(event) => setCreateData('name', event.target.value)}
                                />
                                <InputError message={createErrors.name} />
                            </div>
                            <div className="space-y-2 xl:col-span-2">
                                <Label htmlFor="create-description">
                                    Deskripsi <span className="text-muted-foreground font-normal">(opsional)</span>
                                </Label>
                                <Textarea
                                    id="create-description"
                                    rows={1}
                                    placeholder="Keterangan singkat kategori"
                                    value={createData.description ?? ''}
                                    onChange={(event) => setCreateData('description', event.target.value)}
                                />
                                <InputError message={createErrors.description} />
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 xl:mb-0">
                                <Label htmlFor="create-active" className="cursor-pointer">
                                    Aktif
                                </Label>
                                <Switch
                                    id="create-active"
                                    checked={createData.is_active}
                                    onCheckedChange={(checked) => setCreateData('is_active', checked)}
                                />
                            </div>
                            <div className="md:col-span-2 xl:col-span-5">
                                <Button type="submit" disabled={isCreating}>
                                    <Plus /> Simpan kategori
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="text-base">Daftar kategori</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {errors?.category && (
                            <p className="border-destructive/20 bg-destructive/5 text-destructive border-b px-4 py-3 text-sm">{errors.category}</p>
                        )}
                        {categories.length === 0 ? (
                            <div className="py-12 text-center">
                                <Tags className="text-muted-foreground/60 mx-auto mb-3 size-8" />
                                <p className="font-medium">Belum ada kategori poin</p>
                                <p className="text-muted-foreground mt-1 text-sm">Tambahkan kategori untuk membuat tarif poin.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {categories.map((category) => {
                                    const isEditing = editingId === category.id;

                                    return isEditing ? (
                                        <form
                                            key={category.id}
                                            onSubmit={(event) => updateCategory(event, category.id)}
                                            className="bg-primary/[0.04] grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-6 xl:items-end"
                                        >
                                            <div className="space-y-2 xl:col-span-2">
                                                <Label htmlFor={`edit-name-${category.id}`}>Nama kategori</Label>
                                                <Input
                                                    id={`edit-name-${category.id}`}
                                                    value={editData.name}
                                                    onChange={(event) => setEditData('name', event.target.value)}
                                                />
                                                <InputError message={editErrors.name} />
                                            </div>
                                            <div className="space-y-2 xl:col-span-2">
                                                <Label htmlFor={`edit-description-${category.id}`}>
                                                    Deskripsi <span className="text-muted-foreground font-normal">(opsional)</span>
                                                </Label>
                                                <Textarea
                                                    id={`edit-description-${category.id}`}
                                                    rows={1}
                                                    value={editData.description ?? ''}
                                                    onChange={(event) => setEditData('description', event.target.value)}
                                                />
                                                <InputError message={editErrors.description} />
                                            </div>
                                            <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                                                <Label htmlFor={`edit-active-${category.id}`} className="cursor-pointer">
                                                    Aktif
                                                </Label>
                                                <Switch
                                                    id={`edit-active-${category.id}`}
                                                    checked={editData.is_active}
                                                    onCheckedChange={(checked) => setEditData('is_active', checked)}
                                                />
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
                                            key={category.id}
                                            className="hover:bg-muted/30 flex flex-col gap-4 p-4 transition-colors md:flex-row md:items-center md:justify-between"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold">{category.name}</p>
                                                    <Badge variant={category.is_active ? 'default' : 'secondary'}>
                                                        {category.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </div>
                                                {category.description && (
                                                    <p className="text-muted-foreground mt-1 max-w-2xl text-sm">{category.description}</p>
                                                )}
                                                <p className="text-muted-foreground mt-2 text-xs font-medium">
                                                    {category.rates_count} tarif poin terhubung
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Button type="button" variant="outline" size="sm" onClick={() => startEditing(category)}>
                                                    <Pencil /> Edit
                                                </Button>
                                                <Button type="button" variant="destructive" size="sm" onClick={() => deleteCategory(category)}>
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
