import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Trash2, Edit2, Plus, Download, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Template Files',
        href: '/dashboard/template-files',
    },
];

interface TemplateFile {
    id: number;
    name: string;
    file_path: string;
    created_at: string;
}

interface Props {
    templateFiles: TemplateFile[];
}

export default function TemplateFileIndex({ templateFiles }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this template file?')) {
            destroy(route('template-files.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Template Files" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Template Files</h2>
                        <p className="text-muted-foreground">Manage downloadable template files for visitors.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('template-files.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Add Template
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {templateFiles.map((file) => (
                        <Card key={file.id}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <h3 className="font-semibold text-lg">{file.name}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Uploaded on {new Date(file.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <a href={`/storage/${file.file_path}`} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </a>
                                    </Button>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={route('template-files.edit', file.id)}>
                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        </Link>
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-destructive"
                                        onClick={() => handleDelete(file.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {templateFiles.length === 0 && (
                        <div className="py-12 text-center border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No template files found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
