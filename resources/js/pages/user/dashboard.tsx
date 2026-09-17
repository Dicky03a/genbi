import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, GraduationCap, Home, KeyRound, MapPin, Pencil, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/user/dashboard' }];

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
}

interface DashboardProps {
    recap?: {
        period: { name: string };
        total_points: number;
        progress: { percentage: number; target_points: number; achieved: boolean };
    } | null;
    openEvents?: { id: number; slug: string; title: string; starts_at: string; komisariat: { name: string } | null; my_attendance_status?: string | null }[];
}

function InfoRow({ icon, label, value }: InfoRowProps) {
    return (
        <div className="flex items-start gap-3 border-b py-3 last:border-0">
            <div className="text-muted-foreground mt-0.5">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs">{label}</p>
                <p className={`truncate text-sm font-medium ${!value ? 'text-muted-foreground italic' : ''}`}>{value || 'Belum diisi'}</p>
            </div>
        </div>
    );
}

export default function Dashboard({ recap, openEvents = [] }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const getInitials = useInitials();

    const profileFields = [user.avatar, user.nim, user.prodi, user.angkatan, user.alamat];
    const filledCount = profileFields.filter(Boolean).length;
    const completionPct = Math.round((filledCount / profileFields.length) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Welcome card */}
                <Card>
                    <CardContent className="flex flex-col items-center gap-5 pt-6 sm:flex-row sm:items-start">
                        <Avatar className="h-20 w-20 shrink-0">
                            <AvatarImage src={user.avatar ? `/storage/${user.avatar}` : undefined} alt={user.name} />
                            <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                                {user.division && <Badge variant="secondary">{user.division.name}</Badge>}
                                {user.angkatan && <Badge variant="outline">Angkatan {user.angkatan}</Badge>}
                            </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                            <Button asChild size="sm">
                                <Link href="/settings/profile">
                                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                    Edit Profil
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/settings/password">
                                    <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                                    Ganti Password
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {recap && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Progress poin {recap.period.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-bold">{recap.total_points}</span>
                                <span className="text-muted-foreground text-sm">/ {recap.progress.target_points} poin</span>
                            </div>
                            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${recap.progress.percentage}%` }} />
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {recap.progress.achieved ? 'Target periode tercapai.' : `${recap.progress.percentage}% dari target periode.`}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {openEvents.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Acara yang sedang dibuka</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {openEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/acara/${event.slug}`}
                                    className="hover:bg-muted/30 flex items-center justify-between rounded border p-3 text-sm transition"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{event.title}</span>
                                        <span className="text-xs text-muted-foreground">• {event.komisariat?.name ?? 'Semua komisariat'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {event.my_attendance_status === 'disetujui' && (
                                            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-medium">Disetujui</span>
                                        )}
                                        {event.my_attendance_status === 'ditolak' && (
                                            <span className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-xs px-2.5 py-0.5 rounded-full font-medium">Ditolak</span>
                                        )}
                                        {event.my_attendance_status === 'menunggu' && (
                                            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-medium">Menunggu Verifikasi</span>
                                        )}
                                        {!event.my_attendance_status && (
                                            <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-full">Belum Absen</span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Profile detail */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Pribadi</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-2">
                                <InfoRow icon={<User className="h-4 w-4" />} label="NIM" value={user.nim} />
                                <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Program Studi" value={user.prodi} />
                                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Angkatan" value={user.angkatan} />
                                <InfoRow icon={<Home className="h-4 w-4" />} label="Divisi" value={user.division?.name} />
                                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Alamat" value={user.alamat} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Completion sidebar */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kelengkapan Profil</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-bold">{completionPct}%</span>
                                <span className="text-muted-foreground text-sm">
                                    {filledCount} / {profileFields.length} field
                                </span>
                            </div>

                            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${completionPct}%` }} />
                            </div>

                            <ul className="space-y-1.5 text-sm">
                                {[
                                    { label: 'Foto profil', value: user.avatar },
                                    { label: 'NIM', value: user.nim },
                                    { label: 'Program Studi', value: user.prodi },
                                    { label: 'Angkatan', value: user.angkatan },
                                    { label: 'Alamat', value: user.alamat },
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${value ? 'bg-green-500' : 'bg-muted-foreground/40'}`} />
                                        <span className={value ? '' : 'text-muted-foreground'}>{label}</span>
                                    </li>
                                ))}
                            </ul>

                            {completionPct < 100 && (
                                <Button asChild className="w-full" size="sm">
                                    <Link href="/settings/profile">Lengkapi Profil</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
