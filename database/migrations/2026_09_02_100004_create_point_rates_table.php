<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('point_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('point_category_id')->constrained()->restrictOnDelete();
            $table->string('name');
            $table->unsignedInteger('points');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['point_category_id', 'name']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('point_rates');
    }
};
