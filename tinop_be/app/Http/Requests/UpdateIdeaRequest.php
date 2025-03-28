<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIdeaRequest extends FormRequest
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
                'likes' => ['nullable', 'integer', 'min:0'],
                'dislikes' => ['nullable', 'integer', 'min:0'],
                'description' => ['nullable', 'string'],
            ];
        } else {
            return [
                'user_id' => ['sometimes', 'required', 'integer', Rule::exists('users', 'id')],
                'name' => ['sometimes', 'required', 'string'],
                'likes' => ['sometimes', 'nullable', 'integer', 'min:0'],
                'dislikes' => ['sometimes', 'nullable', 'integer', 'min:0'],
                'description' => ['sometimes', 'nullable', 'string'],
            ];
        }
    }
}
