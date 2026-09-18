<?php

namespace App\Http\Controllers;

use App\Models\BeasiswaFaq;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BeasiswaFaqController extends Controller
{
    public function index(): Response
    {
        $faqs = BeasiswaFaq::latest()->get();

        return Inertia::render('beasiswa-faqs/index', [
            'faqs' => $faqs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('beasiswa-faqs/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'boolean',
        ]);

        BeasiswaFaq::create($validated);

        return redirect()->route('beasiswa-faqs.index')
            ->with('message', 'FAQ created successfully.');
    }

    public function edit(BeasiswaFaq $beasiswa_faq): Response
    {
        return Inertia::render('beasiswa-faqs/edit', [
            'faq' => $beasiswa_faq,
        ]);
    }

    public function update(Request $request, BeasiswaFaq $beasiswa_faq): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $beasiswa_faq->update($validated);

        return redirect()->route('beasiswa-faqs.index')
            ->with('message', 'FAQ updated successfully.');
    }

    public function destroy(BeasiswaFaq $beasiswa_faq): RedirectResponse
    {
        $beasiswa_faq->delete();

        return redirect()->route('beasiswa-faqs.index')
            ->with('message', 'FAQ deleted successfully.');
    }
}
