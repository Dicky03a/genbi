<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Period\StorePeriodRequest;
use App\Http\Requests\Admin\Period\UpdatePeriodRequest;
use App\Models\Period;
use App\Services\PeriodService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PeriodController extends Controller
{
    public function __construct(private readonly PeriodService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/master/periods/index', ['periods' => $this->service->getAll()]);
    }

    public function store(StorePeriodRequest $request): RedirectResponse
    {
        try {
            $this->service->create($request->validated());
        } catch (DomainException $exception) {
            return back()->withErrors(['period' => $exception->getMessage()]);
        }

        return back()->with('success', 'Periode berhasil dibuat.');
    }

    public function update(UpdatePeriodRequest $request, Period $period): RedirectResponse
    {
        try {
            $this->service->update($period, $request->validated());
        } catch (DomainException $exception) {
            return back()->withErrors(['period' => $exception->getMessage()]);
        }

        return back()->with('success', 'Periode berhasil diperbarui.');
    }

    public function activate(Period $period): RedirectResponse
    {
        $this->service->activate($period);

        return back()->with('success', 'Periode aktif berhasil diubah.');
    }

    public function destroy(Period $period): RedirectResponse
    {
        try {
            $this->service->delete($period);
        } catch (DomainException $exception) {
            return back()->withErrors(['period' => $exception->getMessage()]);
        }

        return back()->with('success', 'Periode berhasil dihapus.');
    }
}
