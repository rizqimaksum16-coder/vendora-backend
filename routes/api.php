<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;

// Route untuk fitur keranjang/transaksi Vendora
Route::apiResource('transactions', TransactionController::class);