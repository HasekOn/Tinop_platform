<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->tokenCan('create');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'creator_id' => ['required', 'integer', Rule::exists('users', 'id')],
            'name' => ['required', 'string'],
            'effort' => ['nullable', Rule::in(['EASY', 'HARD', 'MEDIUM'])],
            'timeEst' => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
        ];
    }
}
