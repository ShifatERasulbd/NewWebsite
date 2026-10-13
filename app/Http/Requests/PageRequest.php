<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('page')?->id;

        return [
            'title'  => 'required|string|max:255',
            'slug'   => "nullable|string|max:255|unique:pages,slug,{$id}",
            'status' => 'required|in:draft,published',
        ];
    }
}