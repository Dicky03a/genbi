<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_point_rate', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('point_rate_id')->constrained()->cascadeOnDelete();
            
            $table->unique(['event_id', 'point_rate_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_point_rate');
    }
};
