<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PointCategory\StorePointCategoryRequest;
use App\Http\Requests\Admin\PointCategory\UpdatePointCategoryRequest;
use App\Models\PointCategory;
use App\Services\PointCategoryService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PointCategoryController extends Controller
{
    public function __construct(private readonly PointCategoryService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/master/point-categories/index', ['categories' => $this->service->getAll()]);
    }

    public function store(StorePointCategoryRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return back()->with('success', 'Kategori poin berhasil dibuat.');
    }

    public function update(UpdatePointCategoryRequest $request, PointCategory $pointCategory): RedirectResponse
    {
        $this->service->update($pointCategory, $request->validated());

        return back()->with('success', 'Kategori poin berhasil diperbarui.');
    }

    public function destroy(PointCategory $pointCategory): RedirectResponse
    {
        try {
            $this->service->delete($pointCategory);
        } catch (DomainException $exception) {
            return back()->withErrors(['category' => $exception->getMessage()]);
        }

        return back()->with('success', 'Kategori poin berhasil dihapus.');
    }
}
