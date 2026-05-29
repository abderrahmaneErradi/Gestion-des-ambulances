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
        Schema::create('ambulanciers', function (Blueprint $table) {
            $table->id('id_ambulancier');
            $table->foreignId('user_id')->constrained('users', 'id_user')->onDelete('cascade');
            $table->string('telephone');
            $table->enum('statut', ['disponible', 'en_mission', 'hors_ligne'])->default('disponible');
            $table->foreignId('ambulance_id')->nullable()->constrained('ambulances', 'id_ambulance')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ambulanciers');
    }
};
