<?php

use App\Http\Controllers\API\DashboardStatsController;
use App\Http\Controllers\API\FlotteController;
use App\Http\Controllers\API\WebAuthController;
use App\Http\Controllers\API\WebInterventionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Ici se trouvent toutes les routes de l'API de supervision de notre système
| intelligent de régulation d'ambulances.
|
*/

// --- Routes publiques d'Authentification ---
Route::post('/auth/login', [WebAuthController::class, 'login']);

// --- Routes sécurisées (Seuls les utilisateurs connectés Admin ou Opérateur ont accès) ---
Route::middleware(['auth:sanctum', 'admin_or_operateur'])->group(function () {

    // Déconnexion
    Route::post('/auth/logout', [WebAuthController::class, 'logout']);

    // Statistiques Dashboard
    Route::get('/dashboard/stats', [DashboardStatsController::class, 'getStats']);

    // Gestion de la Flotte d'ambulances (CRUD complet)
    Route::apiResource('flotte/ambulances', FlotteController::class)->parameters([
        'ambulances' => 'ambulance' // Assure que le paramètre s'appelle {ambulance} pour correspondre aux FormRequests
    ]);

    // Gestion des Ambulanciers
    Route::get('/flotte/ambulanciers', [FlotteController::class, 'indexAmbulanciers']);
    Route::post('/flotte/ambulanciers/{id}/assign', [FlotteController::class, 'assignAmbulanceToDriver']);
    Route::post('/flotte/ambulanciers/{id}/status', [FlotteController::class, 'updateDriverStatus']);

    // Gestion et Supervision des Interventions de Secours
    Route::get('/interventions', [WebInterventionController::class, 'index']);
    Route::post('/interventions/{id}/assign-manual', [WebInterventionController::class, 'assignManually']);
    Route::post('/interventions/{id}/assign-auto', [WebInterventionController::class, 'assignAutomatically']);
    Route::post('/interventions/{id}/cancel', [WebInterventionController::class, 'cancelIntervention']);
    Route::post('/interventions/{id}/status', [WebInterventionController::class, 'updateStatus']);
});
