<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('komisariat_id')->nullable()->after('division_id')->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true)->after('komisariat_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('komisariat_id');
            $table->dropColumn('is_active');
        });
    }
};
