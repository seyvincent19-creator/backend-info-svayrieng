<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Role::class);

        $roles = Role::withCount('permissions', 'users')
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Role::class);

        $permissions = Permission::all(['id', 'name']);
        $groupedPermissions = $this->groupPermissions($permissions);

        return Inertia::render('Admin/Roles/Form', [
            'permissions' => $permissions,
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    public function store(RoleRequest $request): RedirectResponse
    {
        $this->authorize('create', Role::class);

        $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role ត្រូវបានបង្កើតដោយជោគជ័យ');
    }

    public function edit(Role $role): Response
    {
        $this->authorize('update', $role);

        $role->load('permissions');
        $permissions = Permission::all(['id', 'name']);
        $groupedPermissions = $this->groupPermissions($permissions);

        return Inertia::render('Admin/Roles/Form', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
            ],
            'permissions' => $permissions,
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    public function update(RoleRequest $request, Role $role): RedirectResponse
    {
        $this->authorize('update', $role);

        if ($role->name === 'Super Admin' && $request->name !== 'Super Admin') {
            return back()->with('error', 'មិនអាចប្តូរឈ្មោះ Super Admin');
        }

        $role->update(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role ត្រូវបានកែប្រែដោយជោគជ័យ');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $this->authorize('delete', $role);

        if ($role->name === 'Super Admin') {
            return back()->with('error', 'មិនអាចលុប Super Admin role');
        }

        if ($role->users()->exists()) {
            return back()->with('error', 'មិនអាចលុប role ដែលមានអ្នកប្រើប្រាស់');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role ត្រូវបានលុបដោយជោគជ័យ');
    }

    private function groupPermissions($permissions): array
    {
        $grouped = [];
        foreach ($permissions as $permission) {
            $parts = explode('.', $permission->name);
            $group = $parts[0] ?? 'other';
            if (!isset($grouped[$group])) {
                $grouped[$group] = [];
            }
            $grouped[$group][] = $permission->name;
        }
        return $grouped;
    }
}
