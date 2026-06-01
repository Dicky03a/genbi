<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5 categories first
        $categories = Category::factory()->count(5)->create();

        // Create 20 news articles
        News::factory()->count(20)->create([
            'category_id' => function () use ($categories) {
                return $categories->random()->id;
            }
        ]);
    }
}
