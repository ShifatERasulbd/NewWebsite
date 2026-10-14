<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('menu')?->id;

        return [
            'title'  => 'required|string|max:255',
            'status' => 'required|in:draft,published',
        ];
    }
}