<?php

namespace App\Events;

use App\Models\Intervention;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InterventionStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * L'intervention mise à jour.
     */
    public $intervention;

    /**
     * Crée une nouvelle instance d'événement.
     */
    public function __construct(Intervention $intervention)
    {
        // Eager-loader les relations utiles pour le front-end
        $this->intervention = $intervention->load(['patient.user', 'ambulance']);
    }

    /**
     * Les canaux sur lesquels diffuser l'événement.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('interventions'),
        ];
    }

    /**
     * Nom de diffusion de l'événement.
     */
    public function broadcastAs(): string
    {
        return 'intervention.updated';
    }
}
