<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->tokenCan('update');
    }

    public function rules(): array
    {
        $method = $this->method();

        if ($method === 'PUT') {
            return [
                'date' => ['required', 'date'],
                'status' => ['required', Rule::in(['office', 'remote', 'vacation', 'unavailable'])],
                'notes' => ['nullable', 'string', 'max:200'],
            ];
        }

        return [
            'date' => ['sometimes', 'nullable', 'date'],
            'status' => ['sometimes', 'nullable', Rule::in(['office', 'remote', 'vacation', 'unavailable'])],
            'notes' => ['sometimes', 'nullable', 'string', 'max:200'],
        ];
    }
}
