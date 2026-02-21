<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Setting::class);

        $settings = Setting::all()->mapWithKeys(function ($setting) {
            $value = $setting->value;
            if ($setting->type === 'image' && $value) {
                $value = asset('storage/' . $setting->value);
            }
            return [$setting->key => [
                'value' => $value,
                'raw_value' => $setting->value,
                'type' => $setting->type,
            ]];
        });

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(SettingRequest $request): RedirectResponse
    {
        Gate::authorize('update', Setting::class);

        $data = $request->validated();

        foreach ($data as $key => $value) {
            if ($request->hasFile($key)) {
                $oldSetting = Setting::where('key', $key)->first();
                if ($oldSetting && $oldSetting->value) {
                    Storage::disk('public')->delete($oldSetting->value);
                }
                $path = $request->file($key)->store('settings', 'public');
                Setting::set($key, $path, 'image', 'general');
            } elseif (!is_null($value)) {
                $type = is_bool($value) ? 'boolean' : 'text';
                Setting::set($key, $value, $type, 'general');
            }
        }

        Setting::clearCache();

        return back()->with('success', 'ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ');
    }
}
