import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface TemplateFile {
    id: number;
    name: string;
    file_path: string;
}

interface Props {
    templateFile: TemplateFile;
}

export default function TemplateFileEdit({ templateFile }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Template Files',
            href: '/dashboard/template-files',
        },
        {
            title: 'Edit',
            href: `/dashboard/template-files/${templateFile.id}/edit`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: templateFile.name,
        file: null as File | null,
        _method: 'PUT', // Inertia needs _method: 'PUT' when dealing with file uploads for update
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('template-files.update', templateFile.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Template File" />
            
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Template File</h2>
                    <p className="text-muted-foreground">Modify the document template.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>File Details</CardTitle>
                        <CardDescription>Enter the name and upload a new file if you want to replace the old one.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">File Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file">Replace Document File</Label>
                                <div className="space-y-1">
                                    <p className="text-sm">Current File: <a href={`/storage/${templateFile.file_path}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{templateFile.file_path.split('/').pop()}</a></p>
                                    <Input
                                        id="file"
                                        type="file"
                                        onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    />
                                    <p className="text-xs text-muted-foreground">Leave blank to keep current file. Max file size: 10MB.</p>
                                </div>
                                {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                            </div>

                            <div className="flex gap-4 items-center">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Template
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={route('template-files.index')}>
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
