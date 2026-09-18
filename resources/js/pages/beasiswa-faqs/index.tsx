import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Trash2, Edit2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Beasiswa FAQs',
        href: '/dashboard/beasiswa-faqs',
    },
];

interface Faq {
    id: number;
    question: string;
    answer: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    faqs: Faq[];
}

export default function BeasiswaFaqIndex({ faqs }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this FAQ?')) {
            destroy(route('beasiswa-faqs.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Beasiswa FAQs" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Beasiswa FAQs</h2>
                        <p className="text-muted-foreground">Manage frequently asked questions for scholarships.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('beasiswa-faqs.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Add FAQ
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {faqs.map((faq) => (
                        <Card key={faq.id}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{faq.question}</h3>
                                        {faq.is_active ? (
                                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                                <CheckCircle className="mr-1 h-3 w-3" /> Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                <XCircle className="mr-1 h-3 w-3" /> Inactive
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate max-w-2xl">
                                        {faq.answer.length > 100 ? `${faq.answer.substring(0, 100)}...` : faq.answer}
                                    </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={route('beasiswa-faqs.edit', faq.id)}>
                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        </Link>
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-destructive"
                                        onClick={() => handleDelete(faq.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {faqs.length === 0 && (
                        <div className="py-12 text-center border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No FAQs found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
