<?php

namespace App\Services;

use App\Models\Beasiswa;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Collection;

class BeasiswaService
{
    /**
     * Get all beasiswas for admin.
     */
    public function getAll(): Collection
    {
        return Beasiswa::latest()->get();
    }

    /**
     * Get only published beasiswas for public.
     */
    public function getPublished(): Collection
    {
        return Beasiswa::where('is_published', true)->latest()->get();
    }

    /**
     * Create a new beasiswa.
     */
    public function create(array $data): Beasiswa
    {
        if (isset($data['poster'])) {
            $data['poster'] = $data['poster']->store('beasiswas', 'public');
        }

        return Beasiswa::create($data);
    }

    /**
     * Update an existing beasiswa.
     */
    public function update(Beasiswa $beasiswa, array $data): Beasiswa
    {
        if (isset($data['poster'])) {
            if ($beasiswa->poster) {
                Storage::disk('public')->delete($beasiswa->poster);
            }
            $data['poster'] = $data['poster']->store('beasiswas', 'public');
        }

        $beasiswa->update($data);
        return $beasiswa;
    }

    /**
     * Delete a beasiswa.
     */
    public function delete(Beasiswa $beasiswa): bool
    {
        if ($beasiswa->poster) {
            Storage::disk('public')->delete($beasiswa->poster);
        }

        return $beasiswa->delete();
    }
}
