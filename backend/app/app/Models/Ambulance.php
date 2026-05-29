<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ambulance extends Model
{
    use HasFactory;

    /**
     * Clé primaire de la table.
     */
    protected $primaryKey = 'id_ambulance';

    /**
     * Attributs éligibles à l'assignation de masse.
     */
    protected $fillable = [
        'immatriculation',
        'type',
        'statut', // 'disponible', 'en_mission', 'maintenance'
    ];

    /**
     * Relation hasMany vers les Ambulanciers.
     */
    public function ambulanciers()
    {
        return $this->hasMany(Ambulancier::class, 'ambulance_id', 'id_ambulance');
    }

    /**
     * Relation hasMany vers les Interventions.
     */
    public function interventions()
    {
        return $this->hasMany(Intervention::class, 'ambulance_id', 'id_ambulance');
    }
}
