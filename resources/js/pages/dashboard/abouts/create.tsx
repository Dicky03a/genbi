import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { RichTextEditor } from '@/components/rich-text-editor';
import InputError from '@/components/input-error';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'About',
        href: '/dashboard/abouts',
    },
    {
        title: 'Create',
        href: '/dashboard/abouts/create',
    },
];

export default function AboutCreate() {
    const { data, setData, post, processing, errors } = useForm({
        tagline: '',
        vision: '',
        mission: [''],
        profile: '',
    });

    const addMissionPoint = () => {
        setData('mission', [...data.mission, '']);
    };

    const removeMissionPoint = (index: number) => {
        const newMission = [...data.mission];
        newMission.splice(index, 1);
        setData('mission', newMission);
    };

    const handleMissionChange = (index: number, value: string) => {
        const newMission = [...data.mission];
        newMission[index] = value;
        setData('mission', newMission);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('abouts.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create About Profile" />
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('abouts.index')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Create About Profile</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tagline">Tagline</Label>
                                <Input
                                    id="tagline"
                                    value={data.tagline}
                                    onChange={(e) => setData('tagline', e.target.value)}
                                    placeholder="Enter company tagline"
                                />
                                <InputError message={errors.tagline} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="vision">Vision</Label>
                                    <Textarea
                                        id="vision"
                                        value={data.vision}
                                        onChange={(e) => setData('vision', e.target.value)}
                                        placeholder="Our vision..."
                                        rows={4}
                                    />
                                    <InputError message={errors.vision} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Mission Points</Label>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={addMissionPoint}
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Add Point
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {data.mission.map((point, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={point}
                                                    onChange={(e) => handleMissionChange(index, e.target.value)}
                                                    placeholder={`Point ${index + 1}`}
                                                />
                                                {data.mission.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive shrink-0"
                                                        onClick={() => removeMissionPoint(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.mission} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Detailed Profile</Label>
                                <RichTextEditor
                                    value={data.profile}
                                    onChange={(val) => setData('profile', val)}
                                />
                                <InputError message={errors.profile} />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" disabled={processing} className="w-full">
                                    Save Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
