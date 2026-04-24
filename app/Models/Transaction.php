<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'nama_produk',
        'harga',
        'nama',
        'telepon',
        'alamat',
        'metode_pembayaran',
        'status'
    ];
}
