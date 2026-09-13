import { Head, Link } from '@inertiajs/react';
import { BookOpen, GraduationCap, Layers, Newspaper, Plus, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface Stats {
    users: number;
    news: number;
    published: number;
    divisions: number;
    beasiswas: number;
    pending_attendances: number;
    pending_submissions: number;
}

interface RecentNews {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    category: string | null;
    author: string | null;
    published_at: string | null;
    created_at: string;
}

interface Props {
    stats: Stats;
    recentNews: RecentNews[];
}

const statusBadge = (status: string) => {
    switch (status) {
        case 'published':
            return <Badge className="bg-green-500 hover:bg-green-600">Terbit</Badge>;
        case 'draft':
            return <Badge variant="outline">Draft</Badge>;
        case 'archived':
            return <Badge variant="secondary">Arsip</Badge>;
        default:
            return null;
    }
};

const statCards = (stats: Stats) => [
    {
        title: 'Total Anggota',
        value: stats.users,
        icon: Users,
        href: '/dashboard/users',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        title: 'Total Berita',
        value: stats.news,
        icon: Newspaper,
        href: '/dashboard/news',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        sub: `${stats.published} terbit`,
    },
    {
        title: 'Divisi',
        value: stats.divisions,
        icon: Layers,
        href: '/dashboard/divisions',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    {
        title: 'Info Beasiswa',
        value: stats.beasiswas,
        icon: GraduationCap,
        href: '/dashboard/beasiswas',
        color: 'text-green-600',
        bg: 'bg-green-50',
    },
];

const quickActions = [
    { label: 'Tambah Berita', href: '/dashboard/news/create', icon: Newspaper },
    { label: 'Tambah Divisi', href: '/dashboard/divisions/create', icon: Layers },
    { label: 'Tambah User', href: '/dashboard/users/create', icon: Users },
    { label: 'Info Beasiswa', href: '/dashboard/beasiswas/create', icon: BookOpen },
];

export default function Dashboard({ stats, recentNews }: Props) {
    const cards = statCards(stats);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
                    <p className="text-muted-foreground">Selamat datang, kelola konten GenBI dari sini.</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link key={card.title} href={card.href}>
                                <Card className="transition-shadow hover:shadow-md">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-muted-foreground text-sm">{card.title}</p>
                                                <p className="mt-1 text-3xl font-bold">{card.value}</p>
                                                {card.sub && <p className="text-muted-foreground mt-0.5 text-xs">{card.sub}</p>}
                                            </div>
                                            <div className={`rounded-lg p-2 ${card.bg}`}>
                                                <Icon className={`h-5 w-5 ${card.color}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Link href="/admin/absensi">
                        <Card>
                            <CardContent className="p-5">
                                <p className="text-muted-foreground text-sm">Antrean absensi</p>
                                <p className="text-3xl font-bold">{stats.pending_attendances}</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/admin/pengajuan">
                        <Card>
                            <CardContent className="p-5">
                                <p className="text-muted-foreground text-sm">Antrean pengajuan</p>
                                <p className="text-3xl font-bold">{stats.pending_submissions}</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent news table */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-base">Berita Terbaru</CardTitle>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/dashboard/news">Lihat Semua</Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                {recentNews.length === 0 ? (
                                    <p className="text-muted-foreground px-6 py-8 text-center text-sm">Belum ada berita.</p>
                                ) : (
                                    <div className="divide-y">
                                        {recentNews.map((item) => (
                                            <div
                                                key={item.id}
                                                className="hover:bg-muted/30 flex items-start justify-between gap-3 px-6 py-3 transition-colors"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">{item.title}</p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {item.category ?? '—'} &middot; {item.author ?? '—'} &middot;{' '}
                                                        {item.published_at ?? item.created_at}
                                                    </p>
                                                </div>
                                                <div className="shrink-0">{statusBadge(item.status)}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick actions */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Aksi Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Button key={action.label} asChild variant="outline" className="w-full justify-start">
                                        <Link href={action.href}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            <Icon className="mr-2 h-4 w-4" />
                                            {action.label}
                                        </Link>
                                    </Button>
                                );
                            })}

                            <div className="pt-2">
                                <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">Kelola</p>
                                {[
                                    { label: 'Manajemen User', href: '/dashboard/users' },
                                    { label: 'Divisi', href: '/dashboard/divisions' },
                                    { label: 'Kategori Berita', href: '/dashboard/categories' },
                                    { label: 'Tentang Kami', href: '/dashboard/abouts' },
                                ].map((link) => (
                                    <Button key={link.label} asChild variant="ghost" size="sm" className="text-muted-foreground w-full justify-start">
                                        <Link href={link.href}>{link.label}</Link>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
