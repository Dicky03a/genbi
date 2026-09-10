<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('event_role_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('captured_lat', 10, 7);
            $table->decimal('captured_lng', 10, 7);
            $table->decimal('gps_accuracy_m', 8, 2);
            $table->decimal('distance_m', 10, 2);
            $table->string('photo_path');
            $table->string('status')->default('menunggu');
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();

            $table->unique(['event_id', 'user_id']);
            $table->index(['status', 'event_id']);
            $table->index('verified_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
