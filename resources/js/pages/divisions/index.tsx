import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Trash2, Edit2, Plus, Eye, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Divisions',
        href: '/dashboard/divisions',
    },
];

interface Division {
    id: number;
    name: string;
    foto: string | null;
    keterangan: string | null;
    users_count: number;
}

interface Props {
    divisions: Division[];
}

export default function DivisionIndex({ divisions }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this division?')) {
            destroy(route('divisions.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Divisions" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Divisions</h2>
                        <p className="text-muted-foreground">Manage organizational divisions and their members.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('divisions.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Add Division
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {divisions.map((division) => (
                        <Card key={division.id} className="overflow-hidden">
                            <div className="aspect-video bg-muted relative">
                                {division.foto ? (
                                    <img 
                                        src={`/storage/${division.foto}`} 
                                        alt={division.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between">
                                    <span>{division.name}</span>
                                    <div className="flex items-center text-sm font-normal text-muted-foreground">
                                        <Users className="mr-1 h-4 w-4" /> {division.users_count} Members
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {division.keterangan || 'No description available.'}
                                </p>
                                <div className="flex justify-end gap-2 border-t pt-4">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={route('divisions.show', division.id)}>
                                            <Eye className="mr-2 h-4 w-4" /> View
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={route('divisions.edit', division.id)}>
                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        </Link>
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-destructive"
                                        onClick={() => handleDelete(division.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {divisions.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No divisions found. Create your first one!</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
