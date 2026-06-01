<?php

namespace App\Services;

use App\Models\About;

class AboutService
{
    /**
     * Get all about records.
     */
    public function getAll()
    {
        return About::latest()->get();
    }

    /**
     * Create a new about record.
     */
    public function create(array $data): About
    {
        return About::create($data);
    }

    /**
     * Update an existing about record.
     */
    public function update(About $about, array $data): About
    {
        $about->update($data);
        return $about;
    }

    /**
     * Delete an about record.
     */
    public function delete(About $about): bool
    {
        return $about->delete();
    }
}
