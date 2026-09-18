import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import { type FormEventHandler, useRef, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useInitials } from '@/hooks/use-initials';
import { ImageCropper } from '@/components/image-cropper';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Profile settings', href: '/settings/profile' },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const getInitials = useInitials();

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [uncroppedSrc, setUncroppedSrc] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        _method:  'PATCH' as string,
        name:     user.name,
        email:    user.email,
        nim:      user.nim ?? '',
        prodi:    user.prodi ?? '',
        angkatan: user.angkatan ?? '',
        alamat:   user.alamat ?? '',
        avatar:   null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), { forceFormData: true });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUncroppedSrc(URL.createObjectURL(file));
            setIsCropperOpen(true);
        }
    };

    const currentAvatar = avatarPreview ?? (user.avatar ? `/storage/${user.avatar}` : undefined);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informasi Profil" description="Perbarui data pribadi dan foto profil kamu" />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={currentAvatar} alt={user.name} />
                                    <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow hover:bg-primary/90"
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Foto Profil</p>
                                <p className="text-xs text-muted-foreground">JPG, PNG, maks 2MB</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                            <InputError message={errors.avatar} />
                        </div>

                        {/* Nama */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Nama lengkap"
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div>
                                <p className="mt-2 text-sm text-neutral-800">
                                    Email belum terverifikasi.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="rounded-md text-sm text-neutral-600 underline hover:text-neutral-900"
                                    >
                                        Kirim ulang email verifikasi.
                                    </Link>
                                </p>
                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        Link verifikasi telah dikirim ke email kamu.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* NIM & Prodi */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="nim">NIM</Label>
                                <Input
                                    id="nim"
                                    value={data.nim}
                                    onChange={(e) => setData('nim', e.target.value)}
                                    placeholder="Nomor Induk Mahasiswa"
                                    maxLength={20}
                                />
                                <InputError message={errors.nim} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="angkatan">Angkatan</Label>
                                <Input
                                    id="angkatan"
                                    value={data.angkatan}
                                    onChange={(e) => setData('angkatan', e.target.value)}
                                    placeholder="Contoh: 2022"
                                    maxLength={4}
                                />
                                <InputError message={errors.angkatan} />
                            </div>
                        </div>

                        {/* Prodi */}
                        <div className="grid gap-2">
                            <Label htmlFor="prodi">Program Studi</Label>
                            <Input
                                id="prodi"
                                value={data.prodi}
                                onChange={(e) => setData('prodi', e.target.value)}
                                placeholder="Program Studi"
                                maxLength={100}
                            />
                            <InputError message={errors.prodi} />
                        </div>

                        {/* Alamat */}
                        <div className="grid gap-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Textarea
                                id="alamat"
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                placeholder="Alamat lengkap"
                                rows={3}
                            />
                            <InputError message={errors.alamat} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Simpan</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Tersimpan</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />

                {isCropperOpen && (
                    <ImageCropper
                        isOpen={isCropperOpen}
                        onClose={() => {
                            setIsCropperOpen(false);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        imageSrc={uncroppedSrc}
                        onCropCompleteAction={(croppedFile) => {
                            setData('avatar', croppedFile);
                            setAvatarPreview(URL.createObjectURL(croppedFile));
                            setIsCropperOpen(false);
                        }}
                    />
                )}
            </SettingsLayout>
        </AppLayout>
    );
}
