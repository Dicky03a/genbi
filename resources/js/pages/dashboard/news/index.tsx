import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Trash2, Edit2, Plus, ExternalLink } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'News',
        href: '/dashboard/news',
    },
];

interface News {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    category: { name: string };
    author: { name: string };
    published_at: string;
}

interface Props {
    news: News[];
}

export default function NewsIndex({ news }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this news article?')) {
            destroy(route('news.destroy', id));
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-500">Published</Badge>;
            case 'draft':
                return <Badge variant="outline">Draft</Badge>;
            case 'archived':
                return <Badge variant="secondary">Archived</Badge>;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="News Management" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">News Articles</h1>
                        <p className="text-muted-foreground">Manage your professional news content here.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('news.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Create News
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Article</th>
                                        <th className="px-6 py-3 font-medium">Category</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">Author</th>
                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {news.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-base line-clamp-1">{item.title}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-1">{item.slug}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary">{item.category.name}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {statusBadge(item.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.author.name}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('news.edit', item.id)}>
                                                            <Edit2 className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {news.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                                                No news articles found. Start by creating one!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
