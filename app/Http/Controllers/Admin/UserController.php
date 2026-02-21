<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::with('roles')
            ->withCount('posts')
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))
            ->when($request->role, fn($q, $r) => $q->role($r))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $roles = Role::all(['id', 'name']);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        $roles = Role::all(['id', 'name']);
        $permissions = Permission::all(['id', 'name']);

        return Inertia::render('Admin/Users/Form', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user = User::create($data);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        if ($request->has('permissions')) {
            $user->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'អ្នកប្រើប្រាស់ត្រូវបានបង្កើតដោយជោគជ័យ');
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        $user->load(['roles', 'permissions']);
        $roles = Role::all(['id', 'name']);
        $permissions = Permission::all(['id', 'name']);

        return Inertia::render('Admin/Users/Form', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'avatar_url' => $user->avatar_url,
                'phone' => $user->phone,
                'bio' => $user->bio,
                'is_active' => $user->is_active,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->permissions->pluck('name'),
            ],
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        if ($request->has('permissions')) {
            $user->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'អ្នកប្រើប្រាស់ត្រូវបានកែប្រែដោយជោគជ័យ');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        if ($user->id === auth()->id()) {
            return back()->with('error', 'មិនអាចលុបគណនីខ្លួនឯង');
        }

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'អ្នកប្រើប្រាស់ត្រូវបានលុបដោយជោគជ័យ');
    }
}
