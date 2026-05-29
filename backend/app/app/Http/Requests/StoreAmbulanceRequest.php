<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAmbulanceRequest extends FormRequest
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
        return [
            'immatriculation' => 'required|string|unique:ambulances,immatriculation',
            'type' => 'required|string',
            'statut' => 'nullable|in:disponible,en_mission,maintenance',
        ];
    }

    /**
     * Messages d'erreur en français.
     */
    public function messages(): array
    {
        return [
            'immatriculation.required' => "L'immatriculation est obligatoire.",
            'immatriculation.unique' => "Cette immatriculation est déjà enregistrée.",
            'type.required' => "Le type d'ambulance est obligatoire (ex: Standard, Réanimation).",
            'statut.in' => "Le statut doit être parmi : disponible, en_mission, maintenance.",
        ];
    }
}
