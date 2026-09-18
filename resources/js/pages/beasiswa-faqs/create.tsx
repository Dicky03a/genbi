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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Beasiswa FAQs',
        href: '/dashboard/beasiswa-faqs',
    },
    {
        title: 'Create',
        href: '/dashboard/beasiswa-faqs/create',
    },
];

export default function BeasiswaFaqCreate() {
    const { data, setData, post, processing, errors } = useForm({
        question: '',
        answer: '',
        is_active: true as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('beasiswa-faqs.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Beasiswa FAQ" />
            <div className="p-4 sm:p-6 lg:p-8">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Add New FAQ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="question">Question</Label>
                                <Input
                                    id="question"
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    placeholder="e.g. Bagaimana cara mendaftar?"
                                />
                                <InputError message={errors.question} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="answer">Answer</Label>
                                <Textarea
                                    id="answer"
                                    value={data.answer}
                                    onChange={(e) => setData('answer', e.target.value)}
                                    rows={5}
                                    placeholder="Detail the answer here..."
                                />
                                <InputError message={errors.answer} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch 
                                    id="is_active" 
                                    checked={data.is_active} 
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active">Activate FAQ</Label>
                            </div>

                            <div className="flex justify-end gap-2 border-t pt-6">
                                <Button variant="outline" asChild>
                                    <Link href={route('beasiswa-faqs.index')}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Create FAQ
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
