<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuRequest;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $menus = Menu::latest()->get();
        return response()->json($menus);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MenuRequest $request): JsonResponse
    {
        $menu = Menu::create($request->validated());

        return response()->json([
            'message' => 'Menu created successfully.',
            'data' => $menu,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu): JsonResponse
    {
        return response()->json($menu);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MenuRequest $request, Menu $menu): JsonResponse
    {
        $menu->update($request->validated());

        return response()->json([
            'message' => 'Menu updated successfully.',
            'data' => $menu,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu): JsonResponse
    {
        $menu->delete();

        return response()->json([
            'message' => 'Menu deleted successfully.',
        ]);
    }
}