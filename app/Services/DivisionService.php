<?php

namespace App\Services;

use App\Models\Division;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Collection;

class DivisionService
{
    /**
     * Get all divisions with user counts.
     */
    public function getAll(): Collection
    {
        return Division::withCount('users')->latest()->get();
    }

    /**
     * Create a new division.
     */
    public function create(array $data): Division
    {
        if (isset($data['foto'])) {
            $data['foto'] = $data['foto']->store('divisions', 'public');
        }

        return Division::create($data);
    }

    /**
     * Update an existing division.
     */
    public function update(Division $division, array $data): Division
    {
        if (isset($data['foto'])) {
            if ($division->foto) {
                Storage::disk('public')->delete($division->foto);
            }
            $data['foto'] = $data['foto']->store('divisions', 'public');
        }

        $division->update($data);
        return $division;
    }

    /**
     * Delete a division.
     */
    public function delete(Division $division): bool
    {
        if ($division->foto) {
            Storage::disk('public')->delete($division->foto);
        }

        return $division->delete();
    }

    /**
     * Get users available to be assigned to a division.
     */
    public function getAvailableUsers(): Collection
    {
        return User::whereNull('division_id')->get();
    }

    /**
     * Assign a user to a division.
     */
    public function assignUser(Division $division, int $userId): User
    {
        $user = User::findOrFail($userId);
        $user->update(['division_id' => $division->id]);
        return $user;
    }

    /**
     * Remove a user from a division.
     */
    public function removeUser(Division $division, int $userId): ?User
    {
        $user = User::findOrFail($userId);
        
        if ($user->division_id === $division->id) {
            $user->update(['division_id' => null]);
            return $user;
        }

        return null;
    }
}
