<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserAvailabilityRequest extends FormRequest
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
            'date' => [
                'required',
                'date',
                Rule::unique('user_availabilities')->where(fn($query) => $query->where('user_id', auth()->id()))
            ],
            'status' => 'sometimes|in:office,remote,vacation,unavailable|default:office',
            'notes' => 'nullable|string|max:200',
        ];
    }

    protected function prepareForValidation()
    {
        $this->mergeIfMissing(['status' => 'office']);
    }
}
