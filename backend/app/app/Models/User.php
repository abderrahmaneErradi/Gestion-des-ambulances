<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Clé primaire personnalisée.
     */
    protected $primaryKey = 'id_user';

    /**
     * Les attributs assignables en masse.
     */
    protected $fillable = [
        'nom',
        'email',
        'password',
        'role', // 'admin', 'operateur', 'ambulancier', 'patient'
    ];

    /**
     * Les attributs à masquer pour la sérialisation.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Les attributs à caster.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Vérifie si l'utilisateur est un administrateur ou un opérateur.
     */
    public function isAdminOrOperateur(): bool
    {
        return in_array($this->role, ['admin', 'operateur']);
    }

    /**
     * Relation un-à-un avec Patient.
     */
    public function patient()
    {
        return $this->hasOne(Patient::class, 'user_id', 'id_user');
    }

    /**
     * Relation un-à-un avec Ambulancier.
     */
    public function ambulancier()
    {
        return $this->hasOne(Ambulancier::class, 'user_id', 'id_user');
    }
}
