<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var \App\Models\User|null $me */
        $me = $request->user();

        $isOwner = $me && $me->id === $this->creator_id;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'creator_id' => new UserResource($this->whenLoaded('user')),
            'effort' => $this->effort,
            'timeEst' => $this->timeEst,
            'is_owner' => $isOwner,
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
        ];
    }
}
