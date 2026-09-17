import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

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
                            <Trophy className="mr-2 h-4 w-4" />
                            Lihat Rekap Peringkat
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi efektif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between gap-4 py-4">
                                    <div>
                                        <p className="font-medium">{transaction.point_category.name}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {transaction.period.name} · {transaction.source} · {transaction.created_at}
                                        </p>
                                    </div>
                                    <span className={transaction.points >= 0 ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
                                        {transaction.points > 0 ? '+' : ''}
                                        {transaction.points}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {transactions.length === 0 && <p className="text-muted-foreground py-6 text-center text-sm">Belum ada transaksi efektif.</p>}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
