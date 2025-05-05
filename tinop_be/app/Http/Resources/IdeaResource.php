<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IdeaResource extends JsonResource
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

        $isOwner = $me && $me->id === $this->user_id;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'likes' => $this->likes,
            'dislikes' => $this->dislikes,
            'description' => $this->description,
            'is_user_owner' => $isOwner,
        ];
    }
}
