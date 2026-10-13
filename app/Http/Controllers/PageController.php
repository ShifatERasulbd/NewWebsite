<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Http\Requests\PageRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
  
    public function index()
    {
        return response()->json(Page::latest()->get());
    }

    public function store(PageRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['title']);

        return response()->json(Page::create($data), 201);
    }

    public function show(Page $page)
    {
        return response()->json($page);
    }

    public function update(PageRequest $request, Page $page)
    {
        $data = $request->validated();
        $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['title'], $page->id);

        $page->update($data);

        return response()->json($page);
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $slug = $base;
        $i = 1;

        while (Page::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }
}