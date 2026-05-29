<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ambulancier extends Model
{
    use HasFactory;

    /**
     * Clé primaire de la table.
     */
    protected $primaryKey = 'id_ambulancier';

    /**
     * Attributs éligibles à l'assignation de masse.
     */
    protected $fillable = [
        'user_id',
        'telephone',
        'statut', // 'disponible', 'en_mission', 'hors_ligne'
        'ambulance_id',
    ];

    /**
     * Relation belongsTo vers le modèle User.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id_user');
    }

    /**
     * Relation belongsTo vers le modèle Ambulance.
     */
    public function ambulance()
    {
        return $this->belongsTo(Ambulance::class, 'ambulance_id', 'id_ambulance');
    }
}
