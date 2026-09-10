<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PointRate\StorePointRateRequest;
use App\Http\Requests\Admin\PointRate\UpdatePointRateRequest;
use App\Models\PointCategory;
use App\Models\PointRate;
use App\Services\PointRateService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PointRateController extends Controller
{
    public function __construct(private readonly PointRateService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/master/point-rates/index', [
            'rates' => $this->service->getAll(),
            'categories' => PointCategory::query()->active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StorePointRateRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return back()->with('success', 'Tarif poin berhasil dibuat.');
    }

    public function update(UpdatePointRateRequest $request, PointRate $pointRate): RedirectResponse
    {
        $this->service->update($pointRate, $request->validated());

        return back()->with('success', 'Tarif poin berhasil diperbarui.');
    }

    public function destroy(PointRate $pointRate): RedirectResponse
    {
        $this->service->delete($pointRate);

        return back()->with('success', 'Tarif poin berhasil dihapus.');
    }
}
