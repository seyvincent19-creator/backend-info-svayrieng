<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::all()->mapWithKeys(function ($setting) {
            $value = $setting->value;
            if ($setting->type === 'image' && $value) {
                $value = asset('storage/' . $value);
            }
            return [$setting->key => $value];
        });

        return response()->json($settings);
    }
}
