<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index() {
        return Transaction::all();
    }

    public function store(Request $request) {
        return Transaction::create($request->all());
    }

    public function update(Request $request, $id) {
        $transaction = Transaction::find($id);
        $transaction->update($request->all());
        return $transaction;
    }

    public function destroy($id) {
        return Transaction::destroy($id);
    }
}