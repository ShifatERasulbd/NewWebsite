<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItems extends Model
{
    use HasFactory;

    protected $table = 'menu_items';
    protected $with = ['page:id,title,slug'];
    protected $fillable = [
        'menu_id',
        'parent_id',
        'title',
        'page_id',
        'component_id',
        'url',
        'order',
        'status',
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }

    public function parent()
    {
        return $this->belongsTo(MenuItems::class, 'parent_id');
    }
    public function page()
    {
        return $this->belongsTo(Page::class, 'page_id');
    }
    public function children()
    {
        return $this->hasMany(MenuItems::class, 'parent_id')->orderBy('order');
    }
}