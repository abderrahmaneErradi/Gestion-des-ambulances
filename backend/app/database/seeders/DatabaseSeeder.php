<?php

namespace Database\Seeders;

use App\Models\Ambulance;
use App\Models\Ambulancier;
use App\Models\Intervention;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. CRÉATION DES UTILISATEURS DU SYSTEME

        // Administrateur de secours
        $adminUser = User::create([
            'nom' => 'Dr. Jean Dupont (Admin)',
            'email' => 'admin@secours.fr',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Opérateur de régulation
        $operatorUser = User::create([
            'nom' => 'Sophie Martin (Opératrice)',
            'email' => 'operator@secours.fr',
            'password' => Hash::make('password123'),
            'role' => 'operateur',
        ]);

        // 2. CRÉATION DES AMBULANCES DE LA FLOTTE
        $ambulances = [
            [
                'immatriculation' => 'AB-123-CD',
                'type' => 'Standard',
                'statut' => 'disponible',
            ],
            [
                'immatriculation' => 'EF-456-GH',
                'type' => 'Réanimation',
                'statut' => 'disponible',
            ],
            [
                'immatriculation' => 'IJ-789-KL',
                'type' => 'Standard',
                'statut' => 'en_mission',
            ],
            [
                'immatriculation' => 'MN-012-OP',
                'type' => 'Réanimation',
                'statut' => 'en_mission',
            ],
            [
                'immatriculation' => 'QR-345-ST',
                'type' => 'Standard',
                'statut' => 'maintenance',
            ],
        ];

        $ambulanceModels = [];
        foreach ($ambulances as $amb) {
            $ambulanceModels[] = Ambulance::create($amb);
        }

        // 3. CRÉATION DES AMBULANCIERS ET LEURS COMPTES UTILISATEURS ASSOCIES
        $driverData = [
            ['nom' => 'Marc Lambert', 'email' => 'marc@secours.fr', 'tel' => '0611223344', 'statut' => 'disponible', 'amb_index' => 0],
            ['nom' => 'Lucas Bernard', 'email' => 'lucas@secours.fr', 'tel' => '0622334455', 'statut' => 'disponible', 'amb_index' => 1],
            ['nom' => 'Pierre Moreau', 'email' => 'pierre@secours.fr', 'tel' => '0633445566', 'statut' => 'en_mission', 'amb_index' => 2],
            ['nom' => 'Thomas Roux', 'email' => 'thomas@secours.fr', 'tel' => '0644556677', 'statut' => 'en_mission', 'amb_index' => 3],
            ['nom' => 'Antoine David', 'email' => 'antoine@secours.fr', 'tel' => '0655667788', 'statut' => 'hors_ligne', 'amb_index' => 4],
        ];

        foreach ($driverData as $data) {
            $user = User::create([
                'nom' => $data['nom'],
                'email' => $data['email'],
                'password' => Hash::make('password123'),
                'role' => 'ambulancier',
            ]);

            Ambulancier::create([
                'user_id' => $user->id_user,
                'telephone' => $data['tel'],
                'statut' => $data['statut'],
                'ambulance_id' => $ambulanceModels[$data['amb_index']]->id_ambulance,
            ]);
        }

        // 4. CRÉATION DES PATIENTS ET LEURS COMPTES ASSOCIES
        $patientData = [
            ['nom' => 'Alice Girard', 'email' => 'alice@gmail.com', 'tel' => '0699887766', 'adresse' => '12 Rue de la Paix, Paris'],
            ['nom' => 'Michel Dubois', 'email' => 'michel@gmail.com', 'tel' => '0688776655', 'adresse' => '45 Avenue de la République, Lyon'],
            ['nom' => 'Emma Petit', 'email' => 'emma@gmail.com', 'tel' => '0677665544', 'adresse' => '78 Boulevard Saint-Germain, Paris'],
            ['nom' => 'Julien Lemaire', 'email' => 'julien@gmail.com', 'tel' => '0666554433', 'adresse' => '3 Rue de la Liberté, Marseille'],
            ['nom' => 'Chloé Fontaine', 'email' => 'chloe@gmail.com', 'tel' => '0655443322', 'adresse' => '102 Allée des Tilleuls, Bordeaux'],
        ];

        $patientModels = [];
        foreach ($patientData as $pData) {
            $user = User::create([
                'nom' => $pData['nom'],
                'email' => $pData['email'],
                'password' => Hash::make('password123'),
                'role' => 'patient',
            ]);

            $patientModels[] = Patient::create([
                'user_id' => $user->id_user,
                'telephone' => $pData['tel'],
                'adresse' => $pData['adresse'],
            ]);
        }

        // 5. CRÉATION DES INTERVENTIONS (Récentes et Historiques)

        // A. Interventions pour aujourd'hui
        // - En attente de régulation
        Intervention::create([
            'patient_id' => $patientModels[0]->id_patient,
            'ambulance_id' => null,
            'type_urgence' => 'Réanimation',
            'date_intervention' => Carbon::now(),
            'localisation' => 'Gare de Lyon, Paris',
            'statut' => 'en_attente',
        ]);

        // - Acceptée par régulation
        Intervention::create([
            'patient_id' => $patientModels[1]->id_patient,
            'ambulance_id' => $ambulanceModels[2]->id_ambulance,
            'type_urgence' => 'Standard',
            'date_intervention' => Carbon::now()->subMinutes(30),
            'localisation' => 'Place Bellecour, Lyon',
            'statut' => 'accepte',
        ]);

        // - En cours de route / traitement
        Intervention::create([
            'patient_id' => $patientModels[2]->id_patient,
            'ambulance_id' => $ambulanceModels[3]->id_ambulance,
            'type_urgence' => 'Réanimation',
            'date_intervention' => Carbon::now()->subHours(1),
            'localisation' => '78 Boulevard Saint-Germain, Paris',
            'statut' => 'en_cours',
        ]);

        // - Terminée avec succès
        Intervention::create([
            'patient_id' => $patientModels[3]->id_patient,
            'ambulance_id' => $ambulanceModels[0]->id_ambulance,
            'type_urgence' => 'Standard',
            'date_intervention' => Carbon::now()->subHours(4),
            'localisation' => '3 Rue de la Liberté, Marseille',
            'statut' => 'terminee',
        ]);

        // B. Interventions historiques (pour le graphique des 6 derniers mois)
        // Mois M-1 (Le mois dernier)
        for ($i = 0; $i < 15; $i++) {
            Intervention::create([
                'patient_id' => $patientModels[rand(0, 4)]->id_patient,
                'ambulance_id' => $ambulanceModels[rand(0, 3)]->id_ambulance,
                'type_urgence' => rand(0, 1) ? 'Standard' : 'Réanimation',
                'date_intervention' => Carbon::now()->subMonth()->subDays(rand(1, 25)),
                'localisation' => 'Adresse Intervention M-1',
                'statut' => 'terminee',
            ]);
        }

        // Mois M-2
        for ($i = 0; $i < 20; $i++) {
            Intervention::create([
                'patient_id' => $patientModels[rand(0, 4)]->id_patient,
                'ambulance_id' => $ambulanceModels[rand(0, 3)]->id_ambulance,
                'type_urgence' => rand(0, 1) ? 'Standard' : 'Réanimation',
                'date_intervention' => Carbon::now()->subMonths(2)->subDays(rand(1, 25)),
                'localisation' => 'Adresse Intervention M-2',
                'statut' => 'terminee',
            ]);
        }

        // Mois M-3
        for ($i = 0; $i < 12; $i++) {
            Intervention::create([
                'patient_id' => $patientModels[rand(0, 4)]->id_patient,
                'ambulance_id' => $ambulanceModels[rand(0, 3)]->id_ambulance,
                'type_urgence' => rand(0, 1) ? 'Standard' : 'Réanimation',
                'date_intervention' => Carbon::now()->subMonths(3)->subDays(rand(1, 25)),
                'localisation' => 'Adresse Intervention M-3',
                'statut' => 'terminee',
            ]);
        }

        // Mois M-4
        for ($i = 0; $i < 18; $i++) {
            Intervention::create([
                'patient_id' => $patientModels[rand(0, 4)]->id_patient,
                'ambulance_id' => $ambulanceModels[rand(0, 3)]->id_ambulance,
                'type_urgence' => rand(0, 1) ? 'Standard' : 'Réanimation',
                'date_intervention' => Carbon::now()->subMonths(4)->subDays(rand(1, 25)),
                'localisation' => 'Adresse Intervention M-4',
                'statut' => 'terminee',
            ]);
        }

        // Mois M-5
        for ($i = 0; $i < 25; $i++) {
            Intervention::create([
                'patient_id' => $patientModels[rand(0, 4)]->id_patient,
                'ambulance_id' => $ambulanceModels[rand(0, 3)]->id_ambulance,
                'type_urgence' => rand(0, 1) ? 'Standard' : 'Réanimation',
                'date_intervention' => Carbon::now()->subMonths(5)->subDays(rand(1, 25)),
                'localisation' => 'Adresse Intervention M-5',
                'statut' => 'terminee',
            ]);
        }
    }
}
