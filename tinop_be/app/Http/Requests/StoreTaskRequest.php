<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
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
            'user_id' => ['required', 'integer', Rule::exists('users', 'id')],
            'name' => ['required', 'string'],
            'status' => ['required', Rule::in(['TO PLAN', 'TO DO', 'IN PROGRESS', 'CANCELLED', 'DONE'])],
            'effort' => ['nullable', Rule::in(['EASY', 'HARD', 'MEDIUM'])],
            'priority' => ['nullable', Rule::in(['LOW', 'MEDIUM', 'HIGH'])],
            'timeEst' => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([]);
    }
}
