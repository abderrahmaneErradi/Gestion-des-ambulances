<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAmbulanceRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Obtenir les règles de validation.
     */
    public function rules(): array
    {
        // Récupérer l'identifiant de l'ambulance depuis la route (si présent)
        $id = $this->route('ambulance');

        return [
            'immatriculation' => 'nullable|string|unique:ambulances,immatriculation,' . $id . ',id_ambulance',
            'type' => 'nullable|string',
            'statut' => 'nullable|in:disponible,en_mission,maintenance',
        ];
    }

    /**
     * Messages d'erreur en français.
     */
    public function messages(): array
    {
        return [
            'immatriculation.unique' => "Cette immatriculation est déjà enregistrée.",
            'statut.in' => "Le statut doit être parmi : disponible, en_mission, maintenance.",
        ];
    }
}
