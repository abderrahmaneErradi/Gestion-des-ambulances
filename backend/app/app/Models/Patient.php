<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    /**
     * Clé primaire de la table.
     */
    protected $primaryKey = 'id_patient';

    /**
     * Attributs éligibles à l'assignation de masse.
     */
    protected $fillable = [
        'user_id',
        'telephone',
        'adresse',
    ];

    /**
     * Relation belongsTo vers le modèle User.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id_user');
    }

    /**
     * Relation hasMany vers les Interventions.
     */
    public function interventions()
    {
        return $this->hasMany(Intervention::class, 'patient_id', 'id_patient');
    }
}
