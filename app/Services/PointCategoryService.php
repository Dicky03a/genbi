<?php

namespace App\Services;

use App\Models\PointCategory;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class PointCategoryService
{
    public function getAll(): Collection
    {
        return PointCategory::query()->withCount('rates')->latest()->get();
    }

    public function create(array $data): PointCategory
    {
        $data['slug'] = Str::slug($data['name']);

        return PointCategory::create($data);
    }

    public function update(PointCategory $category, array $data): PointCategory
    {
        if (isset($data['name']) && $data['name'] !== $category->name) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        return $category->refresh();
    }

    public function delete(PointCategory $category): void
    {
        if ($category->rates()->exists() || $category->pointTransactions()->exists() || $category->pointSubmissions()->exists()) {
            throw new DomainException('Kategori poin yang sudah dirujuk tidak boleh dihapus. Nonaktifkan kategori tersebut.');
        }

        $category->delete();
    }
}
