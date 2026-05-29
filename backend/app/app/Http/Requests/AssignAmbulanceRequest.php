<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignAmbulanceRequest extends FormRequest
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
            'ambulance_id' => 'required|exists:ambulances,id_ambulance',
        ];
    }

    /**
     * Messages d'erreur en français.
     */
    public function messages(): array
    {
        return [
            'ambulance_id.required' => "L'identifiant de l'ambulance est obligatoire.",
            'ambulance_id.exists' => "L'ambulance sélectionnée n'existe pas.",
        ];
    }
}
