<?php

namespace App\Services;

use App\Models\News;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NewsService
{
    /**
     * Get all news with relations.
     */
    public function getAll()
    {
        return News::with(['category', 'author'])->latest()->get();
    }

    /**
     * Create new news.
     */
    public function create(array $data): News
    {
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
        
        if (isset($data['image'])) {
            $data['image_path'] = $data['image']->store('news', 'public');
        }

        if ($data['status'] === 'published') {
            $data['published_at'] = now();
        }

        return News::create($data);
    }

    /**
     * Update existing news.
     */
    public function update(News $news, array $data): News
    {
        if (isset($data['title']) && $data['title'] !== $news->title) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
        }

        if (isset($data['image'])) {
            if ($news->image_path) {
                Storage::disk('public')->delete($news->image_path);
            }
            $data['image_path'] = $data['image']->store('news', 'public');
        }

        if (isset($data['status'])) {
            if ($data['status'] === 'published' && !$news->published_at) {
                $data['published_at'] = now();
            } elseif ($data['status'] === 'draft') {
                $data['published_at'] = null;
            }
        }

        $news->update($data);
        return $news;
    }

    /**
     * Delete news.
     */
    public function delete(News $news): bool
    {
        if ($news->image_path) {
            Storage::disk('public')->delete($news->image_path);
        }
        return $news->delete();
    }
}
