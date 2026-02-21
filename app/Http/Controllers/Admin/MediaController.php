<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        Gate::authorize('upload', 'media');

        $request->validate([
            'file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif,webp,mp4,webm', 'max:10240'],
            'folder' => ['nullable', 'string'],
        ]);

        $folder = $request->input('folder', 'media');
        $path = $request->file('file')->store($folder, 'public');

        return response()->json([
            'path' => $path,
            'url' => asset('storage/' . $path),
        ]);
    }

    public function delete(Request $request): JsonResponse
    {
        Gate::authorize('delete', 'media');

        $request->validate([
            'path' => ['required', 'string'],
        ]);

        $path = $request->input('path');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'File not found'], 404);
    }

    public function list(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', 'media');

        $folder = $request->input('folder', 'media');
        $files = Storage::disk('public')->files($folder);

        $items = collect($files)->map(function ($file) {
            return [
                'path' => $file,
                'url' => asset('storage/' . $file),
                'name' => basename($file),
                'size' => Storage::disk('public')->size($file),
                'modified' => Storage::disk('public')->lastModified($file),
            ];
        })->sortByDesc('modified')->values();

        return response()->json($items);
    }
}
