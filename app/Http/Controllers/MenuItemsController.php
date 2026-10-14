<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuItemRequest;
use App\Models\MenuItems;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuItemsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MenuItems::whereNull('parent_id');

        if ($request->has('menu_id')) {
            $query->where('menu_id', $request->get('menu_id'));
        }

        // Recursively load children up to 5 levels deep (page is auto-loaded via $with)
        $items = $query->with(['children.children.children.children.children'])
            ->orderBy('order')
            ->get();

        return response()->json($items);
    }

    public function store(MenuItemRequest $request): JsonResponse
    {
        $data = $this->withPageUrl($request->validated());

        $maxOrder = MenuItems::where('menu_id', $data['menu_id'])
            ->where('parent_id', $data['parent_id'] ?? null)
            ->max('order') ?? 0;

        $data['order'] = $maxOrder + 1;
        $item = MenuItems::create($data);

        return response()->json([
            'message' => 'Menu item created successfully.',
            'data'    => $item->fresh(),
        ], 201);
    }

    public function reorder(MenuItemRequest $request): JsonResponse
    {
        foreach ($request->validated('items') as $item) {
            MenuItems::where('id', $item['id'])->update([
                'order'     => $item['order'],
                'parent_id' => $item['parent_id'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Menu items reordered successfully.',
        ]);
    }

    public function show(MenuItems $menuItem): JsonResponse
    {
        return response()->json($menuItem);
    }

    public function update(MenuItemRequest $request, MenuItems $menuItem): JsonResponse
    {
        $menuItem->update($this->withPageUrl($request->validated()));

        return response()->json([
            'message' => 'Menu item updated successfully.',
            'data'    => $menuItem->fresh(),
        ]);
    }

    public function destroy(MenuItems $menuItem): JsonResponse
    {
        $menuItem->delete();

        return response()->json([
            'message' => 'Menu item deleted successfully.',
        ]);
    }

    /**
     * When a page is attached, the menu item URL always comes from the page slug.
     */
    private function withPageUrl(array $data): array
    {
        if (!empty($data['page_id'])) {
            $page = Page::find($data['page_id']);

            if ($page) {
                $data['url'] = '/' . ltrim($page->slug, '/');
            }
        }

        return $data;
    }
}