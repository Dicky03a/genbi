<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('point_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('point_category_id')->constrained()->restrictOnDelete();
            $table->foreignId('period_id')->constrained()->restrictOnDelete();
            $table->foreignId('division_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('evidence_path')->nullable();
            $table->unsignedInteger('points_requested');
            $table->string('status')->default('menunggu');
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->unsignedInteger('revision_count')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['period_id', 'status']);
            $table->index('verified_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('point_submissions');
    }
};
