<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItems extends Model
{
    use HasFactory;

    protected $table = 'menu_items';

    protected $fillable = [
        'menu_id',
        'parent_id',
        'title',
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

    public function children()
    {
        return $this->hasMany(MenuItems::class, 'parent_id')->orderBy('order');
    }
}