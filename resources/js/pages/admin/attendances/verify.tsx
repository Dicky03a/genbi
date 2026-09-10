import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

type Attendance = { id: number; photo_path: string; distance_m: number; gps_accuracy_m: number; user: { name: string; nim: string | null }; event: { title: string }; event_role: { name: string; points: number } | null };

export default function AttendanceVerify({ attendances }: { attendances: Attendance[] }) {
    const verify = (id: number) => router.patch(route('admin.attendances.verify', id));
    const reject = (id: number) => { const reason = window.prompt('Alasan penolakan'); if (reason) router.patch(route('admin.attendances.reject', id), { reason }); };

    return <AppLayout breadcrumbs={[{ title: 'Verifikasi absensi', href: '/admin/absensi' } as BreadcrumbItem]}><Head title="Verifikasi absensi" /><div className="space-y-6 p-6"><div><h1 className="text-2xl font-semibold">Verifikasi absensi</h1><p className="text-sm text-muted-foreground">Tinjau foto, jarak, dan akurasi GPS sebelum menyetujui.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{attendances.map((attendance) => <Card key={attendance.id}><CardHeader><CardTitle>{attendance.user.name}</CardTitle><p className="text-sm text-muted-foreground">{attendance.event.title}</p></CardHeader><CardContent className="space-y-3"><div className="rounded border p-3 text-sm"><p>Peran: {attendance.event_role?.name ?? '-'}</p><p>Jarak: {attendance.distance_m} m</p><p>Akurasi GPS: {attendance.gps_accuracy_m} m</p></div><div className="flex gap-2"><Button size="sm" onClick={() => verify(attendance.id)}>Setujui</Button><Button size="sm" variant="outline" onClick={() => reject(attendance.id)}>Tolak</Button></div></CardContent></Card>)}</div></div></AppLayout>;
}