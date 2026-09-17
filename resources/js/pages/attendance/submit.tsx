import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

type EventRole = { id: number; name: string; points: number };
type PointRate = { id: number; name: string; points: number };
type Event = { id: number; title: string; roles: EventRole[]; point_type: string };
type MyAttendance = {
    id: number;
    status: string;
    event_role: { name: string; points: number } | null;
    point_rate: { name: string; points: number } | null;
    created_at: string;
    photo_path: string;
};

export default function AttendanceSubmit({ event, myAttendance, pointRates }: { event: Event; myAttendance?: MyAttendance | null; pointRates?: PointRate[] | null }) {
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const { data, setData, errors, setError, clearErrors, reset } = useForm({
        event_role_id: '',
        point_rate_id: '',
        photo: null as File | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Acara', href: '/acara' },
        { title: 'Absensi Selfie', href: '#' },
    ];

    // Stop active camera stream
    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
        }
        setIsCameraActive(false);
    };

    // Clean up camera stream on unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [cameraStream]);

    // Attach stream to video element once camera is active
    useEffect(() => {
        if (isCameraActive && cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [isCameraActive, cameraStream]);

    // Start camera (prioritizing front camera for mobile, with fallback for laptop/desktop webcams)
    const startCamera = async () => {
        setCameraError('');
        setStatusMessage('');

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraError('Browser Anda tidak mendukung akses kamera langsung.');
            return;
        }

        stopCamera();

        try {
            // First attempt: try user/front-facing camera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });

            setCameraStream(stream);
            setIsCameraActive(true);
            setPhotoPreview(null);
            setData('photo', null);
        } catch (firstErr) {
            console.warn('Front camera constraint failed, trying default webcam for laptop/desktop:', firstErr);
            try {
                // Fallback attempt: general video device (for laptops/desktops where facingMode is not reported)
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                    audio: false,
                });

                setCameraStream(stream);
                setIsCameraActive(true);
                setPhotoPreview(null);
                setData('photo', null);
            } catch (err: unknown) {
                console.error('Camera access error:', err);
                setIsCameraActive(false);
                setCameraError(
                    'Kamera tidak dapat diakses atau izin ditolak. Pastikan izin kamera telah diizinkan pada browser Anda.'
                );
            }
        }
    };

    // Capture photo frame from video feed onto canvas
    const capturePhoto = () => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw image frame
        ctx.drawImage(video, 0, 0, width, height);

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    setCameraError('Gagal mengambil gambar dari kamera.');
                    return;
                }

                const file = new File([blob], `selfie_${Date.now()}.jpg`, { type: 'image/jpeg' });
                const previewUrl = URL.createObjectURL(blob);

                setPhotoPreview(previewUrl);
                setData('photo', file);
                setError('photo', '');
                stopCamera();
            },
            'image/jpeg',
            0.9
        );
    };

    // Retake photo: clear existing photo preview and restart camera
    const handleRetake = () => {
        if (photoPreview) {
            URL.revokeObjectURL(photoPreview);
        }
        setPhotoPreview(null);
        setData('photo', null);
        startCamera();
    };

    // Form submit
    const submit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        setStatusMessage('');
        clearErrors();

        if (event.point_type === 'role' && !data.event_role_id) {
            setError('event_role_id', 'Peran wajib dipilih.');
            return;
        }

        if (event.point_type === 'point_rate' && !data.point_rate_id) {
            setError('point_rate_id', 'Tarif Poin wajib dipilih.');
            return;
        }

        if (!data.photo) {
            setError('photo', 'Foto selfie wajib diambil terlebih dahulu.');
            return;
        }

        setIsSubmitting(true);

        // Retrieve CSRF token from meta tag or XSRF-TOKEN cookie
        const csrfMeta = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const xsrfCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];
        const csrfToken = csrfMeta || (xsrfCookie ? decodeURIComponent(xsrfCookie) : '');

        const payload = new FormData();
        if (event.point_type === 'role') {
            payload.append('event_role_id', data.event_role_id);
        } else if (event.point_type === 'point_rate') {
            payload.append('point_rate_id', data.point_rate_id);
        }
        payload.append('photo', data.photo);
        if (csrfToken) {
            payload.append('_token', csrfToken);
        }

        fetch(route('events.attendances.store', event.id), {
            method: 'POST',
            body: payload,
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-XSRF-TOKEN': csrfToken,
            },
        })
            .then(async (response) => {
                const result = await response.json();
                if (!response.ok) {
                    setStatusMessage(result.message ?? 'Absensi gagal dikirim.');
                    setIsSubmitting(false);
                    return;
                }
                reset();
                if (photoPreview) {
                    URL.revokeObjectURL(photoPreview);
                }
                setPhotoPreview(null);
                setStatusMessage('Absensi berhasil dikirim dan menunggu verifikasi.');
                setIsSubmitting(false);
            })
            .catch(() => {
                setStatusMessage('Terjadi kesalahan koneksi saat mengirim absensi.');
                setIsSubmitting(false);
            });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'disetujui':
                return <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-xs px-3 py-1 rounded-full">Absensi Disetujui</span>;
            case 'ditolak':
                return <span className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-semibold text-xs px-3 py-1 rounded-full">Absensi Ditolak</span>;
            case 'menunggu':
            default:
                return <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold text-xs px-3 py-1 rounded-full">Menunggu Verifikasi</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Absensi ${event.title}`} />
            <div className="p-6 max-w-2xl mx-auto">
                <Card className="shadow-sm border border-slate-200 bg-white">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                        <CardTitle className="text-xl font-bold text-slate-900">{event.title}</CardTitle>
                        <p className="text-xs text-slate-500 mt-1">Absensi Selfie Langsung (Kamera Depan Real-time)</p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {myAttendance ? (
                            <div className="space-y-6 text-center py-2">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        Anda Sudah Mengisi Absensi
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                        Absensi selfie Anda telah berhasil direkam ke dalam sistem dan tidak dapat diisi ulang.
                                    </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border space-y-3 text-left">
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-xs text-muted-foreground font-medium">Status Absensi</span>
                                        {getStatusBadge(myAttendance.status)}
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Klaim Poin</span>
                                        <span className="font-semibold text-black dark:text-white">
                                            {myAttendance.event_role ? `${myAttendance.event_role.name} (${myAttendance.event_role.points} poin)` : myAttendance.point_rate ? `${myAttendance.point_rate.name} (${myAttendance.point_rate.points} poin)` : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Waktu Absen</span>
                                        <span className="font-medium text-black dark:text-white">{myAttendance.created_at}</span>
                                    </div>
                                </div>

                                {myAttendance.photo_path && (
                                    <div className="space-y-2 text-left">
                                        <Label className="text-xs font-medium text-muted-foreground">Bukti Foto Selfie Tersimpan:</Label>
                                        <div className="overflow-hidden rounded-xl border h-48 w-full bg-slate-900">
                                            <img
                                                src={route('admin.attendances.photo', myAttendance.id)}
                                                alt="Bukti Selfie"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <a
                                        href="/acara"
                                        className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-800 transition"
                                    >
                                        Kembali ke Daftar Acara
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-6">
                            {/* Role / Point Rate Selector */}
                            {event.point_type === 'role' ? (
                                <div>
                                    <Label htmlFor="event_role_id" className="font-medium">
                                        Peran Kehadiran <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="event_role_id"
                                        className="border-input bg-background text-black mt-1.5 flex h-10 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={data.event_role_id}
                                        onChange={(e) => setData('event_role_id', e.target.value)}
                                    >
                                        <option value="" className="text-black">Pilih Peran</option>
                                        {event.roles.map((role) => (
                                            <option key={role.id} value={role.id} className="text-black">
                                                {role.name} ({role.points} poin)
                                            </option>
                                        ))}
                                    </select>
                                    {/* @ts-ignore */}
                                    <InputError message={errors.event_role_id} />
                                </div>
                            ) : (
                                <div>
                                    <Label htmlFor="point_rate_id" className="font-medium">
                                        Tarif Poin <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="point_rate_id"
                                        className="border-input bg-background text-black mt-1.5 flex h-10 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={data.point_rate_id}
                                        onChange={(e) => setData('point_rate_id', e.target.value)}
                                    >
                                        <option value="" className="text-black">Pilih Tarif Poin</option>
                                        {pointRates?.map((rate) => (
                                            <option key={rate.id} value={rate.id} className="text-black">
                                                {rate.name} ({rate.points} poin)
                                            </option>
                                        ))}
                                    </select>
                                    {/* @ts-ignore */}
                                    <InputError message={errors.point_rate_id} />
                                </div>
                            )}

                            {/* Camera / Selfie Capture Area */}
                            <div className="space-y-3">
                                <Label className="font-medium">
                                    Bukti Selfie (Kamera Depan) <span className="text-red-500">*</span>
                                </Label>

                                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 text-white min-h-[300px] flex items-center justify-center">
                                    {/* State 1: Initial state before camera started or photo taken */}
                                    {!isCameraActive && !photoPreview && (
                                        <div className="p-6 text-center space-y-4">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                                                <Camera className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-200">Kamera Depan Belum Aktif</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Klik tombol di bawah untuk membuka kamera depan langsung.
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={startCamera}
                                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                                            >
                                                <Camera className="h-4 w-4" />
                                                Ambil Bukti Selfie
                                            </Button>
                                        </div>
                                    )}

                                    {/* State 2: Camera active video preview */}
                                    {isCameraActive && (
                                        <div className="relative w-full h-full flex flex-col items-center">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-[320px] object-cover -scale-x-100 rounded-t-xl"
                                            />
                                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-xs px-2.5 py-1 rounded-full text-emerald-400 flex items-center gap-1.5">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Kamera Depan Live
                                            </div>
                                            <div className="p-3 w-full bg-slate-900/90 backdrop-blur flex justify-center">
                                                <Button
                                                    type="button"
                                                    onClick={capturePhoto}
                                                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6"
                                                >
                                                    <Camera className="h-4 w-4" />
                                                    Ambil Foto
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* State 3: Captured Photo preview */}
                                    {photoPreview && (
                                        <div className="relative w-full h-full flex flex-col items-center">
                                            <img
                                                src={photoPreview}
                                                alt="Selfie Attendance"
                                                className="w-full h-[320px] object-cover rounded-t-xl"
                                            />
                                            <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Foto Siap Dikirim
                                            </div>
                                            <div className="p-3 w-full bg-slate-900/90 backdrop-blur flex justify-center gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleRetake}
                                                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                    Ambil Ulang
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <InputError message={errors.photo} />
                            </div>

                            {/* Camera / Permission Error Message */}
                            {cameraError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Akses Kamera Gagal</p>
                                        <p className="mt-0.5 text-xs text-red-600">{cameraError}</p>
                                    </div>
                                </div>
                            )}

                            {/* Status Response Message */}
                            {statusMessage && (
                                <div
                                    className={`rounded-lg border p-4 text-sm flex items-start gap-3 ${
                                        statusMessage.includes('berhasil')
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                            : 'border-amber-200 bg-amber-50 text-amber-800'
                                    }`}
                                >
                                    {statusMessage.includes('berhasil') ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                    )}
                                    <p className="font-medium">{statusMessage}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting || !data.photo}
                                className="w-full bg-primary font-medium py-2.5"
                            >
                                {isSubmitting ? 'Mengirim Absensi...' : 'Kirim Absensi Selfie'}
                            </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
