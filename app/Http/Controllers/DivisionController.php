<?php

namespace App\Http\Controllers;

use App\Http\Requests\Division\StoreDivisionRequest;
use App\Http\Requests\Division\UpdateDivisionRequest;
use App\Models\Division;
use App\Services\DivisionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DivisionController extends Controller
{
    public function __construct(
        protected DivisionService $divisionService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('divisions/index', [
            'divisions' => $this->divisionService->getAll(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('divisions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDivisionRequest $request): RedirectResponse
    {
        $this->divisionService->create($request->validated());

        return redirect()->route('divisions.index')
            ->with('message', 'Division created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Division $division): Response
    {
        return Inertia::render('divisions/show', [
            'division' => $division->load('users'),
            'availableUsers' => $this->divisionService->getAvailableUsers(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Division $division): Response
    {
        return Inertia::render('divisions/edit', [
            'division' => $division,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDivisionRequest $request, Division $division): RedirectResponse
    {
        $this->divisionService->update($division, $request->validated());

        return redirect()->route('divisions.index')
            ->with('message', 'Division updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Division $division): RedirectResponse
    {
        $this->divisionService->delete($division);

        return redirect()->route('divisions.index')
            ->with('message', 'Division deleted successfully.');
    }

    /**
     * Assign a user to the division.
     */
    public function assignUser(Request $request, Division $division): RedirectResponse
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $user = $this->divisionService->assignUser($division, $request->user_id);

        return back()->with('message', "User {$user->name} added to {$division->name}.");
    }

    /**
     * Remove a user from the division.
     */
    public function removeUser(Request $request, Division $division): RedirectResponse
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $user = $this->divisionService->removeUser($division, $request->user_id);

        if ($user) {
            return back()->with('message', "User {$user->name} removed from {$division->name}.");
        }

        return back()->with('error', 'User not found in this division.');
    }
}
