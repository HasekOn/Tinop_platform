<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
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
                'creator_id' => ['required', 'integer', Rule::exists('users', 'id')],
                'name' => ['required', 'string'],
                'effort' => ['nullable', Rule::in(['EASY', 'HARD', 'MEDIUM'])],
                'timeEst' => ['nullable', 'date'],
                'description' => ['nullable', 'string'],
            ];
        } else {
            return [
                'creator_id' => ['sometimes', 'required', 'integer', Rule::exists('users', 'id')],
                'name' => ['sometimes', 'required', 'string'],
                'effort' => ['sometimes', 'nullable', Rule::in(['EASY', 'HARD', 'MEDIUM'])],
                'timeEst' => ['sometimes', 'nullable', 'date'],
                'description' => ['sometimes', 'nullable', 'string'],
            ];
        }
    }
}
