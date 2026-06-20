import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, GraduationCap, Home, KeyRound, MapPin, Pencil, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
];

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
    return (
        <div className="flex items-start gap-3 border-b py-3 last:border-0">
            <div className="mt-0.5 text-muted-foreground">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`truncate text-sm font-medium ${!value ? 'italic text-muted-foreground' : ''}`}>
                    {value || 'Belum diisi'}
                </p>
            </div>
        </div>
    );
}

export default function Dashboard() {
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
                            <AvatarImage
                                src={user.avatar ? `/storage/${user.avatar}` : undefined}
                                alt={user.name}
                            />
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
                                <span className="text-sm text-muted-foreground">{filledCount} / {profileFields.length} field</span>
                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${completionPct}%` }}
                                />
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
