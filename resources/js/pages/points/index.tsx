import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, CalendarClock } from 'lucide-react';

type Transaction = {
    id: number;
    points: number;
    source: string;
    note: string | null;
    created_at: string;
    point_category: { name: string };
    period: { name: string };
};

export default function PointsIndex({ transactions }: { transactions: Transaction[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Riwayat poin', href: '/poin' } as BreadcrumbItem]}>
            <Head title="Riwayat poin" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold">Riwayat poin</h1>
                    <Button asChild variant="outline">
                        <Link href="/poin/rekap">
                            <Trophy className="mr-2 h-4 w-4 text-yellow-600" />
                            Lihat Rekap Peringkat
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi efektif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y relative">
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-start justify-between gap-4 py-4">
                                    <div className="space-y-1.5 flex-1">
                                        <p className="font-medium text-base">{transaction.point_category.name}</p>
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <CalendarClock className="w-3.5 h-3.5" />
                                                {transaction.created_at}
                                            </span>
                                            <span>•</span>
                                            <span>{transaction.period.name}</span>
                                            <span>•</span>
                                            <Badge variant="secondary" className="capitalize font-normal px-2 py-0">
                                                {transaction.source}
                                            </Badge>
                                        </div>
                                        {transaction.note && (
                                            <p className="text-sm text-muted-foreground bg-muted/40 p-2.5 rounded-md mt-2 border border-border/50">
                                                {transaction.note}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end whitespace-nowrap">
                                        <span className={`text-lg ${transaction.points >= 0 ? 'font-semibold text-green-600 dark:text-green-500' : 'font-semibold text-red-600 dark:text-red-500'}`}>
                                            {transaction.points > 0 ? '+' : ''}
                                            {transaction.points}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-1">Poin</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {transactions.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Trophy className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-medium">Belum ada transaksi poin</h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                    Poin akan bertambah saat Anda menghadiri acara (absensi) atau ketika pengajuan poin Anda disetujui.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
