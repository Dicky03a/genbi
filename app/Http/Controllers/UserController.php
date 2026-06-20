<?php

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with(['roles', 'division'])
            ->latest()
            ->get()
            ->map(fn($user) => [
                'id'       => $user->id,
                'name'     => $user->name,
                'email'    => $user->email,
                'avatar'   => $user->avatar,
                'nim'      => $user->nim,
                'prodi'    => $user->prodi,
                'angkatan' => $user->angkatan,
                'alamat'   => $user->alamat,
                'roles'    => $user->roles->pluck('name'),
                'division' => $user->division?->only(['id', 'name']),
            ]);

        return Inertia::render('users/index', compact('users'));
    }

    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles'     => Role::pluck('name'),
            'divisions' => Division::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password'    => ['required', 'string', 'min:8'],
            'nim'         => ['nullable', 'string', 'max:20'],
            'prodi'       => ['nullable', 'string', 'max:100'],
            'angkatan'    => ['nullable', 'string', 'size:4'],
            'alamat'      => ['nullable', 'string'],
            'avatar'      => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'role'        => ['required', 'string', Rule::in(Role::pluck('name'))],
            'division_id' => ['nullable', 'exists:divisions,id'],
        ]);

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $data['password'] = Hash::make($data['password']);
        $role = $data['role'];
        unset($data['role']);

        $user = User::create($data);
        $user->assignRole($role);

        return redirect()->route('users.index')->with('message', 'User berhasil dibuat.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user'      => array_merge($user->only(['id', 'name', 'email', 'avatar', 'nim', 'prodi', 'angkatan', 'alamat', 'division_id']), [
                'role' => $user->roles->first()?->name,
            ]),
            'roles'     => Role::pluck('name'),
            'divisions' => Division::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password'    => ['nullable', 'string', 'min:8'],
            'nim'         => ['nullable', 'string', 'max:20'],
            'prodi'       => ['nullable', 'string', 'max:100'],
            'angkatan'    => ['nullable', 'string', 'size:4'],
            'alamat'      => ['nullable', 'string'],
            'avatar'      => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'role'        => ['required', 'string', Rule::in(Role::pluck('name'))],
            'division_id' => ['nullable', 'exists:divisions,id'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        } else {
            unset($data['avatar']);
        }

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $role = $data['role'];
        unset($data['role']);

        $user->update($data);
        $user->syncRoles([$role]);

        return redirect()->route('users.index')->with('message', 'User berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return redirect()->route('users.index')->with('message', 'User berhasil dihapus.');
    }
}
