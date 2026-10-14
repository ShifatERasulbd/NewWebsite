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
        return [
            'items'          => 'required|array',
            'items.*.id'     => 'required|exists:menus,id',
            'items.*.order'  => 'required|integer',
        ];
    }
}