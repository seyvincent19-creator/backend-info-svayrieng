<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!$request->user()) {
            abort(403, 'Unauthorized');
        }

        if ($request->user()->hasRole('Super Admin')) {
            return $next($request);
        }

        if (!$request->user()->hasPermissionTo($permission)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
