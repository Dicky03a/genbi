import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

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
        title: 'Create',
        href: '/dashboard/template-files/create',
    },
];

export default function TemplateFileCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        file: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('template-files.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Template File" />
            
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Add Template File</h2>
                    <p className="text-muted-foreground">Upload a new document template.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>File Details</CardTitle>
                        <CardDescription>Enter the name and upload the file.</CardDescription>
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
                                    placeholder="e.g. Surat Keterangan Aktif"
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file">Document File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Max file size: 10MB.</p>
                                {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                            </div>

                            <div className="flex gap-4 items-center">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Template
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
