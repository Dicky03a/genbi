import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Switch } from '@/components/ui/switch';

interface Beasiswa {
    id: number;
    title: string;
    description: string;
    procedures: string;
    requirements: string;
    required_files: string;
    flow: string;
    link: string | null;
    poster: string | null;
    is_published: boolean;
}

interface Props {
    beasiswa: Beasiswa;
}

export default function BeasiswaEdit({ beasiswa }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Beasiswas',
            href: '/dashboard/beasiswas',
        },
        {
            title: 'Edit',
            href: `/dashboard/beasiswas/${beasiswa.id}/edit`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: beasiswa.title,
        description: beasiswa.description,
        procedures: beasiswa.procedures,
        requirements: beasiswa.requirements,
        required_files: beasiswa.required_files,
        flow: beasiswa.flow,
        link: beasiswa.link || '',
        poster: null as File | null,
        is_published: beasiswa.is_published,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('beasiswas.update', beasiswa.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${beasiswa.title}`} />
            <div className="p-4 sm:p-6 lg:p-8">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Edit Scholarship Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Beasiswa Bank Indonesia 2026"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Brief Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Short summary of the scholarship..."
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="procedures">Procedures (Tata Cara)</Label>
                                    <Textarea
                                        id="procedures"
                                        value={data.procedures}
                                        onChange={(e) => setData('procedures', e.target.value)}
                                        rows={6}
                                        placeholder="Step by step registration process..."
                                    />
                                    <InputError message={errors.procedures} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="requirements">Requirements (Syarat)</Label>
                                    <Textarea
                                        id="requirements"
                                        value={data.requirements}
                                        onChange={(e) => setData('requirements', e.target.value)}
                                        rows={6}
                                        placeholder="Academic and administrative requirements..."
                                    />
                                    <InputError message={errors.requirements} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="required_files">Required Files (Berkas)</Label>
                                    <Textarea
                                        id="required_files"
                                        value={data.required_files}
                                        onChange={(e) => setData('required_files', e.target.value)}
                                        rows={6}
                                        placeholder="List of documents to prepare..."
                                    />
                                    <InputError message={errors.required_files} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="flow">Selection Flow (Alur)</Label>
                                    <Textarea
                                        id="flow"
                                        value={data.flow}
                                        onChange={(e) => setData('flow', e.target.value)}
                                        rows={6}
                                        placeholder="Stages of the selection process..."
                                    />
                                    <InputError message={errors.flow} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="link">Registration Link (GForm/External)</Label>
                                    <Input
                                        id="link"
                                        value={data.link}
                                        onChange={(e) => setData('link', e.target.value)}
                                        placeholder="https://forms.gle/..."
                                    />
                                    <InputError message={errors.link} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="poster">Poster Image (Leave empty to keep current)</Label>
                                    {beasiswa.poster && (
                                        <div className="mb-2">
                                            <img 
                                                src={`/storage/${beasiswa.poster}`} 
                                                alt="Current Poster" 
                                                className="w-32 h-44 object-cover rounded border"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        id="poster"
                                        type="file"
                                        onChange={(e) => setData('poster', e.target.files ? e.target.files[0] : null)}
                                        accept="image/*"
                                    />
                                    <InputError message={errors.poster} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch 
                                        id="is_published" 
                                        checked={data.is_published} 
                                        onCheckedChange={(checked) => setData('is_published', checked)}
                                    />
                                    <Label htmlFor="is_published">Published</Label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t pt-6">
                                <Button variant="outline" asChild>
                                    <Link href={route('beasiswas.index')}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Update Beasiswa
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
