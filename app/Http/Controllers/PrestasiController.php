<?php

namespace App\Http\Controllers;

use App\Models\Prestasi;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrestasiController extends Controller
{
    /**
     * Display a listing of the resource for the public.
     */
    public function publicIndex(): Response
    {
        return Inertia::render('front/prestasi', [
            'prestasis' => Prestasi::with('user:id,name,avatar')->latest()->get(),
        ]);
    }

    /**
     * Display a listing of the resource for admin.
     */
    public function index(): Response
    {
        return Inertia::render('dashboard/prestasis/index', [
            'prestasis' => Prestasi::with('user:id,name,avatar')->latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('dashboard/prestasis/create', [
            'users' => User::active()->get(['id', 'name', 'avatar']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        Prestasi::create($validated);

        return redirect()->route('prestasis.index')->with('success', 'Prestasi berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Prestasi $prestasi): Response
    {
        return Inertia::render('dashboard/prestasis/edit', [
            'prestasi' => $prestasi,
            'users' => User::active()->get(['id', 'name', 'avatar']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Prestasi $prestasi)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $prestasi->update($validated);

        return redirect()->route('prestasis.index')->with('success', 'Prestasi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Prestasi $prestasi)
    {
        $prestasi->delete();
        return back()->with('success', 'Prestasi berhasil dihapus.');
    }
}
