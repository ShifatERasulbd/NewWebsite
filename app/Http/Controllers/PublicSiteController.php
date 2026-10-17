<?php
 
namespace App\Http\Controllers;
 
use App\Models\Menu;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
 
class PublicSiteController extends Controller
{
    /**
     * Header + footer design and published menu items for the public site.
     * The variant comes from design.variant (or "footer" in the title); the
     * first menu (by order) of each variant is used.
     */
    public function layout(): JsonResponse
    {
        $menus = Menu::orderBy('order')->get();
 
        $header = $menus->first(fn (Menu $m) => $this->variantOf($m) === 'header');
        $footer = $menus->first(fn (Menu $m) => $this->variantOf($m) === 'footer');
 
        return response()->json([
            'header' => $header ? $this->payload($header) : null,
            'footer' => $footer ? $this->payload($footer) : null,
        ]);
    }
 
    public function page(string $slug): JsonResponse
    {
        // ADJUST: column names (slug, status/is_published) to match your Page model
        $page = Page::where('slug', $slug)->first();
 
        if (! $page) {
            return response()->json(['message' => 'Not found'], 404);
        }
 
        return response()->json($page);
    }
 
    private function variantOf(Menu $menu): string
    {
        $design = is_array($menu->design) ? $menu->design : [];
 
        if (! empty($design['variant'])) {
            return $design['variant'];
        }
 
        return preg_match('/footer/i', (string) $menu->title) ? 'footer' : 'header';
    }
 
    private function payload(Menu $menu): array
    {
        $items = [];
        $itemsError = null;
 
        try {
            $items = $this->tree($menu);
        } catch (\Throwable $e) {
            report($e); // also in storage/logs/laravel.log
            $itemsError = config('app.debug') ? $e->getMessage() : 'Menu items could not be loaded.';
        }
 
        return [
            'id'          => $menu->id,
            'title'       => $menu->title,
            'design'      => is_array($menu->design) ? $menu->design : null,
            'items'       => $items,
            'items_error' => $itemsError, // visible in /api/public/layout while APP_DEBUG=true
        ];
    }
 
    /**
     * Published items as a nested tree (children[]), same shape the admin preview gets.
     * Reads the menu_items table directly (columns: menu_id, parent_id, order, status,
     * title, url, and optionally page_id). ADJUST the table name if yours differs.
     */
    private function tree(Menu $menu): array
    {
        $rows = DB::table('menu_items')
            ->where('menu_id', $menu->id)
            ->where('status', 'published')
            ->orderBy('order')
            ->get();
 
        // Items linked to a page and without their own URL use the page slug
        $slugs = collect();
        if (
            Schema::hasColumn('menu_items', 'page_id')
            && Schema::hasTable('pages')
            && Schema::hasColumn('pages', 'slug')
        ) {
            $slugs = DB::table('pages')
                ->whereIn('id', $rows->pluck('page_id')->filter()->all())
                ->pluck('slug', 'id');
        }
 
        $byParent = $rows->map(function ($row) use ($slugs) {
            $item = (array) $row;
 
            if (empty($item['url']) && ! empty($item['page_id']) && $slugs->has($item['page_id'])) {
                $item['url'] = '/' . ltrim($slugs[$item['page_id']], '/');
            }
 
            return $item;
        })->groupBy(fn ($item) => $item['parent_id'] ?? 0);
 
        $build = function ($parentId) use (&$build, $byParent) {
            return ($byParent[$parentId] ?? collect())->map(function ($item) use (&$build) {
                $item['children'] = $build($item['id'])->values()->all();
 
                return $item;
            });
        };
 
        return $build(0)->values()->all();
    }
}
 