import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Period = { id: number; name: string };
type FilterItem = { id: number; name: string };
type Ranking = {
    rank: number;
    total_points: number;
    user: { name: string; nim: string | null; komisariat: { name: string } | null; division: { name: string } | null };
};

export default function RecapIndex({
    periods,
    komisariats,
    divisions,
    selectedPeriod,
    ranking,
}: {
    periods: Period[];
    komisariats: FilterItem[];
    divisions: FilterItem[];
    selectedPeriod: Period | null;
    ranking: Ranking[];
}) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Rekap poin', href: '/admin/rekap' } as BreadcrumbItem]}>
            <Head title="Rekap poin" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Rekap poin</h1>
                        <p className="text-muted-foreground text-sm">{selectedPeriod?.name ?? 'Belum ada periode aktif'}</p>
                    </div>
                    {selectedPeriod && (
                        <Button asChild variant="outline">
                            <Link href={route('admin.recap.export', { period_id: selectedPeriod.id })}>Ekspor CSV</Link>
                        </Button>
                    )}
                </div>
                <Card>
                    <CardContent className="grid gap-3 p-4 md:grid-cols-3">
                        <select
                            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                            defaultValue={selectedPeriod?.id ?? ''}
                            onChange={(e) => (window.location.href = `${route('admin.recap.index')}?period_id=${e.target.value}`)}
                        >
                            <option value="">Pilih periode</option>
                            {periods.map((period) => (
                                <option key={period.id} value={period.id}>
                                    {period.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                            defaultValue=""
                            onChange={(e) =>
                                (window.location.href = `${route('admin.recap.index')}?period_id=${selectedPeriod?.id ?? ''}&division_id=${e.target.value}`)
                            }
                        >
                            <option value="">Semua divisi</option>
                            {divisions.map((division) => (
                                <option key={division.id} value={division.id}>
                                    {division.name}
                                </option>
                            ))}
                        </select>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Peringkat anggota</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {ranking.map((row) => (
                                <div key={row.user.name} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 py-3">
                                    <span className="font-semibold">#{row.rank}</span>
                                    <div>
                                        <p className="font-medium">{row.user.name}</p>
                                        <p className="text-muted-foreground text-xs">
                                            {row.user.nim ?? '-'} · {row.user.komisariat?.name ?? '-'} · {row.user.division?.name ?? '-'}
                                        </p>
                                    </div>
                                    <span className="font-semibold">{row.total_points} poin</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
