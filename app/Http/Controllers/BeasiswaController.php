<?php

namespace App\Http\Controllers;

use App\Http\Requests\Beasiswa\StoreBeasiswaRequest;
use App\Http\Requests\Beasiswa\UpdateBeasiswaRequest;
use App\Models\Beasiswa;
use App\Services\BeasiswaService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BeasiswaController extends Controller
{
    public function __construct(
        protected BeasiswaService $beasiswaService
    ) {}

    /**
     * Display a listing of the resource for admin.
     */
    public function index(): Response
    {
        return Inertia::render('beasiswas/index', [
            'beasiswas' => $this->beasiswaService->getAll(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('beasiswas/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBeasiswaRequest $request): RedirectResponse
    {
        $this->beasiswaService->create($request->validated());

        return redirect()->route('beasiswas.index')
            ->with('message', 'Beasiswa information created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Beasiswa $beasiswa): Response
    {
        return Inertia::render('beasiswas/show', [
            'beasiswa' => $beasiswa,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Beasiswa $beasiswa): Response
    {
        return Inertia::render('beasiswas/edit', [
            'beasiswa' => $beasiswa,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBeasiswaRequest $request, Beasiswa $beasiswa): RedirectResponse
    {
        $this->beasiswaService->update($beasiswa, $request->validated());

        return redirect()->route('beasiswas.index')
            ->with('message', 'Beasiswa information updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Beasiswa $beasiswa): RedirectResponse
    {
        $this->beasiswaService->delete($beasiswa);

        return redirect()->route('beasiswas.index')
            ->with('message', 'Beasiswa information deleted successfully.');
    }

    /**
     * Public view for beasiswas.
     */
    public function publicIndex(): Response
    {
        return Inertia::render('public/beasiswa/index', [
            'beasiswas' => $this->beasiswaService->getPublished(),
        ]);
    }
}
