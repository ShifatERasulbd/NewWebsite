<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuDesignRequest;
use App\Http\Requests\MenuReorderRequest;
use App\Http\Requests\MenuRequest;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        // Keep the list light: design JSON is loaded on the design page only
        $menus = Menu::orderBy('order')->get()->makeHidden('design');

        return response()->json($menus);
    }

    public function show(Menu $menu): JsonResponse
    {
        return response()->json($menu);
    }

    public function store(MenuRequest $request): JsonResponse
    {
        $menu = Menu::create($request->validated());

        return response()->json([
            'message' => 'Menu created successfully.',
            'data' => $menu,
        ], 201);
    }

    public function reorder(MenuReorderRequest $request): JsonResponse
    {
        foreach ($request->validated('items') as $item) {
            Menu::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'message' => 'Menus reordered successfully.',
        ]);
    }

    public function update(MenuRequest $request, Menu $menu): JsonResponse
    {
        $menu->update($request->validated());

        return response()->json([
            'message' => 'Menu updated successfully.',
            'data' => $menu->makeHidden('design'),
        ]);
    }

    public function destroy(Menu $menu): JsonResponse
    {
        $menu->delete();

        return response()->json([
            'message' => 'Menu deleted successfully.',
        ]);
    }

    // ----- design -----

    public function design(Menu $menu): JsonResponse
    {
        return response()->json([
            'id'     => $menu->id,
            'title'  => $menu->title,
            'design' => $menu->design,
        ]);
    }

    public function updateDesign(MenuDesignRequest $request, Menu $menu): JsonResponse
    {
        $menu->update(['design' => $request->validated('design')]);

        return response()->json([
            'message' => 'Menu design saved successfully.',
            'design'  => $menu->design,
        ]);
    }

    public function uploadLogo(Request $request, Menu $menu): JsonResponse
    {
        $request->validate([
            'logo' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:2048'], // 2 MB
        ]);

        $file = $request->file('logo');
        $base = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'logo';
        $name = $base . '-' . time() . '.' . $file->guessExtension();

        // public/frontend/<file name>
        $file->move(public_path('frontend'), $name);

        return response()->json([
            'message' => 'Logo uploaded successfully.',
            'url'     => '/frontend/' . $name,
        ], 201);
    }
}
