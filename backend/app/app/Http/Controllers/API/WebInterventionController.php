<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignAmbulanceRequest;
use App\Models\Intervention;
use App\Models\Ambulance;
use App\Services\AssignmentService;
use App\Events\InterventionStatusUpdated;
use App\Events\AmbulanceStatusUpdated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Exception;

class WebInterventionController extends Controller
{
    /**
     * Le service d'affectation métier.
     */
    protected $assignmentService;

    /**
     * Injection de dépendances via le constructeur.
     */
    public function __construct(AssignmentService $assignmentService)
    {
        $this->assignmentService = $assignmentService;
    }

    /**
     * Liste toutes les interventions en incluant les relations (eager loading) avec filtres.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Intervention::with(['patient.user', 'ambulance.ambulanciers.user']);

        // Filtre par statut (en_attente, accepte, en_cours, terminee)
        if ($request->has('statut') && $request->statut !== '') {
            $query->where('statut', $request->statut);
        }

        // Filtre par niveau/type d'urgence
        if ($request->has('type_urgence') && $request->type_urgence !== '') {
            $query->where('type_urgence', $request->type_urgence);
        }

        $interventions = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'message' => "Liste des interventions récupérée.",
            'data' => $interventions
        ], Response::HTTP_OK);
    }

    /**
     * Assigne manuellement une ambulance spécifique sélectionnée depuis le front-end.
     *
     * @param AssignAmbulanceRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function assignManually(AssignAmbulanceRequest $request, int $id): JsonResponse
    {
        $intervention = Intervention::find($id);

        if (!$intervention) {
            return response()->json([
                'status' => false,
                'message' => "Intervention introuvable."
            ], Response::HTTP_NOT_FOUND);
        }

        $ambulance = Ambulance::find($request->ambulance_id);

        try {
            $updatedIntervention = $this->assignmentService->affecterManuellement($intervention, $ambulance);

            return response()->json([
                'status' => true,
                'message' => "Ambulance affectée manuellement avec succès.",
                'data' => $updatedIntervention->load(['patient.user', 'ambulance'])
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Déclenche l'affectation automatique d'une ambulance adaptée.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function assignAutomatically(int $id): JsonResponse
    {
        $intervention = Intervention::find($id);

        if (!$intervention) {
            return response()->json([
                'status' => false,
                'message' => "Intervention introuvable."
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            $updatedIntervention = $this->assignmentService->affecterAutomatiquement($intervention);

            return response()->json([
                'status' => true,
                'message' => "Ambulance affectée automatiquement avec succès.",
                'data' => $updatedIntervention->load(['patient.user', 'ambulance'])
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Annule une mission (libère le véhicule/conducteurs associés et remet l'intervention en attente).
     *
     * @param int $id
     * @return JsonResponse
     */
    public function cancelIntervention(int $id): JsonResponse
    {
        $intervention = Intervention::find($id);

        if (!$intervention) {
            return response()->json([
                'status' => false,
                'message' => "Intervention introuvable."
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            DB::transaction(function () use ($intervention) {
                // 1. Libérer l'ambulance et ses chauffeurs
                if ($intervention->ambulance_id) {
                    $ambulance = Ambulance::find($intervention->ambulance_id);
                    if ($ambulance) {
                        $ambulance->statut = 'disponible';
                        $ambulance->save();

                        $ambulance->ambulanciers()
                            ->where('statut', 'en_mission')
                            ->update(['statut' => 'disponible']);

                        event(new AmbulanceStatusUpdated($ambulance));
                    }
                }

                // 2. Réinitialiser le statut de l'intervention à 'en_attente' et détacher l'ambulance
                $intervention->ambulance_id = null;
                $intervention->statut = 'en_attente';
                $intervention->save();

                event(new InterventionStatusUpdated($intervention));
            });

            return response()->json([
                'status' => true,
                'message' => "Mission annulée avec succès. L'intervention est remise en attente et l'ambulance a été libérée.",
                'data' => $intervention->load(['patient.user', 'ambulance'])
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => "Une erreur est survenue lors de l'annulation : " . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Met à jour le statut d'une intervention (ex: en_cours, terminee).
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'statut' => 'required|in:en_attente,accepte,en_cours,terminee',
        ]);

        $intervention = Intervention::find($id);

        if (!$intervention) {
            return response()->json([
                'status' => false,
                'message' => "Intervention introuvable."
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            DB::transaction(function () use ($intervention, $request) {
                $newStatut = $request->statut;
                $intervention->statut = $newStatut;
                $intervention->save();

                // Si la mission est marquée comme terminée, on libère le véhicule de secours et l'équipage
                if ($newStatut === 'terminee' && $intervention->ambulance_id) {
                    $ambulance = Ambulance::find($intervention->ambulance_id);
                    if ($ambulance) {
                        $ambulance->statut = 'disponible';
                        $ambulance->save();

                        $ambulance->ambulanciers()
                            ->where('statut', 'en_mission')
                            ->update(['statut' => 'disponible']);

                        event(new AmbulanceStatusUpdated($ambulance));
                    }
                }

                event(new InterventionStatusUpdated($intervention));
            });

            return response()->json([
                'status' => true,
                'message' => "Statut de l'intervention mis à jour avec succès.",
                'data' => $intervention->load(['patient.user', 'ambulance'])
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => "Erreur lors de la mise à jour : " . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
