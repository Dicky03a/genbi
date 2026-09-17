import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';
import { Calendar, Plus, Trash2, ArrowLeft, Save, Award, ImagePlus, X } from 'lucide-react';

type Komisariat = { id: number; name: string };
type EventRole = { name: string; points: number };
type PointRate = { id: number; name: string; points: number };
type ExistingEvent = {
    id: number;
    title: string;
    description: string | null;
    komisariat_id: number | null;
    starts_at: string;
    ends_at: string;
    opens_at: string;
    closes_at: string;
    status: string;
    point_type: string;
    roles: EventRole[];
    pointRates?: PointRate[];
    poster_url?: string;
};
type EventForm = {
    komisariat_id: string;
    title: string;
    description: string;
    starts_at: string;
    ends_at: string;
    point_type: string;
    is_open: boolean;
    roles: EventRole[];
    point_rate_ids: number[];
    poster: File | null;
    _method?: 'put';
};

const emptyRole = (): EventRole => ({ name: '', points: 0 });
const localDateTime = (value?: string): string => (value ? value.slice(0, 16).replace(' ', 'T') : '');

export default function EventForm({ event, komisariats, availablePointRates }: { event?: ExistingEvent; komisariats: Komisariat[]; availablePointRates: PointRate[] }) {
    const editing = Boolean(event);
    const { data, setData, post, put, processing, errors, transform } = useForm<EventForm>({
        komisariat_id: event?.komisariat_id?.toString() ?? '',
        title: event?.title ?? '',
        description: event?.description ?? '',
        starts_at: localDateTime(event?.starts_at),
        ends_at: localDateTime(event?.ends_at),
        point_type: event?.point_type ?? 'role',
        is_open: event?.status === 'dibuka',
        roles: event?.roles?.length ? event.roles : [emptyRole()],
        point_rate_ids: event?.pointRates?.map(pr => pr.id) ?? [],
        poster: null,
    });
    const [roleError, setRoleError] = useState('');
    const [posterPreview, setPosterPreview] = useState<string | null>(event?.poster_url ?? null);
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Acara', href: '/admin/acara' },
        { title: editing ? 'Edit Acara' : 'Buat Acara', href: '#' },
    ];

    const updateRole = (index: number, field: keyof EventRole, value: string) => {
        const roles = data.roles.map((role, roleIndex) =>
            roleIndex === index ? { ...role, [field]: field === 'points' ? Number(value) : value } : role
        );
        setData('roles', roles);
    };

    const submit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        if (data.point_type === 'role' && data.roles.some((role) => !role.name.trim())) {
            setRoleError('Nama setiap peran wajib diisi.');
            return;
        }
        setRoleError('');
        const options = { onError: () => setRoleError('') };
        if (editing) {
            transform((data) => ({
                ...data,
                _method: 'put',
            }));
            post(route('admin.events.update', event?.id), {
                ...options,
                preserveScroll: true,
                forceFormData: true,
            });
        } else {
            post(route('admin.events.store'), options);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={editing ? 'Edit Acara' : 'Buat Acara Baru'} />
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-indigo-600" />
                            {editing ? 'Edit Informasi Acara' : 'Form Buat Acara Baru'}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Lengkapi detail acara, kategori komisariat, dan peran poin peserta.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="border-slate-300 text-slate-700">
                        <Link href={route('admin.events.index')}>
                            <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* @ts-ignore */}
                    {errors.event && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start flex-col">
                            <span className="font-bold text-sm">Kesalahan Server/Sistem</span>
                            {/* @ts-ignore */}
                            <span className="text-sm">{errors.event}</span>
                        </div>
                    )}
                    <Card className="border border-slate-200 bg-white shadow-sm">
                        <CardHeader className="bg-slate-50/60 border-b border-slate-100 pb-3">
                            <CardTitle className="text-base font-bold text-slate-900">Informasi Utama Acara</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Nama Acara <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    placeholder="Masukkan judul / nama acara"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="text-slate-900 border-slate-300 mt-1 focus:ring-2 focus:ring-indigo-500/20"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Deskripsi Acara</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Jelaskan secara singkat agenda & deskripsi acara..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="text-slate-900 border-slate-300 mt-1 min-h-[90px] focus:ring-2 focus:ring-indigo-500/20"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="poster" className="text-xs font-semibold text-slate-700">Poster Acara (Opsional)</Label>
                                <div className="flex items-center gap-4 mt-2">
                                    {(posterPreview) ? (
                                        <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
                                            <img src={posterPreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPosterPreview(null);
                                                    setData('poster', null);
                                                }}
                                                className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-slate-700 hover:text-rose-600 transition shadow-sm opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="poster" className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                                            <ImagePlus className="w-6 h-6 text-slate-400 mb-2" />
                                            <span className="text-xs font-medium text-slate-500">Pilih Gambar</span>
                                        </label>
                                    )}
                                    <div className="flex-1">
                                        <Input
                                            id="poster"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData('poster', file);
                                                    setPosterPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        <p className="text-xs text-slate-500 mt-1 max-w-sm">Unggah poster format JPG/PNG (Maks 2MB) untuk mempercantik tampilan acara.</p>
                                    </div>
                                </div>
                                <InputError message={errors.poster} />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="komisariat_id" className="text-xs font-semibold text-slate-700">Kategori Komisariat Acara</Label>
                                <select
                                    id="komisariat_id"
                                    className="border-slate-300 bg-white text-slate-900 flex h-10 w-full rounded-md border px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    value={data.komisariat_id}
                                    onChange={(e) => setData('komisariat_id', e.target.value)}
                                >
                                    <option value="" className="text-slate-900 font-medium">Semua Komisariat (Acara Umum)</option>
                                    {komisariats.map((komisariat) => (
                                        <option key={komisariat.id} value={komisariat.id} className="text-slate-900">
                                            {komisariat.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.komisariat_id} />
                            </div>

                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="starts_at" className="font-semibold text-slate-700">Waktu Mulai <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="starts_at"
                                            type="datetime-local"
                                            value={data.starts_at}
                                            onChange={(e) => setData('starts_at', e.target.value)}
                                            className="h-10 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <InputError message={errors.starts_at} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ends_at" className="font-semibold text-slate-700">Waktu Selesai <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="ends_at"
                                            type="datetime-local"
                                            value={data.ends_at}
                                            onChange={(e) => setData('ends_at', e.target.value)}
                                            className="h-10 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <InputError message={errors.ends_at} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="md:col-span-2 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                                <div>
                                    <Label htmlFor="is_open" className="font-semibold text-slate-700 text-sm">Buka Absensi Sekarang?</Label>
                                    <p className="text-xs text-slate-500">Tentukan apakah peserta sudah bisa melakukan presensi ke acara ini.</p>
                                </div>
                                <Switch
                                    id="is_open"
                                    checked={data.is_open}
                                    onCheckedChange={(checked) => setData('is_open', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200 bg-white shadow-sm">
                        <CardHeader className="bg-slate-50/60 border-b border-slate-100 pb-3">
                            <CardTitle className="text-base font-bold text-slate-900">Opsi Poin Acara</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4">
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="point_type"
                                        value="role"
                                        checked={data.point_type === 'role'}
                                        onChange={(e) => setData('point_type', e.target.value)}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-slate-900 font-medium">Gunakan Tambah Peran (Kustom)</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="point_type"
                                        value="point_rate"
                                        checked={data.point_type === 'point_rate'}
                                        onChange={(e) => setData('point_type', e.target.value)}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-slate-900 font-medium">Gunakan Data Tarif Poin (Daftar Tarif Aktif)</span>
                                </label>
                            </div>
                            {/* InputError using ts-ignore because point_type might not exist in error types natively but available in errors wrapper */}
                            {/* @ts-ignore */}
                            <InputError message={errors.point_type} />
                        </CardContent>
                    </Card>

                    {data.point_type === 'role' && (
                    <Card className="border border-slate-200 bg-white shadow-sm">
                        <CardHeader className="bg-slate-50/60 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Award className="h-4 w-4 text-amber-500" />
                                Peran Kehadiran & Perolehan Poin
                            </CardTitle>
                            <span className="text-xs text-slate-500">Definisikan poin untuk setiap peran</span>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4">
                            {data.roles.map((role, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                                    <div className="flex-1 w-full">
                                        <Input
                                            aria-label={`Nama peran ${index + 1}`}
                                            placeholder="Contoh: Panitia / Peserta / Pemateri"
                                            value={role.name}
                                            onChange={(e) => updateRole(index, 'name', e.target.value)}
                                            className="text-slate-900 bg-white border-slate-300"
                                        />
                                        {/* @ts-ignore */}
                                        <InputError message={errors[`roles.${index}.name`]} className="mt-1" />
                                    </div>
                                    <div className="w-full sm:w-36">
                                        <Input
                                            aria-label={`Poin peran ${index + 1}`}
                                            type="number"
                                            min="0"
                                            placeholder="Jumlah poin"
                                            value={role.points}
                                            onChange={(e) => updateRole(index, 'points', e.target.value)}
                                            className="text-slate-900 bg-white border-slate-300"
                                        />
                                        {/* @ts-ignore */}
                                        <InputError message={errors[`roles.${index}.points`]} className="mt-1" />
                                    </div>
                                    {data.roles.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setData('roles', data.roles.filter((_, roleIndex) => roleIndex !== index))}
                                            className="bg-rose-600 hover:bg-rose-700 text-white"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <InputError message={roleError || errors.roles} />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setData('roles', [...data.roles, emptyRole()])}
                                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium"
                            >
                                <Plus className="w-4 h-4 mr-1.5" /> Tambah Peran Kehadiran
                            </Button>
                        </CardContent>
                    </Card>
                    )}

                    {data.point_type === 'point_rate' && (
                    <Card className="border border-slate-200 bg-white shadow-sm mt-6">
                        <CardHeader className="bg-slate-50/60 border-b border-slate-100 pb-3">
                            <CardTitle className="text-base font-bold text-slate-900">Pilih Tarif Poin yang Berlaku</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availablePointRates.map((rate) => (
                                    <label key={rate.id} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80 cursor-pointer hover:bg-slate-100 transition">
                                        <input
                                            type="checkbox"
                                            checked={data.point_rate_ids.includes(rate.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setData('point_rate_ids', [...data.point_rate_ids, rate.id]);
                                                } else {
                                                    setData('point_rate_ids', data.point_rate_ids.filter(id => id !== rate.id));
                                                }
                                            }}
                                            className="mt-0.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{rate.name}</p>
                                            <p className="text-xs text-slate-500">{rate.points} poin</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {/* @ts-ignore */}
                            <InputError message={errors.point_rate_ids} />
                        </CardContent>
                    </Card>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm">
                            <Save className="w-4 h-4 mr-1.5" />
                            {editing ? 'Simpan Perubahan Acara' : 'Simpan & Publikasikan Acara'}
                        </Button>
                        <Button type="button" variant="outline" asChild className="border-slate-300 text-slate-700">
                            <Link href={route('admin.events.index')}>Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}