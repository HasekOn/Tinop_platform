<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => [
                'sometimes',
                'date',
                Rule::unique('user_availabilities')
                    ->ignore($this->route('user_availability'))
                    ->where(fn ($query) => $query->where('user_id', auth()->id()))
            ],
            'status' => 'sometimes|in:office,remote,vacation,unavailable',
            'notes' => 'nullable|string|max:200',
        ];
    }
}
