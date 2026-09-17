<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('point_type')->default('role')->after('description');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->foreignId('point_rate_id')->nullable()->after('event_role_id')->constrained('point_rates')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['point_rate_id']);
            $table->dropColumn('point_rate_id');
        });
        
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('point_type');
        });
    }
};
