<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->tokenCan('update');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $method = $this->method();

        if ($method === 'PUT') {
            return [
                'user_id' => ['required', 'integer', Rule::exists('users', 'id')],
                'name' => ['required', 'string'],
                'status' => ['required', Rule::in(['TO PLAN', 'TO DO', 'IN PROGRESS', 'CANCELLED', 'DONE'])],
                'effort' => ['nullable', Rule::in(['EASY', 'HARD', 'MEDIUM'])],
                'priority' => ['nullable', Rule::in(['LOW', 'MEDIUM', 'HIGH'])],
                'timeEst' => ['nullable', 'date'],
                'description' => ['nullable', 'string'],
            ];
        } else {
            return [
                'user_id' => ['sometimes', 'required', 'integer', Rule::exists('users', 'id')],
                'name' => ['sometimes', 'required', 'string'],
                'status' => ['sometimes', 'required', Rule::in(['TO PLAN', 'TO DO', 'IN PROGRESS', 'CANCELLED', 'DONE'])],
                'effort' => ['sometimes', 'nullable', Rule::in(['EASY', 'HARD', 'MEDIUM'])],
                'priority' => ['sometimes', 'nullable', Rule::in(['LOW', 'MEDIUM', 'HIGH'])],
                'timeEst' => ['sometimes', 'nullable', 'date'],
                'description' => ['sometimes', 'nullable', 'string'],
            ];
        }
    }
}
