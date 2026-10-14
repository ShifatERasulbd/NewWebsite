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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained('menus')->onDelete('cascade');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('title');
            $table->string('component_id')->nullable(); // Component entry reference ID
            $table->string('url')->nullable();
            $table->integer('order')->default(0);
            $table->string('status')->default('draft');
            $table->timestamps();
            // Self-referencing foreign key for nested hierarchy (up to 5 steps)
            $table->foreign('parent_id')->references('id')->on('menu_items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
