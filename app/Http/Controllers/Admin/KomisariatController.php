<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Komisariat\StoreKomisariatRequest;
use App\Http\Requests\Admin\Komisariat\UpdateKomisariatRequest;
use App\Models\Komisariat;
use App\Services\KomisariatService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class KomisariatController extends Controller
{
    public function __construct(private readonly KomisariatService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/master/komisariats/index', ['komisariats' => $this->service->getAll()]);
    }

    public function store(StoreKomisariatRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return back()->with('success', 'Komisariat berhasil dibuat.');
    }

    public function update(UpdateKomisariatRequest $request, Komisariat $komisariat): RedirectResponse
    {
        $this->service->update($komisariat, $request->validated());

        return back()->with('success', 'Komisariat berhasil diperbarui.');
    }

    public function destroy(Komisariat $komisariat): RedirectResponse
    {
        try {
            $this->service->delete($komisariat);
        } catch (DomainException $exception) {
            return back()->withErrors(['komisariat' => $exception->getMessage()]);
        }

        return back()->with('success', 'Komisariat berhasil dihapus.');
    }
}
