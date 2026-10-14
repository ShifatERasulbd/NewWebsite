<?php

namespace App\Http\Requests;

use App\Models\MenuItems;
use Illuminate\Foundation\Http\FormRequest;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Reorder payload
        if ($this->isMethod('post') && $this->has('items')) {
            return [
                'items'             => 'required|array|min:1',
                'items.*.id'        => 'required|integer|exists:menu_items,id',
                'items.*.order'     => 'required|integer|min:0',
                'items.*.parent_id' => 'nullable|integer|exists:menu_items,id',
            ];
        }

        return [
            'menu_id'      => 'required|exists:menus,id',
            'page_id'      => 'nullable|integer|exists:pages,id',
            'title'        => 'required|string|max:255',
            'component_id' => 'nullable|string|max:255',
            'url'          => 'nullable|string|max:255',
            'status'       => 'required|in:draft,published',
            'parent_id'    => [
                'nullable',
                'exists:menu_items,id',
                function ($attribute, $value, $fail) {
                    if (!$value) return;

                    // Calculate hierarchy depth to enforce the max 5-step limit
                    $depth = 1;
                    $current = MenuItems::find($value);
                    while ($current && $current->parent_id) {
                        $depth++;
                        $current = $current->parent;
                    }

                    if ($depth >= 5) {
                        $fail('Maximum menu nesting depth of 5 levels has been reached.');
                    }
                },
            ],
        ];
    }
}