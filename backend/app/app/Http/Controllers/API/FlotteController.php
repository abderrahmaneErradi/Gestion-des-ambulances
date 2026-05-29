<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAmbulanceRequest;
use App\Http\Requests\UpdateAmbulanceRequest;
use App\Models\Ambulance;
use App\Models\Ambulancier;
use App\Events\AmbulanceStatusUpdated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FlotteController extends Controller
{
    /**
     * Liste toutes les ambulances de la flotte avec leurs conducteurs.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $ambulances = Ambulance::with('ambulanciers.user')->get();

        return response()->json([
            'status' => true,
            'message' => "Flotte d'ambulances récupérée.",
            'data' => $ambulances
        ], Response::HTTP_OK);
    }

    /**
     * Enregistre une nouvelle ambulance.
     *
     * @param StoreAmbulanceRequest $request
     * @return JsonResponse
     */
    public function store(StoreAmbulanceRequest $request): JsonResponse
    {
        $ambulance = Ambulance::create([
            'immatriculation' => $request->immatriculation,
            'type' => $request->type,
            'statut' => $request->statut ?? 'disponible',
        ]);

        return response()->json([
            'status' => true,
            'message' => "Ambulance enregistrée avec succès.",
            'data' => $ambulance
        ], Response::HTTP_CREATED);
    }

    /**
     * Affiche les détails d'une ambulance spécifique.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $ambulance = Ambulance::with('ambulanciers.user')->find($id);

        if (!$ambulance) {
            return response()->json([
                'status' => false,
                'message' => "L'ambulance demandée n'existe pas."
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'status' => true,
            'message' => "Détails de l'ambulance.",
            'data' => $ambulance
        ], Response::HTTP_OK);
    }

    /**
     * Met à jour les détails d'une ambulance.
     *
     * @param UpdateAmbulanceRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateAmbulanceRequest $request, int $id): JsonResponse
    {
        $ambulance = Ambulance::find($id);

        if (!$ambulance) {
            return response()->json([
                'status' => false,
                'message' => "Ambulance introuvable."
            ], Response::HTTP_NOT_FOUND);
        }

        $ambulance->update($request->validated());

        // Si le statut a été modifié, on émet l'événement temps réel
        if ($request->has('statut')) {
            event(new AmbulanceStatusUpdated($ambulance));
        }

        return response()->json([
            'status' => true,
            'message' => "Ambulance mise à jour.",
            'data' => $ambulance
        ], Response::HTTP_OK);
    }

    /**
     * Supprime une ambulance de la flotte.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $ambulance = Ambulance::find($id);

        if (!$ambulance) {
            return response()->json([
                'status' => false,
                'message' => "Ambulance introuvable."
            ], Response::HTTP_NOT_FOUND);
        }

        $ambulance->delete();

        return response()->json([
            'status' => true,
            'message' => "Ambulance supprimée de la flotte avec succès."
        ], Response::HTTP_OK);
    }

    /**
     * Liste tous les ambulanciers (conducteurs).
     *
     * @return JsonResponse
     */
    public function indexAmbulanciers(): JsonResponse
    {
        $ambulanciers = Ambulancier::with(['user', 'ambulance'])->get();

        return response()->json([
            'status' => true,
            'message' => "Liste des ambulanciers récupérée.",
            'data' => $ambulanciers
        ], Response::HTTP_OK);
    }

    /**
     * Assigne un conducteur à un véhicule.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function assignAmbulanceToDriver(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'ambulance_id' => 'nullable|exists:ambulances,id_ambulance',
        ], [
            'exists' => "L'ambulance spécifiée n'existe pas."
        ]);

        $ambulancier = Ambulancier::find($id);

        if (!$ambulancier) {
            return response()->json([
                'status' => false,
                'message' => "Ambulancier non trouvé."
            ], Response::HTTP_NOT_FOUND);
        }

        $ambulancier->ambulance_id = $request->ambulance_id;
        $ambulancier->save();

        return response()->json([
            'status' => true,
            'message' => "Véhicule assigné avec succès à l'ambulancier.",
            'data' => $ambulancier->load(['user', 'ambulance'])
        ], Response::HTTP_OK);
    }

    /**
     * Met à jour le statut d'activité d'un conducteur.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateDriverStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'statut' => 'required|in:disponible,en_mission,hors_ligne',
        ]);

        $ambulancier = Ambulancier::find($id);

        if (!$ambulancier) {
            return response()->json([
                'status' => false,
                'message' => "Ambulancier non trouvé."
            ], Response::HTTP_NOT_FOUND);
        }

        $ambulancier->statut = $request->statut;
        $ambulancier->save();

        return response()->json([
            'status' => true,
            'message' => "Statut d'activité de l'ambulancier mis à jour.",
            'data' => $ambulancier->load('user')
        ], Response::HTTP_OK);
    }
}
