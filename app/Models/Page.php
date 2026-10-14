<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['title', 'slug', 'status', 'content'];

    protected $casts = ['content' => 'array'];

    protected static function booted(): void
{
    static::updated(function (Page $page) {
        if ($page->wasChanged('slug')) {
            \App\Models\MenuItems::where('page_id', $page->id)
                ->update(['url' => '/' . ltrim($page->slug, '/')]);
        }
    });
}
}
