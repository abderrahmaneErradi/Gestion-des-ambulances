<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Ambulance;
use App\Models\Intervention;
use App\Models\Ambulancier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardStatsController extends Controller
{
    /**
     * Fournit les statistiques agrégées pour le tableau de bord web.
     *
     * @return JsonResponse
     */
    public function getStats(): JsonResponse
    {
        Carbon::setLocale('fr');
        $today = Carbon::today();

        // 1. Compteurs de la flotte d'ambulances
        $ambulancesDispo = Ambulance::where('statut', 'disponible')->count();
        $ambulancesEnMission = Ambulance::where('statut', 'en_mission')->count();
        $ambulancesMaintenance = Ambulance::where('statut', 'maintenance')->count();
        $totalAmbulances = Ambulance::count();

        // 2. Compteurs des ambulanciers (conducteurs)
        $ambulanciersDispo = Ambulancier::where('statut', 'disponible')->count();
        $ambulanciersEnMission = Ambulancier::where('statut', 'en_mission')->count();
        $ambulanciersHorsLigne = Ambulancier::where('statut', 'hors_ligne')->count();
        $totalAmbulanciers = Ambulancier::count();

        // 3. Statistiques des interventions du jour
        $interventionsAujourdhui = Intervention::whereDate('date_intervention', $today)->count();
        $interventionsEnAttente = Intervention::whereDate('date_intervention', $today)
            ->where('statut', 'en_attente')
            ->count();
        $interventionsEnCours = Intervention::whereDate('date_intervention', $today)
            ->where('statut', 'en_cours')
            ->count();
        $interventionsTerminees = Intervention::whereDate('date_intervention', $today)
            ->where('statut', 'terminee')
            ->count();

        // 4. Répartition globale par type d'urgence
        $repartitionUrgences = Intervention::select('type_urgence', DB::raw('count(*) as count'))
            ->groupBy('type_urgence')
            ->get();

        // 5. Historique mensuel sur les 6 derniers mois (total et terminées)
        // Traitement indépendant du moteur SQL pour éviter les incompatibilités SQLite/MySQL
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();
        $interventionsRecentes = Intervention::where('date_intervention', '>=', $sixMonthsAgo)->get();

        $historiqueMensuel = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthKey = $month->format('Y-m');
            $monthLabel = $month->translatedFormat('F Y');

            $historiqueMensuel[$monthKey] = [
                'mois' => ucfirst($monthLabel),
                'total' => 0,
                'terminees' => 0,
            ];
        }

        foreach ($interventionsRecentes as $intervention) {
            $key = $intervention->date_intervention->format('Y-m');
            if (isset($historiqueMensuel[$key])) {
                $historiqueMensuel[$key]['total']++;
                if ($intervention->statut === 'terminee') {
                    $historiqueMensuel[$key]['terminees']++;
                }
            }
        }

        // Convertir le tableau associatif en liste indexée pour le JSON du front-end
        $historiqueFormatte = array_values($historiqueMensuel);

        return response()->json([
            'status' => true,
            'message' => "Statistiques de supervision récupérées avec succès.",
            'data' => [
                'flotte' => [
                    'total' => $totalAmbulances,
                    'disponible' => $ambulancesDispo,
                    'en_mission' => $ambulancesEnMission,
                    'maintenance' => $ambulancesMaintenance,
                ],
                'ambulanciers' => [
                    'total' => $totalAmbulanciers,
                    'disponible' => $ambulanciersDispo,
                    'en_mission' => $ambulanciersEnMission,
                    'hors_ligne' => $ambulanciersHorsLigne,
                ],
                'interventions_jour' => [
                    'total' => $interventionsAujourdhui,
                    'en_attente' => $interventionsEnAttente,
                    'en_cours' => $interventionsEnCours,
                    'terminees' => $interventionsTerminees,
                ],
                'repartition_urgences' => $repartitionUrgences,
                'historique_mensuel' => $historiqueFormatte
            ]
        ], Response::HTTP_OK);
    }
}
