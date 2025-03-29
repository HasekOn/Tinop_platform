<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:2000'],
            'commentable_id' => [
                'required',
                'integer',
                Rule::exists($this->input('commentable_type'), 'id')
            ],
            'commentable_type' => [
                'required',
                'string',
                Rule::in(['App\Models\Task', 'App\Models\Idea'])
            ]
        ];
    }

    /**
     * Prepare data for validation
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('commentable_type')) {
            $this->merge([
                'commentable_type' => $this->mapCommentableType(
                    $this->input('commentable_type')
                )
            ]);
        }
    }

    /**
     * @param string $type
     * @return string
     */
    private function mapCommentableType(string $type): string
    {
        $map = [
            'task' => 'App\Models\Task',
            'idea' => 'App\Models\Idea',
        ];

        return $map[strtolower($type)] ?? $type;
    }
}
