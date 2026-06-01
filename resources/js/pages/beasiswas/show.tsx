import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { ExternalLink, Calendar, FileText, Info, ClipboardList, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    created_at: string;
}

interface Props {
    beasiswa: Beasiswa;
}

export default function BeasiswaShow({ beasiswa }: Props) {
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
            title: beasiswa.title,
            href: `/dashboard/beasiswas/${beasiswa.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={beasiswa.title} />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold tracking-tight">{beasiswa.title}</h2>
                        <Badge variant={beasiswa.is_published ? "default" : "secondary"}>
                            {beasiswa.is_published ? "Published" : "Draft"}
                        </Badge>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={route('beasiswas.edit', beasiswa.id)}>Edit Information</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Info className="mr-2 h-5 w-5 text-blue-500" />
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{beasiswa.description}</p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <ClipboardList className="mr-2 h-5 w-5 text-orange-500" />
                                        Tata Cara (Procedures)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-wrap">{beasiswa.procedures}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <FileText className="mr-2 h-5 w-5 text-green-500" />
                                        Persyaratan (Requirements)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-wrap">{beasiswa.requirements}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                                        Berkas yang Dibutuhkan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-wrap">{beasiswa.required_files}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Activity className="mr-2 h-5 w-5 text-red-500" />
                                        Alur Seleksi (Flow)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-wrap">{beasiswa.flow}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Poster</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border">
                                    {beasiswa.poster ? (
                                        <img 
                                            src={`/storage/${beasiswa.poster}`} 
                                            alt="Poster" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            No Poster Uploaded
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {beasiswa.link && (
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Registration Link</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild className="w-full">
                                        <a href={beasiswa.link} target="_blank" rel="noopener noreferrer">
                                            Open External Link <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
