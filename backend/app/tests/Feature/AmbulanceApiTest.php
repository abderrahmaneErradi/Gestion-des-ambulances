<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Ambulance;
use App\Models\Patient;
use App\Models\Intervention;
use App\Services\AssignmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AmbulanceApiTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $driverUser;
    protected $patientUser;
    protected $patient;
    protected $ambulance;

    /**
     * Initialisation des données de test avant chaque exécution.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // 1. Administrateur
        $this->admin = User::create([
            'nom' => 'Dr. Jean Dupont (Admin)',
            'email' => 'admin@test.fr',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        // 2. Chauffeur (Ambulancier)
        $this->driverUser = User::create([
            'nom' => 'Marc Driver',
            'email' => 'driver@test.fr',
            'password' => bcrypt('password123'),
            'role' => 'ambulancier',
        ]);

        // 3. Patient
        $this->patientUser = User::create([
            'nom' => 'Alice Patient',
            'email' => 'patient@test.fr',
            'password' => bcrypt('password123'),
            'role' => 'patient',
        ]);

        $this->patient = Patient::create([
            'user_id' => $this->patientUser->id_user,
            'telephone' => '0600000000',
            'adresse' => '12 Rue de Test',
        ]);

        // 4. Ambulance disponible
        $this->ambulance = Ambulance::create([
            'immatriculation' => 'XX-999-XX',
            'type' => 'Réanimation',
            'statut' => 'disponible',
        ]);
    }

    /**
     * Test de connexion réussie pour un administrateur.
     */
    public function test_admin_can_login()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@test.fr',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', true)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'token',
                    'user' => ['id_user', 'nom', 'email', 'role']
                ]
            ]);
    }

    /**
     * Test de connexion refusée pour un rôle non autorisé (chauffeur).
     */
    public function test_driver_cannot_login_to_admin_portal()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'driver@test.fr',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('status', false)
            ->assertJsonPath('message', "Accès non autorisé. Seuls les administrateurs et régulateurs peuvent se connecter à cette interface.");
    }

    /**
     * Test d'accès refusé aux routes protégées sans authentification.
     */
    public function test_unauthenticated_request_is_blocked()
    {
        $response = $this->getJson('/api/dashboard/stats');
        $response->assertStatus(401);
    }

    /**
     * Test de récupération réussie des statistiques de supervision.
     */
    public function test_authenticated_admin_can_get_stats()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonPath('status', true)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'flotte' => ['total', 'disponible', 'en_mission', 'maintenance'],
                    'interventions_jour' => ['total', 'en_attente', 'en_cours', 'terminees'],
                    'repartition_urgences',
                    'historique_mensuel'
                ]
            ]);
    }

    /**
     * Test de la logique métier d'affectation automatique.
     */
    public function test_automated_assignment_logic()
    {
        // Création d'une intervention en attente d'urgence Réanimation
        $intervention = Intervention::create([
            'patient_id' => $this->patient->id_patient,
            'type_urgence' => 'Réanimation',
            'localisation' => 'Gare Centrale',
            'statut' => 'en_attente',
        ]);

        $service = new AssignmentService();
        $updatedIntervention = $service->affecterAutomatiquement($intervention);

        // L'intervention doit être acceptée et l'ambulance associée
        $this->assertEquals('accepte', $updatedIntervention->statut);
        $this->assertEquals($this->ambulance->id_ambulance, $updatedIntervention->ambulance_id);
        
        // L'ambulance doit changer son statut d'activité
        $this->ambulance->refresh();
        $this->assertEquals('en_mission', $this->ambulance->statut);
    }
}
