<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'ព័ត៌មានសំខាន់ៗ',
                'name_en' => 'Important News',
                'slug' => 'important-news',
                'order' => 1,
            ],
            [
                'name' => 'ព័ត៌មានជាតិ',
                'name_en' => 'National News',
                'slug' => 'national-news',
                'order' => 2,
                'children' => [
                    [
                        'name' => 'នយោបាយ និង ការអភិវឌ្ឍន៍',
                        'name_en' => 'Politics & Development',
                        'slug' => 'politics-development',
                        'order' => 1,
                    ],
                    [
                        'name' => 'វប្បធម៌ និងទេសចរណ៍',
                        'name_en' => 'Culture & Tourism',
                        'slug' => 'culture-tourism',
                        'order' => 2,
                    ],
                    [
                        'name' => 'សន្តិសុខ និង សង្គម',
                        'name_en' => 'Security & Society',
                        'slug' => 'security-society',
                        'order' => 3,
                    ],
                    [
                        'name' => 'សិល្បៈកម្សាន្ត',
                        'name_en' => 'Entertainment',
                        'slug' => 'entertainment',
                        'order' => 4,
                    ],
                    [
                        'name' => 'សេដ្ឋកិច្ច និង កសិកម្ម',
                        'name_en' => 'Economy & Agriculture',
                        'slug' => 'economy-agriculture',
                        'order' => 5,
                    ],
                ],
            ],
            [
                'name' => 'ព័ត៌មានអន្តរជាតិ',
                'name_en' => 'International News',
                'slug' => 'international-news',
                'order' => 3,
            ],
            [
                'name' => 'ព័ត៌មានកីឡា',
                'name_en' => 'Sports News',
                'slug' => 'sports-news',
                'order' => 4,
            ],
            [
                'name' => 'ព័ត៌មានវីដេអូ',
                'name_en' => 'Video News',
                'slug' => 'video-news',
                'order' => 5,
            ],
        ];

        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $category = Category::updateOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );

            foreach ($children as $childData) {
                $childData['parent_id'] = $category->id;
                Category::updateOrCreate(
                    ['slug' => $childData['slug']],
                    $childData
                );
            }
        }
    }
}
