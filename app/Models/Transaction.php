<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'productName',
        'price',
        'name',
        'phone',
        'address',
        'paymentMethod',
        'status'
    ];
}