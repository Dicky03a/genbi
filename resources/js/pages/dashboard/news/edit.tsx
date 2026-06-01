import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { RichTextEditor } from '@/components/rich-text-editor';
import InputError from '@/components/input-error';
import { ArrowLeft, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'News',
        href: '/dashboard/news',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface Category {
    id: number;
    name: string;
}

interface News {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    category_id: number;
    status: 'draft' | 'published' | 'archived';
    image_path: string | null;
}

interface Props {
    news: News;
    categories: Category[];
}

export default function NewsEdit({ news, categories }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: news.title,
        excerpt: news.excerpt || '',
        content: news.content,
        category_id: news.category_id.toString(),
        status: news.status,
        image: null as File | null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setData('image', null);
            setImagePreview(null);
        }
    };

    const removeNewImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use POST with _method: 'PUT' for multipart/form-data support in Laravel
        post(route('news.update', news.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Article: ${news.title}`} />
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('news.index')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Article</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Article Content</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter a compelling title"
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) => setData('excerpt', e.target.value)}
                                            placeholder="Briefly describe what this article is about..."
                                            rows={3}
                                        />
                                        <InputError message={errors.excerpt} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Content</Label>
                                        <RichTextEditor
                                            value={data.content}
                                            onChange={(val) => setData('content', val)}
                                        />
                                        <InputError message={errors.content} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            onValueChange={(val) => setData('category_id', val)}
                                            value={data.category_id}
                                        >
                                            <SelectTrigger id="category">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            onValueChange={(val: any) => setData('status', val)}
                                            value={data.status}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image">Featured Image</Label>
                                        
                                        {/* Display either new preview or existing image */}
                                        {imagePreview ? (
                                            <div className="relative group aspect-video overflow-hidden rounded-md border bg-muted">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="New Preview" 
                                                    className="w-full h-full object-cover" 
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeNewImage}
                                                    className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-background rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : news.image_path ? (
                                            <div className="aspect-video overflow-hidden rounded-md border bg-muted">
                                                <img 
                                                    src={`/storage/${news.image_path}`} 
                                                    alt="Current" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                        ) : null}

                                        <Input
                                            id="image"
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className={imagePreview ? 'hidden' : 'mt-2'}
                                        />
                                        
                                        {!imagePreview && (
                                            <p className="text-[0.8rem] text-muted-foreground">
                                                {news.image_path ? 'Leave blank to keep current image.' : 'Recommended size: 1200x630px. Max: 2MB.'}
                                            </p>
                                        )}
                                        <InputError message={errors.image} />
                                    </div>

                                    <div className="pt-4">
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            Update Article
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
