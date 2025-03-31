<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserAvailabilityResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->whenLoaded('user', [
                'id' => $this->user->id,
                'name' => $this->user->name
            ]),
            'date' => $this->date->toDateString(),
            'status' => $this->status,
            'notes' => $this->notes
        ];
    }
}
