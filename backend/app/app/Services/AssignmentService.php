<?php

namespace App\Services;

use App\Models\Intervention;
use App\Models\Ambulance;
use App\Events\InterventionStatusUpdated;
use App\Events\AmbulanceStatusUpdated;
use Illuminate\Support\Facades\DB;
use Exception;

class AssignmentService
{
    /**
     * Affecte automatiquement une ambulance disponible à une intervention.
     * Recherche en priorité une ambulance de statut 'disponible' dont le type
     * correspond au 'type_urgence' de l'intervention. Si aucune n'est trouvée,
     * affecte la première ambulance disponible.
     *
     * @param Intervention $intervention
     * @return Intervention
     * @throws Exception
     */
    public function affecterAutomatiquement(Intervention $intervention)
    {
        return DB::transaction(function () use ($intervention) {
            // 1. Recherche d'une ambulance disponible du bon type
            $ambulance = Ambulance::where('statut', 'disponible')
                ->where('type', $intervention->type_urgence)
                ->first();

            // 2. Repli : si non trouvée, prendre n'importe quelle disponible
            if (!$ambulance) {
                $ambulance = Ambulance::where('statut', 'disponible')->first();
            }

            if (!$ambulance) {
                throw new Exception("Aucune ambulance disponible pour le moment.");
            }

            // 3. Associer l'ambulance à l'intervention
            $intervention->ambulance_id = $ambulance->id_ambulance;
            $intervention->statut = 'accepte';
            $intervention->save();

            // 4. Mettre à jour les statuts
            $ambulance->statut = 'en_mission';
            $ambulance->save();

            // Mettre également à jour les ambulanciers associés de 'disponible' à 'en_mission'
            $ambulance->ambulanciers()
                ->where('statut', 'disponible')
                ->update(['statut' => 'en_mission']);

            // 5. Déclencher les événements temps réel
            event(new InterventionStatusUpdated($intervention));
            event(new AmbulanceStatusUpdated($ambulance));

            return $intervention;
        });
    }

    /**
     * Affecte manuellement une ambulance spécifique à une intervention.
     *
     * @param Intervention $intervention
     * @param Ambulance $ambulance
     * @return Intervention
     * @throws Exception
     */
    public function affecterManuellement(Intervention $intervention, Ambulance $ambulance)
    {
        if ($ambulance->statut !== 'disponible') {
            throw new Exception("L'ambulance sélectionnée n'est pas disponible (statut actuel: {$ambulance->statut}).");
        }

        return DB::transaction(function () use ($intervention, $ambulance) {
            // 1. Libérer l'ancienne ambulance si elle était déjà assignée à cette intervention
            if ($intervention->ambulance_id && $intervention->ambulance_id !== $ambulance->id_ambulance) {
                $oldAmbulance = Ambulance::find($intervention->ambulance_id);
                if ($oldAmbulance) {
                    $oldAmbulance->statut = 'disponible';
                    $oldAmbulance->save();

                    // Libérer les ambulanciers associés
                    $oldAmbulance->ambulanciers()
                        ->where('statut', 'en_mission')
                        ->update(['statut' => 'disponible']);

                    event(new AmbulanceStatusUpdated($oldAmbulance));
                }
            }

            // 2. Assigner la nouvelle ambulance
            $intervention->ambulance_id = $ambulance->id_ambulance;
            $intervention->statut = 'accepte';
            $intervention->save();

            // 3. Mettre à jour le statut de la nouvelle ambulance et de ses chauffeurs
            $ambulance->statut = 'en_mission';
            $ambulance->save();

            $ambulance->ambulanciers()
                ->where('statut', 'disponible')
                ->update(['statut' => 'en_mission']);

            // 4. Déclencher les événements temps réel
            event(new InterventionStatusUpdated($intervention));
            event(new AmbulanceStatusUpdated($ambulance));

            return $intervention;
        });
    }
}
