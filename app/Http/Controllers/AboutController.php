<?php

namespace App\Http\Controllers;

use App\Http\Requests\About\StoreAboutRequest;
use App\Http\Requests\About\UpdateAboutRequest;
use App\Models\About;
use App\Services\AboutService;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    protected $aboutService;

    public function __construct(AboutService $aboutService)
    {
        $this->aboutService = $aboutService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('dashboard/abouts/index', [
            'abouts' => $this->aboutService->getAll(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('dashboard/abouts/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAboutRequest $request)
    {
        $this->aboutService->create($request->validated());

        return redirect()->route('abouts.index')->with('success', 'About record created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(About $about): Response
    {
        return Inertia::render('dashboard/abouts/edit', [
            'about' => $about,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAboutRequest $request, About $about)
    {
        $this->aboutService->update($about, $request->validated());

        return redirect()->route('abouts.index')->with('success', 'About record updated successfully.');
    }

    /**
     * Remove the specified resource in storage.
     */
    public function destroy(About $about)
    {
        $this->aboutService->delete($about);

        return back()->with('success', 'About record deleted successfully.');
    }
}
