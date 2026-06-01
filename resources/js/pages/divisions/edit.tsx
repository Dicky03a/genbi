import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';

interface Division {
    id: number;
    name: string;
    foto: string | null;
    keterangan: string | null;
}

interface Props {
    division: Division;
}

export default function DivisionEdit({ division }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Divisions',
            href: '/dashboard/divisions',
        },
        {
            title: 'Edit',
            href: `/dashboard/divisions/${division.id}/edit`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: division.name,
        foto: null as File | null,
        keterangan: division.keterangan || '',
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use post with _method: 'PUT' for multipart form data (Laravel requirement for file updates)
        post(route('divisions.update', division.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${division.name}`} />
            <div className="p-4 sm:p-6 lg:p-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Edit Division: {division.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Division Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. KOMINFO"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foto">Foto (Leave empty to keep current)</Label>
                                {division.foto && (
                                    <div className="mb-2">
                                        <img 
                                            src={`/storage/${division.foto}`} 
                                            alt={division.name} 
                                            className="w-32 h-20 object-cover rounded border"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="foto"
                                    type="file"
                                    onChange={(e) => setData('foto', e.target.files ? e.target.files[0] : null)}
                                    accept="image/*"
                                />
                                <InputError message={errors.foto} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan</Label>
                                <Textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    placeholder="Brief description of the division..."
                                    rows={4}
                                />
                                <InputError message={errors.keterangan} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={route('divisions.index')}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Update Division
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
