import { useState, FormEvent } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';
import { Pencil, Trash2, Check, X, Tag, PlusCircle, Layers } from 'lucide-react';

type Komisariat = {
    id: number;
    name: string;
    code: string;
    events_count: number;
    is_active: boolean;
};

export default function KomisariatsIndex({ komisariats }: { komisariats: Komisariat[] }) {
    // Form for creating a new Category
    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm<{ name: string; code: string; is_active: boolean }>({
        name: '',
        code: '',
        is_active: true,
    });

    // Editing state for inline category update
    const [editingId, setEditingId] = useState<number | null>(null);
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm<{ name: string; code: string; is_active: boolean }>({
        name: '',
        code: '',
        is_active: true,
    });

    const handleCreateSubmit = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.komisariats.store'), {
            onSuccess: () => resetCreate(),
        });
    };

    const startEditing = (komisariat: Komisariat) => {
        setEditingId(komisariat.id);
        setEditData({
            name: komisariat.name,
            code: komisariat.code,
            is_active: komisariat.is_active,
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        resetEdit();
    };

    const handleUpdateSubmit = (event: FormEvent, id: number) => {
        event.preventDefault();
        put(route('admin.komisariats.update', id), {
            onSuccess: () => cancelEditing(),
        });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Yakin ingin menghapus kategori acara "${name}"?`)) {
            router.delete(route('admin.komisariats.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kategori Acara', href: '/admin/komisariat' } as BreadcrumbItem]}>
            <Head title="Master Kategori Acara" />
            <div className="space-y-6 p-6 max-w-7xl mx-auto">
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Tag className="h-6 w-6 text-indigo-600" />
                        Kelola Kategori Acara
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Atur kategori/komisariat sebagai pengelompokan jenis acara dalam sistem.
                    </p>
                </div>

                {/* Card 1: Form Tambah Kategori Acara */}
                <Card className="border border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-3">
                        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <PlusCircle className="h-4 w-4 text-emerald-600" />
                            Tambah Kategori Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <form onSubmit={handleCreateSubmit} className="grid gap-4 md:grid-cols-3 items-end">
                            <div>
                                <Label htmlFor="create_name" className="text-xs font-semibold text-slate-700">Nama Kategori Acara</Label>
                                <Input
                                    id="create_name"
                                    placeholder="Contoh: Komisariat Unesa"
                                    value={createData.name}
                                    onChange={(e) => setCreateData('name', e.target.value)}
                                    className="text-slate-900 border-slate-300 mt-1 focus:ring-2 focus:ring-indigo-500/20"
                                />
                                <InputError message={createErrors.name} />
                            </div>
                            <div>
                                <Label htmlFor="create_code" className="text-xs font-semibold text-slate-700">Kode Singkatan</Label>
                                <Input
                                    id="create_code"
                                    placeholder="Contoh: UNESA"
                                    value={createData.code}
                                    onChange={(e) => setCreateData('code', e.target.value.toUpperCase())}
                                    className="text-slate-900 border-slate-300 mt-1 focus:ring-2 focus:ring-indigo-500/20 uppercase"
                                />
                                <InputError message={createErrors.code} />
                            </div>
                            <Button type="submit" disabled={createProcessing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm">
                                <PlusCircle className="w-4 h-4 mr-1.5" /> Simpan Kategori
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Card 2: Daftar Kategori Acara */}
                <Card className="border border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Layers className="h-4 w-4 text-indigo-600" />
                            Daftar Kategori Acara
                        </CardTitle>
                        <span className="text-xs text-slate-500 font-medium">{komisariats.length} Kategori Registered</span>
                    </CardHeader>
                    <CardContent className="p-0">
                        {komisariats.length === 0 ? (
                            <p className="text-sm text-slate-500 py-8 text-center">Belum ada kategori acara tersimpan.</p>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {komisariats.map((komisariat) => {
                                    const isEditing = editingId === komisariat.id;

                                    if (isEditing) {
                                        return (
                                            <form
                                                key={komisariat.id}
                                                onSubmit={(e) => handleUpdateSubmit(e, komisariat.id)}
                                                className="grid gap-3 p-4 md:grid-cols-4 items-center bg-indigo-50/40 border-l-4 border-indigo-600 transition-all"
                                            >
                                                <div>
                                                    <Label htmlFor={`edit_name_${komisariat.id}`} className="text-xs font-semibold text-slate-700">Nama Kategori</Label>
                                                    <Input
                                                        id={`edit_name_${komisariat.id}`}
                                                        value={editData.name}
                                                        onChange={(e) => setEditData('name', e.target.value)}
                                                        className="h-9 text-sm text-slate-900 bg-white border-slate-300 mt-1"
                                                    />
                                                    <InputError message={editErrors.name} />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`edit_code_${komisariat.id}`} className="text-xs font-semibold text-slate-700">Kode</Label>
                                                    <Input
                                                        id={`edit_code_${komisariat.id}`}
                                                        value={editData.code}
                                                        onChange={(e) => setEditData('code', e.target.value.toUpperCase())}
                                                        className="h-9 text-sm text-slate-900 bg-white border-slate-300 mt-1 uppercase"
                                                    />
                                                    <InputError message={editErrors.code} />
                                                </div>
                                                <div className="flex items-center gap-2 pt-5">
                                                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={editData.is_active}
                                                            onChange={(e) => setEditData('is_active', e.target.checked)}
                                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        Status Aktif
                                                    </label>
                                                </div>
                                                <div className="flex gap-2 justify-end pt-4">
                                                    <Button type="submit" size="sm" disabled={editProcessing} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                                                        <Check className="w-3.5 h-3.5 mr-1" /> Simpan
                                                    </Button>
                                                    <Button type="button" variant="outline" size="sm" onClick={cancelEditing} className="h-8 border-slate-300 text-slate-700">
                                                        <X className="w-3.5 h-3.5 mr-1" /> Batal
                                                    </Button>
                                                </div>
                                            </form>
                                        );
                                    }

                                    return (
                                        <div key={komisariat.id} className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-slate-900 text-sm">
                                                        {komisariat.name}
                                                    </p>
                                                    <span className="bg-slate-100 text-slate-700 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-200 font-bold">
                                                        {komisariat.code}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                                                            komisariat.is_active
                                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                        }`}
                                                    >
                                                        {komisariat.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Terhubung ke <strong className="text-slate-700">{komisariat.events_count ?? 0}</strong> acara
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => startEditing(komisariat)}
                                                    className="h-8 border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                                                >
                                                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(komisariat.id, komisariat.name)}
                                                    className="h-8 bg-rose-600 hover:bg-rose-700 text-white font-medium"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
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