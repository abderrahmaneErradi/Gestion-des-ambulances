<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    use HasFactory;

    /**
     * Clé primaire de la table.
     */
    protected $primaryKey = 'id_intervention';

    /**
     * Attributs éligibles à l'assignation de masse.
     */
    protected $fillable = [
        'patient_id',
        'ambulance_id',
        'type_urgence',
        'date_intervention',
        'localisation',
        'statut', // 'en_attente', 'accepte', 'en_cours', 'terminee'
    ];

    /**
     * Casts des attributs.
     */
    protected $casts = [
        'date_intervention' => 'datetime',
    ];

    /**
     * Relation belongsTo vers le Patient.
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id_patient');
    }

    /**
     * Relation belongsTo vers l'Ambulance.
     */
    public function ambulance()
    {
        return $this->belongsTo(Ambulance::class, 'ambulance_id', 'id_ambulance');
    }
}
