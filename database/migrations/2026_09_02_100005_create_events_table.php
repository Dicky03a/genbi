<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')->constrained()->restrictOnDelete();
            $table->foreignId('komisariat_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->dateTime('opens_at');
            $table->dateTime('closes_at');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->unsignedInteger('radius_m')->default(100);
            $table->unsignedInteger('max_gps_accuracy_m')->nullable();
            $table->string('status')->default('draft');
            $table->timestamps();

            $table->index(['period_id', 'status']);
            $table->index(['komisariat_id', 'status']);
            $table->index(['opens_at', 'closes_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
