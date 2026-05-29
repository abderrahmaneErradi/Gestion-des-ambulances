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
        Schema::create('interventions', function (Blueprint $table) {
            $table->id('id_intervention');
            $table->foreignId('patient_id')->constrained('patients', 'id_patient')->onDelete('cascade');
            $table->foreignId('ambulance_id')->nullable()->constrained('ambulances', 'id_ambulance')->onDelete('set null');
            $table->string('type_urgence');
            $table->timestamp('date_intervention')->useCurrent();
            $table->string('localisation');
            $table->enum('statut', ['en_attente', 'accepte', 'en_cours', 'terminee'])->default('en_attente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interventions');
    }
};
