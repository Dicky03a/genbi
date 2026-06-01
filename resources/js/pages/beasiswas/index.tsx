import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Trash2, Edit2, Plus, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Beasiswas',
        href: '/dashboard/beasiswas',
    },
];

interface Beasiswa {
    id: number;
    title: string;
    is_published: boolean;
    created_at: string;
}

interface Props {
    beasiswas: Beasiswa[];
}

export default function BeasiswaIndex({ beasiswas }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this scholarship information?')) {
            destroy(route('beasiswas.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Beasiswas" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Info Beasiswa</h2>
                        <p className="text-muted-foreground">Manage Bank Indonesia scholarship information.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('beasiswas.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Add Beasiswa
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {beasiswas.map((beasiswa) => (
                        <Card key={beasiswa.id}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{beasiswa.title}</h3>
                                        {beasiswa.is_published ? (
                                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                                <CheckCircle className="mr-1 h-3 w-3" /> Published
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                <XCircle className="mr-1 h-3 w-3" /> Draft
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Created on {new Date(beasiswa.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={route('beasiswas.show', beasiswa.id)}>
                                            <Eye className="mr-2 h-4 w-4" /> View
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={route('beasiswas.edit', beasiswa.id)}>
                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        </Link>
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-destructive"
                                        onClick={() => handleDelete(beasiswa.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {beasiswas.length === 0 && (
                        <div className="py-12 text-center border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No scholarship information found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
