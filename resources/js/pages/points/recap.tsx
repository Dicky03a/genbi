import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Trophy } from 'lucide-react';

type UserData = {
    id: number;
    name: string;
    avatar: string | null;
    division: { name: string } | null;
    komisariat: { name: string } | null;
};

type LeaderboardRow = {
    rank: number;
    user: UserData;
    total_points: number;
};

export default function PointsRecap({
    period,
    leaderboard,
}: {
    period: { name: string } | null;
    leaderboard: LeaderboardRow[];
}) {
    const getInitials = useInitials();
    return (
        <AppLayout breadcrumbs={[{ title: 'Riwayat poin', href: '/poin' } as BreadcrumbItem, { title: 'Rekap Poin Tertinggi', href: '/poin/rekap' } as BreadcrumbItem]}>
            <Head title="Rekap Poin Tertinggi" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Rekap Poin Tertinggi</h1>
                        <p className="text-muted-foreground text-sm">Peringkat poin periode {period?.name ?? 'aktif'}</p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/poin">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Riwayat
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            Peringkat Keseluruhan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {leaderboard.length > 0 ? (
                            <div className="divide-y">
                                {leaderboard.map((row) => (
                                    <div key={row.user.id} className="flex items-center justify-between gap-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center font-bold text-muted-foreground sm:w-10">
                                                {row.rank <= 3 ? (
                                                    <span className={`text-lg ${row.rank === 1 ? 'text-amber-500' : row.rank === 2 ? 'text-slate-400' : 'text-amber-700'}`}>
                                                        #{row.rank}
                                                    </span>
                                                ) : (
                                                    `#${row.rank}`
                                                )}
                                            </div>
                                            <Avatar className="h-10 w-10 shrink-0 border">
                                                <AvatarImage src={row.user.avatar ? `/storage/${row.user.avatar}` : undefined} alt={row.user.name} />
                                                <AvatarFallback>{getInitials(row.user.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium">{row.user.name}</p>
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    <span className="text-muted-foreground text-xs">{row.user.komisariat?.name || '-'}</span>
                                                    {(row.user.komisariat?.name || row.user.division?.name) && <span className="text-muted-foreground text-xs">•</span>}
                                                    <span className="text-muted-foreground text-xs">{row.user.division?.name || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="font-semibold text-lg">{row.total_points}</span>
                                            <span className="text-muted-foreground ml-1 text-xs sm:ml-2">poin</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground py-6 text-center text-sm">Belum ada data rekap untuk periode ini.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
