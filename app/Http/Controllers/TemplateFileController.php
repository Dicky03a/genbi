<?php

namespace App\Http\Controllers;

use App\Models\TemplateFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TemplateFileController extends Controller
{
    /**
     * Admin: Display a listing of the resource.
     */
    public function index()
    {
        $templateFiles = TemplateFile::latest()->get();
        return Inertia::render('dashboard/template-files/index', [
            'templateFiles' => $templateFiles
        ]);
    }

    /**
     * Admin: Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dashboard/template-files/create');
    }

    /**
     * Admin: Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|max:10240', // Max 10MB
        ]);

        $path = $request->file('file')->store('template-files', 'public');

        TemplateFile::create([
            'name' => $request->name,
            'file_path' => $path,
        ]);

        return redirect()->route('template-files.index')->with('success', 'Template file uploaded successfully.');
    }

    /**
     * Admin: Show the form for editing the specified resource.
     */
    public function edit(TemplateFile $templateFile)
    {
        return Inertia::render('dashboard/template-files/edit', [
            'templateFile' => $templateFile
        ]);
    }

    /**
     * Admin: Update the specified resource in storage.
     */
    public function update(Request $request, TemplateFile $templateFile)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'nullable|file|max:10240',
        ]);

        $data = ['name' => $request->name];

        if ($request->hasFile('file')) {
            // Delete old file
            if (Storage::disk('public')->exists($templateFile->file_path)) {
                Storage::disk('public')->delete($templateFile->file_path);
            }
            $data['file_path'] = $request->file('file')->store('template-files', 'public');
        }

        $templateFile->update($data);

        return redirect()->route('template-files.index')->with('success', 'Template file updated successfully.');
    }

    /**
     * Admin: Remove the specified resource from storage.
     */
    public function destroy(TemplateFile $templateFile)
    {
        if (Storage::disk('public')->exists($templateFile->file_path)) {
            Storage::disk('public')->delete($templateFile->file_path);
        }

        $templateFile->delete();

        return redirect()->route('template-files.index')->with('success', 'Template file deleted successfully.');
    }

    /**
     * Public: Display the template files page.
     */
    public function publicIndex()
    {
        $templateFiles = TemplateFile::latest()->get();
        return Inertia::render('front/template-files', [
            'templateFiles' => $templateFiles,
        ]);
    }

    /**
     * Public: Download the template file.
     */
    public function download(TemplateFile $templateFile)
    {
        if (!Storage::disk('public')->exists($templateFile->file_path)) {
            abort(404, 'File not found');
        }
        
        $extension = pathinfo($templateFile->file_path, PATHINFO_EXTENSION);
        return response()->download(storage_path('app/public/' . $templateFile->file_path), $templateFile->name . '.' . $extension);
    }
}
