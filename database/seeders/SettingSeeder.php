<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'មន្ទីរព័ត៌មានខេត្តស្វាយរៀង', 'type' => 'text', 'group' => 'general'],
            ['key' => 'site_description', 'value' => 'ប្រភពព័ត៌មានផ្លូវការរបស់មន្ទីរព័ត៌មានខេត្តស្វាយរៀង', 'type' => 'textarea', 'group' => 'general'],
            ['key' => 'logo', 'value' => null, 'type' => 'image', 'group' => 'general'],
            ['key' => 'favicon', 'value' => null, 'type' => 'image', 'group' => 'general'],
            ['key' => 'footer_text', 'value' => '© 2024 មន្ទីរព័ត៌មានខេត្តស្វាយរៀង។ រក្សាសិទ្ធិគ្រប់យ៉ាង។', 'type' => 'textarea', 'group' => 'general'],
            ['key' => 'facebook_url', 'value' => 'https://facebook.com', 'type' => 'text', 'group' => 'social'],
            ['key' => 'twitter_url', 'value' => null, 'type' => 'text', 'group' => 'social'],
            ['key' => 'youtube_url', 'value' => null, 'type' => 'text', 'group' => 'social'],
            ['key' => 'telegram_url', 'value' => null, 'type' => 'text', 'group' => 'social'],
            ['key' => 'contact_email', 'value' => 'info@svayrieng.gov.kh', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'contact_phone', 'value' => '+855 44 123 456', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'contact_address', 'value' => 'ក្រុងស្វាយរៀង, ខេត្តស្វាយរៀង, កម្ពុជា', 'type' => 'textarea', 'group' => 'contact'],
            ['key' => 'map_embed_url', 'value' => null, 'type' => 'text', 'group' => 'contact'],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
