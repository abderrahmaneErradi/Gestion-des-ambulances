<?php

namespace App\Events;

use App\Models\Ambulance;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AmbulanceStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * L'ambulance mise à jour.
     */
    public $ambulance;

    /**
     * Crée une nouvelle instance d'événement.
     */
    public function __construct(Ambulance $ambulance)
    {
        $this->ambulance = $ambulance->load(['ambulanciers.user']);
    }

    /**
     * Les canaux sur lesquels diffuser l'événement.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('ambulances'),
        ];
    }

    /**
     * Nom de diffusion de l'événement.
     */
    public function broadcastAs(): string
    {
        return 'ambulance.updated';
    }
}
