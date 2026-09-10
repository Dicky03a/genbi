<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('divisions')) {
            Schema::create('divisions', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('foto')->nullable();
                $table->text('keterangan')->nullable();
                $table->timestamps();
            });
        }

        if (Schema::hasTable('users') && ! Schema::hasColumn('users', 'division_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('division_id')->nullable()->constrained()->nullOnDelete();
            });
        }

        if (! Schema::hasTable('beasiswas')) {
            Schema::create('beasiswas', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description');
                $table->text('procedures');
                $table->text('requirements');
                $table->text('required_files');
                $table->text('flow');
                $table->string('link')->nullable();
                $table->string('poster')->nullable();
                $table->boolean('is_published')->default(false);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        // Legacy objects are owned by their original migrations.
    }
};
